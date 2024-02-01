const express = require('express');
const router = express.Router();
const ApprovedAdoption = require('../../models/ApprovedAdoption');

router.get('/approved/:userId', async (req, res) => {
  console.log('UserID:', req.params.userId);

  try {
    const userId = req.params.userId;
    
    // Assuming you have a 'userId' field in your ApprovedAdoption model
    const approvedApplications = await ApprovedAdoption.find({ userId: userId });
    
    console.log(approvedApplications);
    res.json(approvedApplications);
  } catch (error) {
    console.error('Error fetching approved applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
