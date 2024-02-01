const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet');

router.post('/addDetails/:shelterId/:petId', async (req, res) => {
  const { petId } = req.params;
  const {
    breed,
    age,
    gender,
    size,
    healthInformation,
    temperament,
    favoriteActivities,
    diet,
    exerciseNeeds,
  } = req.body;

  try {
    const pet = await AddPet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    pet.breed = breed;
    pet.age = age;
    pet.gender = gender;
    pet.size = size;
    pet.healthInformation = healthInformation;
    pet.temperament = temperament;
    pet.favoriteActivities = favoriteActivities;
    pet.diet = diet;
    pet.exerciseNeeds = exerciseNeeds;

    // Save the updated pet
    await pet.save();

    return res.status(200).json({ message: 'Details added successfully', pet });
  } catch (error) {
    console.error('Error adding details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
