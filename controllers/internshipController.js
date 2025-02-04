import companyProfileModel from '../models/company/companyProfileModel.js';
import internshipModel from '../models/company/internshipModel.js';


// Internship creating controller

const createInternshipController = async (req,res) => {
    const { position,jobType,responsibilities,requirements,keywords,workMode,registeredEmail,aboutIntern } = req.body;


    try {

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

export { createInternshipController,getAllInternshipController };
