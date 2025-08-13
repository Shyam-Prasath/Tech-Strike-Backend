const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { extractTextFromPDF } = require('../utils/pdf');
const { analyzeResumeWithGemini } = require('../services/gemini');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    console.log('Received file:', req.file);
    const filePath = req.file.path;
    const resumeText = await extractTextFromPDF(filePath);
    console.log('Extracted resume text:', resumeText.slice(0, 500)); // Log first 500 chars
    const jobDescription = req.body.jobDescription || null;
    
    const analysis = await analyzeResumeWithGemini(resumeText, jobDescription);
    console.log('Analysis result:', analysis);
    
    if (!analysis) {
      return res.status(500).json({ error: 'Analysis failed or returned empty result' });
    }

    res.json(analysis);
    
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting uploaded file:', err);
      }
    });
  } catch (err) {
    console.error('Error analyzing resume:', err);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

module.exports = router;