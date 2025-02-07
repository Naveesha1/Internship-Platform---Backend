import companyProfileModel from '../models/company/companyProfileModel.js';
import internshipModel from '../models/company/internshipModel.js';
import applyInternshipModel from '../models/student/applyInternshipModel.js';


// Internship creating controller

const createInternshipController = async (req,res) => {
    const { position,jobType,responsibilities,requirements,keywords,workMode,registeredEmail,aboutIntern } = req.body;


    try {

        const currentDate = new Date().toISOString().split('T')[0];
        const companyProfile = await companyProfileModel.findOne({registeredEmail});
        const responsibilitiesArray = responsibilities ? responsibilities.split(",").map(responsibility => responsibility.trim()) : [];
        const requirementsArray = requirements ? requirements.split(",").map(requirement => requirement.trim()): [];
        const keywordsArray = keywords ? keywords.split(",").map(keyword=>keyword.trim()) : [];

        const newInternship = {
            position:position,
            registeredEmail:registeredEmail,
            jobType:jobType,
            responsibilities:responsibilitiesArray,
            requirements:requirementsArray,
            keywords:keywordsArray,
            workMode:workMode,
            aboutIntern:aboutIntern,
            date:currentDate,
        };

        const mergedIntern = { ...companyProfile.toObject() ,...newInternship };
        const keysToRemove = ["_id", "__v", "about","positions","vision","mission","industry","companyDocument"];
        keysToRemove.forEach((key) => delete mergedIntern[key]);
        
        const updatedInternship = new internshipModel(mergedIntern);
        await updatedInternship.save();
        return res.json({success:true, message:"Successfully created"});
    }
    catch (error) {
        console.log("An error occured while creating internship", error);
        return res.json({success:false, message:"Internship creating failed"});
        
    }
}

// Get all internship posts

const getAllInternshipController = async(req,res) => {
    try {
        const internships = await internshipModel.find();
        return res.json({ success:true, data:internships });
    } catch (error) {
        return res.json({ success:false, message:"error fetching data" });
    }
}

const applyInternshipController = async(req,res) => {
    const { userEmail, userName, userCv, position, companyName, companyEmail, internshipId } = req.body;
    try {
        const newApplication = new applyInternshipModel (
            {
            userEmail:userEmail,
            userName:userName,
            userCv:userCv,
            position:position,
            companyName:companyName,
            companyEmail:companyEmail,
            internshipId:internshipId,
        }
    );    
        await newApplication.save();
        return res.json({ success:true, message:"Success" });
        
    } catch (error) {
        return res.json({success:false, message:"error occured"});
    }
}

const getSubmittedApplicationsController = async(req,res) => {
    const { registeredEmail } = req.body;
    try {
        const count = await applyInternshipModel.countDocuments({userEmail:registeredEmail});
        if(count){            
            return res.json({success:true, data:count});
        }
    } catch (error) {
        return res.json({success:false });
    }
}

const remainInternshipController = async(req,res) => {
    const { registeredEmail } = req.body;
    try {
        const appliedInternships = await applyInternshipModel.find({userEmail:registeredEmail});
        const appliedInternshipIds = appliedInternships.map(internship => internship.internshipId);

        const allInternships = await internshipModel.find();

        const remainInternships = allInternships.filter(internship => 
            !appliedInternshipIds.includes(internship._id.toString()) // Convert ObjectId to string
        );

        const remainInternshipCount = remainInternships.length;
        return res.json({success:true, data:remainInternshipCount});

    } catch (error) {
        return res.json({success:fasle});
    }
}

export { createInternshipController,
    getAllInternshipController,
    applyInternshipController,
    getSubmittedApplicationsController,
    remainInternshipController };
