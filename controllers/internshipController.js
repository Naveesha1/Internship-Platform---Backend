import companyProfileModel from "../models/company/companyProfileModel.js";
import internshipModel from "../models/company/internshipModel.js";
import applyInternshipModel from "../models/student/applyInternshipModel.js";
import studentProfileModel from "../models/student/studentProfileModel.js";

// Internship creating controller

const createInternshipController = async (req, res) => {
  const {
    position,
    jobType,
    responsibilities,
    requirements,
    keywords,
    workMode,
    registeredEmail,
    aboutIntern,
  } = req.body;

  try {
    const currentDate = new Date().toISOString();
    const companyProfile = await companyProfileModel.findOne({
      registeredEmail,
    });
    const responsibilitiesArray = responsibilities
      ? responsibilities
          .split(",")
          .map((responsibility) => responsibility.trim())
      : [];
    const requirementsArray = requirements
      ? requirements.split(",").map((requirement) => requirement.trim())
      : [];
    const keywordsArray = keywords
      ? keywords.split(",").map((keyword) => keyword.trim())
      : [];

    const newInternship = {
      position: position,
      registeredEmail: registeredEmail,
      jobType: jobType,
      responsibilities: responsibilitiesArray,
      requirements: requirementsArray,
      keywords: keywordsArray,
      workMode: workMode,
      aboutIntern: aboutIntern,
      date: currentDate,
    };

    const mergedIntern = { ...companyProfile.toObject(), ...newInternship };
    const keysToRemove = [
      "_id",
      "__v",
      "about",
      "positions",
      "vision",
      "mission",
      "industry",
      "companyDocument",
    ];
    keysToRemove.forEach((key) => delete mergedIntern[key]);

    const updatedInternship = new internshipModel(mergedIntern);
    await updatedInternship.save();
    return res.json({ success: true, message: "Successfully created" });
  } catch (error) {
    return res.json({ success: false, message: "Internship creating failed" });
  }
};

// Get all internship posts

const getAllInternshipController = async (req, res) => {
  try {
    const internships = await internshipModel.find();
    return res.json({ success: true, data: internships });
  } catch (error) {
    return res.json({ success: false, message: "error fetching data" });
  }
};

const getMatchingInternshipsController = async (req, res) => {
  const { registeredEmail } = req.body;
  
  try {    
    // Find the student profile
    const studentProfile = await studentProfileModel.findOne({ registeredEmail });
    
    if (!studentProfile) {
      return res.json({ 
        success: false, 
        message: "Student profile not found" 
      });
    }    
    // Extract student skills and positions
    const studentSkills = studentProfile.skills || [];
    const studentPositions = studentProfile.position || [];
        
    // Combine skills and positions into a single array for matching
    const studentKeywords = [...studentSkills, ...studentPositions].map(keyword => 
      keyword.toLowerCase().trim()
    );
    
    // Get all internships
    const allInternships = await internshipModel.find();
        
    // Match internships with student keywords
    const matchingInternships = allInternships.filter(internship => {
      // Extract internship keywords and positions
      const internshipKeywords = internship.keywords || [];
      const internshipPosition = internship.position ? [internship.position] : [];
      
      // Combine into a single array for matching
      const internshipMatchers = [...internshipKeywords, ...internshipPosition].map(keyword => 
        typeof keyword === 'string' ? keyword.toLowerCase().trim() : ''
      );
      
      // Check if any student keyword matches any internship keyword
      const isMatch = studentKeywords.some(studentKeyword => 
        internshipMatchers.some(internshipMatcher => 
          internshipMatcher.includes(studentKeyword) || studentKeyword.includes(internshipMatcher)
        )
      );
            
      return isMatch;
    });

    return res.json({ 
      success: true, 
      data: matchingInternships,
      message: "Matching internships retrieved successfully" 
    });
    
  } catch (error) {
    return res.json({ 
      success: false, 
      message: "Error fetching matching internships" 
    });
  }
};




const applyInternshipController = async (req, res) => {
  const {
    userEmail,
    userName,
    userCv,
    userGpa,
    position,
    companyName,
    companyEmail,
    companyRegisteredEmail,
    internshipId,
  } = req.body;
  try {
    const newApplication = new applyInternshipModel({
      userEmail: userEmail,
      userName: userName,
      userCv: userCv,
      userGpa: userGpa,
      position: position,
      companyName: companyName,
      companyEmail: companyEmail,
      companyRegisteredEmail: companyRegisteredEmail,
      internshipId: internshipId,
    });
    await newApplication.save();
    return res.json({ success: true, message: "Success" });
  } catch (error) {
    return res.json({ success: false, message: "error occured" });
  }
};

const getSubmittedApplicationsController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const appliedApplications = await applyInternshipModel.find({
      userEmail: registeredEmail,
    });

    const count = await applyInternshipModel.countDocuments({
      userEmail: registeredEmail,
    });
    if (count) {
      return res.json({
        success: true,
        count: count,
        data: appliedApplications,
      });
    }
  } catch (error) {
    return res.json({ success: false });
  }
};

const remainInternshipController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const appliedInternships = await applyInternshipModel.find({
      userEmail: registeredEmail,
    });
    const appliedInternshipIds = appliedInternships.map(
      (internship) => internship.internshipId
    );

    const allInternships = await internshipModel.find();

    const remainInternships = allInternships.filter(
      (internship) => !appliedInternshipIds.includes(internship._id.toString()) // Convert ObjectId to string
    );

    const remainInternshipCount = remainInternships.length;
    return res.json({ success: true, data: remainInternshipCount });
  } catch (error) {
    return res.json({ success: fasle });
  }
};

