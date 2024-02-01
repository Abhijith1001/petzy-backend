const express = require('express');
const router = express.Router();
const AdoptionRequest = require('./../../models/adoptionrequest');
const { Shelter } = require("../../models/shelter")
const Profile = require('../../models/profile');

// Route to fetch adoption requests
router.get('/:shelterId', async (req, res) => {
  try {
    const shelterId = req.params.shelterId;
    console.log("shelterId:", shelterId);

    const shelter = await Shelter.findById(shelterId);

    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const adoptionRequests = await AdoptionRequest.find({ shelterID: shelter._id });
    res.status(200).json(adoptionRequests);
  } catch (error) {
    console.error('Error retrieving adoption requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to fetch user profiles based on user IDs
router.get('/aa/userprofiles', async (req, res) => {
  const { userIds } = req.query; // Get the user IDs from the query parameters

  try {
    // Find profiles that match the user IDs
    const profiles = await Profile.find({ userId: { $in: userIds } });
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete adoption requests
router.delete('/:applicationId', async (req, res) => {
  const requestId = req.params.applicationId;

  try {
    const deletedRequest = await AdoptionRequest.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    res.status(200).json({ message: 'Adoption request deleted successfully' });
  } catch (error) {
    console.error('Error deleting adoption request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
