import express from 'express';
import companyProfileModel from '../../models/company/companyProfileModel.js';
import internshipModel from '../../models/company/internshipModel.js';

// Profile setting up controller
const companyProfileController = async(req,res) => {
    const { companyName,companyLogo,companyEmail,location,aboutUs,positions,vision
        ,mission,contactNumber,rating,industry,companyDocument,verify,registeredEmail
     } = req.body;

    try {
        const company = await companyProfileModel.findOne({companyEmail});
        if(company){
            return res.json({success:false, message:"Details under your mail is exsist"})
        }
        else {
            //split the positions into an array
            const positionsArray = positions ? positions.split(",").map(pos => pos.trim()) : [];            

            const newCompany = new companyProfileModel({
                companyName:companyName,
                companyLogo:companyLogo,
                companyEmail:companyEmail,
                companyDocument:companyDocument,
                location:location,
                about:aboutUs,
                positions:positionsArray,
                vision:vision,
                mission:mission,
                rating:rating,
                industry:industry,
                contactNumber:contactNumber,
                verify:verify,
                registeredEmail:registeredEmail,
            });
            await newCompany.save();
            return res.json({ success:true, message:"Details saved successfully" });
        }
    } catch (error) {
        console.error("An error occured while saving", error);
        return res.json({ success:false, message: "Details saving failed" });
    }
}


const getCompanyController = async(req,res) => {
    const { registeredEmail } = req.body;
    try {
        const companyProfile = await companyProfileModel.findOne(registeredEmail);
        if(!companyProfile){
            return res.json({ success:false, message:"Company not found" })
        } else {
            return res.json({ success:true, data:companyProfile });
        }
    } catch (error) {
        return res.json({ success:false, message:"An unexpected error occured" });
    }
} 

const getCompanySpecificInternshipController = async(req,res) => {
    const { registeredEmail } = req.body;
    try {
        const internships = await internshipModel.find({registeredEmail:registeredEmail});
        const reversedInternships = internships.reverse();        
        if(internships){
            return res.json({ success:true, data:reversedInternships });
        }
    } catch (error) {
        return res.json({ success:false, message:"error fetching data" });
    }
}

export { companyProfileController,getCompanyController, getCompanySpecificInternshipController };



