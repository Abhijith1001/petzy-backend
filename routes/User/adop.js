const express = require('express');
const router = express.Router();
const { User } = require('../../models/user'); // Import the User model
const Profile = require('../../models/profile'); // Import the Profile model

router.get('/adoptionsus', async (req, res) => {
    try {
        const usersWithProfiles = await User.aggregate([
            {
                $lookup: {
                    from: 'profiles', // The name of the Profile collection
                    localField: '_id', // The field to join on in the User collection
                    foreignField: 'userId', // The field to join on in the Profile collection
                    as: 'profile',
                },
            },
            {
                $project: {
                    // Exclude _id field from User collection
                    // Include or exclude specific fields as needed
                    'firstName': 1,
                    'lastName': 1,
                    'email': 1,
                    'profile': 1, // Include the profile field as is
                },
            },
        ]);

        res.json(usersWithProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
