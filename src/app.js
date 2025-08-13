require('dotenv').config();
const express = require('express');
const cors = require('cors');
const resumeRoutes = require('./routes/resume');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Resume Analyzer backend running on port ${PORT}`);
});