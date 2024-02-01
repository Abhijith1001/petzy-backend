const express = require('express');
const router = express.Router();
const Profile = require('../../models/profile');
const { User } = require('../../models/user');
const  Pet  = require('../../models/addpet');

router.post('/save-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedProfile = await Profile.create({ userId, username: user.firstName, ...profileData });
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/recommend-pet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const recommendedPets = await Pet.find({
      size: userProfile.petSizePreference,
      category:userProfile.petType
      // Add more criteria based on your Pet model fields
    });

    const matchingPets = recommendedPets.filter((pet) => pet.size === userProfile.petSizePreference);

    if (matchingPets.length > 0) {
      res.status(200).json(matchingPets);
    } else {
      res.status(404).json({ message: 'No matching pets found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
