import MentorProfileModel from "../../models/mentor/mentorProfileModel.js";

const createProfile = async (req, res) => {
  const { mentorName, position, address, contactNumber, registeredEmail } =
    req.body;
  try {
    const profile = await MentorProfileModel.findOne({ registeredEmail });
    if (profile) {
      return res.json({ success: false, message: "Mentor details exsists!" });
    } else {
      const newMentor = new MentorProfileModel({
        name: mentorName,
        address: address,
        contactNumber: contactNumber,
        position: position,
        registeredEmail: registeredEmail,
      });
      await newMentor.save();
      return res.json({ success: true, message: "Data saved succeessfully!" });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "An unexpected error occured!",
    });
  }
};

const getMentorProfile = async(req,res) => {
    const { registeredEmail } = req.body;
    try {
        const profile = await MentorProfileModel.findOne({registeredEmail});
        if(!profile){
            return res.json({success:false, message:"Mentor details not available!"});
        }
        else {
            return res.json({success:true, data:profile});
        }
    } catch (error) {
        return res.json({success:false, message:"An unexpected error occured!"})
    }
}

export { createProfile,getMentorProfile };
