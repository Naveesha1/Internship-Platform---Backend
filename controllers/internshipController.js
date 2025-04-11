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
    const currentDate = new Date().toISOString().split("T")[0];
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
    console.log("An error occured while creating internship", error);
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
    console.log("Searching for student with email:", registeredEmail);
    
    // Find the student profile
    const studentProfile = await studentProfileModel.findOne({ registeredEmail });
    
    if (!studentProfile) {
      console.log("Student profile not found for email:", registeredEmail);
      return res.json({ 
        success: false, 
        message: "Student profile not found" 
      });
    }
    
    console.log("Found student profile:", studentProfile._id);
    
    // Extract student skills and positions
    const studentSkills = studentProfile.skills || [];
    const studentPositions = studentProfile.position || [];
    
    console.log("Student skills:", studentSkills);
    console.log("Student positions:", studentPositions);
    
    // Combine skills and positions into a single array for matching
    const studentKeywords = [...studentSkills, ...studentPositions].map(keyword => 
      keyword.toLowerCase().trim()
    );
    
    console.log("Student keywords for matching:", studentKeywords);

    // Get all internships
    const allInternships = await internshipModel.find();
    console.log("Total internships found:", allInternships.length);
    
    // Check if internships have verification field
    console.log("First internship verification status:", 
      allInternships.length > 0 ? allInternships[0].verify : "No internships found");
    
    // Match internships with student keywords
    const matchingInternships = allInternships.filter(internship => {
      // Extract internship keywords and positions
      const internshipKeywords = internship.keywords || [];
      const internshipPosition = internship.position ? [internship.position] : [];
      
      // Combine into a single array for matching
      const internshipMatchers = [...internshipKeywords, ...internshipPosition].map(keyword => 
        typeof keyword === 'string' ? keyword.toLowerCase().trim() : ''
      );
      
      // Log matching attempt for debugging
      console.log(
        `Matching internship ${internship._id}, position: ${internship.position}, ` +
        `keywords: ${JSON.stringify(internshipKeywords)}, ` +
        `matchers: ${JSON.stringify(internshipMatchers)}`
      );

      // Check if any student keyword matches any internship keyword
      const isMatch = studentKeywords.some(studentKeyword => 
        internshipMatchers.some(internshipMatcher => 
          internshipMatcher.includes(studentKeyword) || studentKeyword.includes(internshipMatcher)
        )
      );
      
      if (isMatch) {
        console.log(`Match found for internship: ${internship._id}, position: ${internship.position}`);
      }
      
      return isMatch;
    });

    console.log("Total matching internships:", matchingInternships.length);

    return res.json({ 
      success: true, 
      data: matchingInternships,
      message: "Matching internships retrieved successfully" 
    });
    
  } catch (error) {
    console.error("Error fetching matching internships:", error);
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


export {
  createInternshipController,
  getAllInternshipController,
  applyInternshipController,
  getSubmittedApplicationsController,
  remainInternshipController,
  getResponseCompaniesController,
  getMatchingInternshipsController,
};
