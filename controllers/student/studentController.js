import studentProfileModel from "../../models/student/studentProfileModel.js";

const studentProfileController = async (req,res) => {
        const { fullName,registrationNumber,degree,universityMail,contactNumber,gpa,
            profileImage,idFrontImage,idBackImage, skills,position,qualification,cv,verify,userEmail,certifications
         } = req.body;

         try{
            const student = await studentProfileModel.findOne({universityMail});
            if(student){
                return res.json({ success:false, message:"Your details is exist" });
            }
            else {
                // Split the skills string into an array
                const skillsArray = skills ? skills.split(",").map(skill => skill.trim()) : [];
                const qualificationArray = qualification ? qualification.split(",").map(qualifi => qualifi.trim()) : [];
                const positionArray = position ? position.split(",").map(onePosition => onePosition.trim()) : [];
                const certificationArray = certifications ? certifications.split(",").map(certification => certification.trim()) : [];                
                
                const newStudent = new studentProfileModel(
                    {
                        fullName:fullName,
                        registrationNumber:registrationNumber,
                        degree:degree,
                        universityMail:universityMail,
                        contactNumber:contactNumber,
                        gpa:gpa,
                        profileImageUrl:profileImage,
                        idFrontImageUrl:idFrontImage,
                        idBackImageUrl:idBackImage,
                        skills:skillsArray,
                        position:positionArray,
                        qualification:qualificationArray,
                        cvUrl:cv,
                        verify:verify,
                        registeredEmail:userEmail,
                        certifications:certificationArray,
                    }
                );
                await newStudent.save();
                return res.json({ success:true, message:"Saved successfully!" });
            }
         } catch (error) {
            return res.json({ success:false , message:"An error occured while saving details"});
            
         }
}

const getProfileController = async(req,res) => {
    const { registeredEmail } = req.body;
    
    try {
        const studentProfile = await studentProfileModel.findOne(registeredEmail);
        if(!studentProfile){
            return res.json({ success:false, message:"User not found" })
        } else {
            return res.json({ success:true, data:studentProfile });
        }
    } catch (error) {
        return res.json({ success:false, message:"An unexpected error occured" });
    }
}

const getCVController = async(req,res) => {
    const { registeredEmail } = req.body;

    try {
        const profile = await studentProfileModel.findOne({registeredEmail});
        if(profile){
            return res.json({ success:true, data:profile.cvUrl })
        }
        else {
            return res.json({ success:false, message:"User not found" });
        }
    } catch (error) {
        return res.json({success:false, message:"An error occured"});
    }
}

export { studentProfileController,getProfileController,getCVController };