const getResponseCompaniesController = async (req, res) => {
  const { userEmail } = req.body;

  try {
    const respondedApplicationsCount = await applyInternshipModel.countDocuments({
      userEmail,
      status: { $in: [true, false] }, // Only accepted (true) and rejected (false)
    });

    return res.json({
      success: true,
      responseCount: respondedApplicationsCount,
    });
  } catch (error) {
    console.error("Error fetching responded companies:", error);
    return res.json({
      success: false,
      message: "Failed to fetch response companies",
    });
  }
};


const getSeparateResponseCountsController = async (req, res) => {
  const { userEmail } = req.body;

  try {
    const acceptedCount = await applyInternshipModel.countDocuments({
      userEmail,
      status: true,
    });

    const rejectedCount = await applyInternshipModel.countDocuments({
      userEmail,
      status: false,
    });

    return res.json({
      success: true,
      acceptedCount,
      rejectedCount,
    });
  } catch (error) {
    console.error("Error fetching accept/reject counts:", error);
    return res.json({
      success: false,
      message: "Failed to fetch counts",
    });
  }
};


// List of IT-related skills to filter from keywords
const itSkills = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Svelte",
  "Node.js", "Express", "Nest.js", "Django", "Flask", "FastAPI", 
  "Python", "Java", "C#", "C++", "Ruby", "PHP", "Go", "Rust", "Swift", "Kotlin",
  "MongoDB", "MySQL", "PostgreSQL", "Oracle", "SQL Server", "Redis", "Firebase",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions",
  "REST API", "GraphQL", "gRPC", "WebSockets", "Microservices", "Serverless",
  "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Machine Learning", "AI",
  "Blockchain", "Ethereum", "Solidity", "Smart Contracts", "NFT", "Web3",
  "React Native", "Flutter", "iOS", "Android", "Xamarin", "Ionic",
  "Unity", "Unreal Engine", "Game Development", "AR", "VR", "XR",
  "UI/UX", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator",
  "Git", "GitHub", "BitBucket", "SVN", "Agile", "Scrum", "Kanban", "Jira",
  "DevOps", "CI/CD", "Testing", "QA", "Jest", "Cypress", "Selenium", "Playwright",
  "SEO", "Analytics", "Digital Marketing", "Content Management",
  "Linux", "Unix", "Bash", "PowerShell", "Shell Scripting",
  "IoT", "Embedded Systems", "RTOS", "Firmware", "Hardware Programming",
  "Network Security", "Cybersecurity", "Penetration Testing", "Ethical Hacking", "Cryptography",
  "Hadoop", "Spark", "Big Data", "Data Mining", "Data Science", "ETL",
  ".NET", "ASP.NET", "Spring", "Laravel", "Rails", "Next.js", "Gatsby",
  "SASS", "LESS", "Tailwind CSS", "Bootstrap", "Material UI", "Styled Components",
  "PWA", "SPA", "SSR", "SSG", "JAMstack", "Webpack", "Babel", "Rollup", "Vite"
];

// Controller to get skills demand data
const getSkillsDemandController = async (req, res) => {
  try {
    // Fetch all internships to extract keywords
    const internships = await internshipModel.find();
    
    if (!internships || internships.length === 0) {
      return res.json({ 
        success: true, 
        data: [],
        message: "No internship data available" 
      });
    }
    
    // Create a map to count occurrences of each skill
    const skillsCount = {};
    
    // Process each internship's keywords
    internships.forEach(internship => {
      // Skip if no keywords
      if (!internship.keywords || !Array.isArray(internship.keywords)) return;
      
      // Process each keyword
      internship.keywords.forEach(keyword => {
        // Normalize the keyword (trim whitespace and make case-insensitive comparison)
        const normalizedKeyword = keyword.trim();
        
        // Check if this keyword is an IT skill (case-insensitive check)
        const isITSkill = itSkills.some(skill => 
          skill.toLowerCase() === normalizedKeyword.toLowerCase()
        );
        
        // If it's an IT skill, increment its count
        if (isITSkill) {
          // Use the original format from the itSkills array for consistency
          const matchedSkill = itSkills.find(skill => 
            skill.toLowerCase() === normalizedKeyword.toLowerCase()
          );
          
          if (matchedSkill) {
            if (skillsCount[matchedSkill]) {
              skillsCount[matchedSkill]++;
            } else {
              skillsCount[matchedSkill] = 1;
            }
          }
        }
      });
    });
    
    // Convert the map to an array format for the frontend
    const skillsData = Object.entries(skillsCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort by count in descending order
      .slice(0, 5); // Get top 5 skills
    
    return res.json({
      success: true,
      data: skillsData,
      totalInternships: internships.length
    });
    
  } catch (error) {
    console.error("Error in getSkillsDemandController:", error);
    return res.json({ 
      success: false, 
      message: "Failed to fetch skills demand data" 
    });
  }
};




export {
  createInternshipController,
  getAllInternshipController,
  applyInternshipController,
  getSubmittedApplicationsController,
  remainInternshipController,
  getResponseCompaniesController,
  getMatchingInternshipsController,
  getSeparateResponseCountsController,
  getSkillsDemandController,
};
