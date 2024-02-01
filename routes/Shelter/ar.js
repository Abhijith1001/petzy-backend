const express = require('express');
const router = express.Router();
const ApprovedAdoption = require('../../models/ApprovedAdoption');
const RejectedAdoption = require('../../models/RejectedAdoption');
const { Shelter } = require("../../models/shelter")


router.get('/approved/:shelterId', async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.shelterId);

    const approvedApplications = await ApprovedAdoption.find({ shelterID: shelter._id });
    res.json(approvedApplications);
  } catch (error) {
    console.error('Error fetching approved applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/rejected/:shelterId', async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.shelterId);

    const rejectedApplications = await RejectedAdoption.find({ shelterID: shelter._id });
    res.json(rejectedApplications);
  } catch (error) {
    console.error('Error fetching rejected applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
