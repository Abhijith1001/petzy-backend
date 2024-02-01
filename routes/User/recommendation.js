const express = require('express');
const router = express.Router();
const { User } = require('../../models/user');
const Profile = require('../../models/profile');
const Pet = require('../../models/addpet');
const Wishlist = require('../../models/wishlist'); // Add this import

// Define the route for calculating and returning pet recommendations for a user
router.get('/recommend-pet/:userId', async (req, res) => {
    const { userId } = req.params;

    async function calculateRecommendations(userId) {
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                throw new Error('User not found');
            }

            const userProfile = await Profile.findOne({ userId });
            if (!userProfile) {
                throw new Error('User profile not found');
            }

            const userSizePreference = userProfile.petSizePreference;
            const userTypePreference = userProfile.petType;

            const similarUsers = await Profile.find({
                petSizePreference: userSizePreference,
                petType: userTypePreference,
                userId: { $ne: userId },
            });

            const userWishlist = await Wishlist.find({ userId });

            // Find pets from similar users' wishlists
            const recommendedPets = [];

            for (const similarUser of similarUsers) {
                const similarUserWishlist = await Wishlist.find({ userId: similarUser.userId });

                for (const pet of similarUserWishlist) {
                    // Check if the pet is not in the user's wishlist and is not already recommended
                    if (!userWishlist.some((item) => item.petId.toString() === pet.petId.toString()) &&
                        !recommendedPets.some((recPet) => recPet.petId.toString() === pet.petId.toString())) {
                        recommendedPets.push(pet);
                    }
                }
            }

            return recommendedPets;

        } catch (error) {
            throw error;
        }
    }

    try {
        const recommendedPets = await calculateRecommendations(userId);
        console.log(recommendedPets);
        res.json(recommendedPets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
