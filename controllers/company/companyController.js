import express from "express";
import companyProfileModel from "../../models/company/companyProfileModel.js";
import internshipModel from "../../models/company/internshipModel.js";
import applyInternshipModel from "../../models/student/applyInternshipModel.js";

import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');



// Profile setting up controller
const companyProfileController = async (req, res) => {
  const {
    companyName,
    companyLogo,
    companyEmail,
    location,
    aboutUs,
    positions,
    vision,
    mission,
    contactNumber,
    rating,
    industry,
    companyDocument,
    verify,
    registeredEmail,
  } = req.body;

  try {
    const company = await companyProfileModel.findOne({ companyEmail });
    if (company) {
      return res.json({
        success: false,
        message: "Details under your email is exsist",
      });
    } else {
      //split the positions into an array
      const positionsArray = positions
        ? positions.split(",").map((pos) => pos.trim())
        : [];

      const newCompany = new companyProfileModel({
        companyName: companyName,
        companyLogo: companyLogo,
        companyEmail: companyEmail,
        companyDocument: companyDocument,
        location: location,
        about: aboutUs,
        positions: positionsArray,
        vision: vision,
        mission: mission,
        rating: rating,
        industry: industry,
        contactNumber: contactNumber,
        verify: verify,
        registeredEmail: registeredEmail,
      });
      await newCompany.save();
      return res.json({ success: true, message: "Details saved successfully" });
    }
  } catch (error) {
    console.error("An error occured while saving", error);
    return res.json({ success: false, message: "Details saving failed" });
  }
};

const getCompanyController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const companyProfile = await companyProfileModel.findOne({
      registeredEmail: registeredEmail,
    });
    if (!companyProfile) {
      return res.json({ success: false, message: "Company not found" });
    } else {
      return res.json({ success: true, data: companyProfile });
    }
  } catch (error) {
    return res.json({ success: false, message: "An unexpected error occured" });
  }
};

const getCompanySpecificInternshipController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const internships = await internshipModel.find({
      registeredEmail: registeredEmail,
    });
    const reversedInternships = internships.reverse();
    if (internships) {
      return res.json({ success: true, data: reversedInternships });
    }
  } catch (error) {
    return res.json({ success: false, message: "error fetching data" });
  }
};

