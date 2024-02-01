const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    livingSituation: String,
    activityLevel: String,
    petType: String,
    hoursAlone: String,
    adoptionExperience: String,
    petActivities: String,
    petSizePreference: String,
    flexibilityForPetCare: String,
    homePetFriendly: String,
});

module.exports = mongoose.model('Profile', profileSchema);
