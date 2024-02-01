const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile');
const { User } = require('../../models/user');

// Define a route to fetch a user's profile by user ID
router.get('/user-profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const userProfile = await Profile.findOne({ userId });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
  
      res.status(200).json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