const getApplicantsController = async (req, res) => {
  const { registeredEmail } = req.body;
  try {
    const applicants = await applyInternshipModel.find({
      companyRegisteredEmail: registeredEmail,
    });
    if (applicants) {
      return res.json({ success: true, data: applicants });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.json({ success: false, message: "An error occured" });
  }
};

const updateCvStatusController = async (req, res) => {
  const { id, status } = req.body;

  try {
    const application = await applyInternshipModel.findById(id);

    if (!application) {
      return res.json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.json({ success: false, message: "Failed to update status" });
  }
};

const updateHiredController = async (req, res) => {
  const { id, isHired } = req.body;
  try {
    const application = await applyInternshipModel.findById(id);

    if (!application) {
      return res.json({ success: false, message: "Application not found" });
    }

    application.isHired = isHired;
    await application.save();

    return res.json({ success: true, message: "Hire status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.json({ success: false, message: "Failed to update status" });
  }
};


// New controller function for CV analysis with targeted extraction
const analyzeCvController = async (req, res) => {
  try {
    const { cvUrl, internshipId } = req.body;
    
    if (!cvUrl || !internshipId) {
      return res.status(400).json({
        success: false,
        message: "CV URL and internship ID are required"
      });
    }
    
    // Fetch internship details to get requirements, responsibilities, and keywords
    const internship = await internshipModel.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }
    
    // Extract text from the CV PDF
    const cvText = await extractTextFromPdf(cvUrl);
    if (!cvText) {
      return res.status(500).json({
        success: false,
        message: "Failed to extract text from CV"
      });
    }
    
    // Extract just the skills and projects sections from the CV
    const { technicalSkills, projects } = extractRelevantSections(cvText);
    
    // Calculate match score based on requirements, responsibilities, and keywords
    // compared against just the skills and projects
    const matchResult = calculateMatchScore(technicalSkills, projects, internship);
    
    return res.json({
      success: true,
      matchScore: matchResult.score,
      matchedKeywords: matchResult.matchedKeywords
    });
    
  } catch (error) {
    console.error("Error in analyzeCv controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Function to extract text from PDF using pdf-parse
async function extractTextFromPdf(cvUrl) {
  try {
    
    // Force no cache and proper headers for Firebase
    const response = await axios({
      method: 'GET',
      url: cvUrl,
      responseType: 'arraybuffer',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
        
    // Parse the PDF
    const buffer = Buffer.from(response.data);
    
    // Basic options for pdf-parse
    const options = {
      max: 10 // Only process first 10 pages for speed
    };
    
    const data = await pdfParse(buffer, options);
    
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    
    // Detailed error logging
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Headers:", JSON.stringify(error.response.headers));
    } else if (error.request) {
      console.error("No response received", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    return null;
  }
}

// Function to extract Technical Skills and Projects sections from CV text
function extractRelevantSections(cvText) {
  const lines = cvText.split('\n');
  let technicalSkills = '';
  let projects = '';
  
  let currentSection = null;
  
  // Common section header patterns
  const skillSectionPatterns = [
    /technical skills/i,
    /skills/i,
    /technical expertise/i,
    /core competencies/i,
    /technologies/i
  ];
  
  const projectSectionPatterns = [
    /projects/i,
    /project experience/i,
    /academic projects/i,
    /personal projects/i,
    /portfolio/i
  ];
  
  // Other common section headers to detect section boundaries
  const otherSectionPatterns = [
    /education/i,
    /experience/i,
    /work experience/i,
    /employment/i,
    /certifications/i,
    /achievements/i,
    /languages/i,
    /interests/i,
    /references/i,
    /contact/i,
    /about me/i,
    /summary/i,
    /objective/i
  ];
  
  // Process each line to identify sections and collect content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line is a skills section header
    const isSkillsHeader = skillSectionPatterns.some(pattern => pattern.test(line));
    if (isSkillsHeader) {
      currentSection = 'skills';
      continue;
    }
    
    // Check if this line is a projects section header
    const isProjectsHeader = projectSectionPatterns.some(pattern => pattern.test(line));
    if (isProjectsHeader) {
      currentSection = 'projects';
      continue;
    }
    
    // Check if this line is another section header, signaling the end of our current section
    const isOtherHeader = otherSectionPatterns.some(pattern => pattern.test(line));
    if (isOtherHeader) {
      currentSection = null;
      continue;
    }
    
    // Collect content based on current section
    if (currentSection === 'skills') {
      technicalSkills += line + ' ';
    } else if (currentSection === 'projects') {
      projects += line + ' ';
    }
  }
  
  return {
    technicalSkills: technicalSkills.trim(),
    projects: projects.trim()
  };
}

// Function to calculate the match score based on just skills and projects
function calculateMatchScore(technicalSkills, projects, internship) {
  // Combine skills and projects for matching
  const relevantCvContent = (technicalSkills + ' ' + projects).toLowerCase();
  
  // Combine all internship criteria into a single array for matching
  const criteriaToMatch = [];
  
  // Process requirements
  if (internship.requirements && Array.isArray(internship.requirements)) {
    internship.requirements.forEach(req => {
      criteriaToMatch.push({
        text: req,
        type: 'Requirement',
        weight: 1
      });
    });
  }
  
  // Process responsibilities
  if (internship.responsibilities && Array.isArray(internship.responsibilities)) {
    internship.responsibilities.forEach(resp => {
      criteriaToMatch.push({
        text: resp,
        type: 'Responsibility',
        weight: 1
      });
    });
  }
  
  // Process keywords (giving them additional weight)
  if (internship.keywords && Array.isArray(internship.keywords)) {
    internship.keywords.forEach(keyword => {
      criteriaToMatch.push({
        text: keyword,
        type: 'Keyword',
        weight: 2  // Keywords have double weight
      });
    });
  }
  
  // Calculate matches
  let totalWeightedItems = 0;
  let totalMatches = 0;
  let matchedKeywords = [];
  
  criteriaToMatch.forEach(criteria => {
    const criteriaLower = criteria.text.toLowerCase();
    if (relevantCvContent.includes(criteriaLower)) {
      totalMatches += criteria.weight;
      matchedKeywords.push(`${criteria.type}: ${criteria.text}`);
    }
    totalWeightedItems += criteria.weight;
  });
  
  // Calculate percentage match
  // Avoid division by zero
  const percentage = totalWeightedItems > 0 ? (totalMatches / totalWeightedItems) * 100 : 0;
  
  return {
    score: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    matchedKeywords
  };
}




const getApplicationCountController = async (req, res) => {
  const { registeredEmail } = req.body;

  try {
    const applicationCount = await applyInternshipModel.countDocuments({
      companyRegisteredEmail: registeredEmail,
    });

    return res.json({ success: true, count: applicationCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getPositionStatsController = async (req, res) => {
  const { registeredEmail } = req.body;
  
  try {
    // Get all applications for this company
    const applications = await applyInternshipModel.find({
      companyRegisteredEmail: registeredEmail,
    });
    
    if (!applications || applications.length === 0) {
      return res.json({ 
        success: true, 
        positionStats: [] 
      });
    }
    
    // Count applications by position
    const positionCounts = {};
    
    applications.forEach(application => {
      const position = application.position;
      if (positionCounts[position]) {
        positionCounts[position]++;
      } else {
        positionCounts[position] = 1;
      }
    });
    
    // Convert to array format for the chart
    const positionStats = Object.keys(positionCounts).map(position => ({
      position: position,
      count: positionCounts[position]
    }));
    
    // Sort by count (optional)
    positionStats.sort((a, b) => b.count - a.count);
    
    return res.json({
      success: true,
      positionStats
    });
    
  } catch (error) {
    console.error("Error in getPositionStatsController:", error);
    return res.json({ 
      success: false, 
      message: "An error occurred while fetching position statistics" 
    });
  }
};

export {
  companyProfileController,
  getCompanyController,
  getCompanySpecificInternshipController,
  getApplicantsController,
  updateCvStatusController,
  updateHiredController,
  analyzeCvController,
  getApplicationCountController,
  getPositionStatsController,
};
