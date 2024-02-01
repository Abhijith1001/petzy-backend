const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet');

router.get('/guest/petss', async (req, res) => {
    try {
        const pets = await AddPet.find({}, '-__v'); 
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pets.' });
    }
});

module.exports = router;


router.get('/s/:petId', async (req, res) => {
    try {
      const petId = req.params.petId;
      const pet = await AddPet.findById(petId).select('-__v');
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
      res.status(200).json(pet);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching pet data.' });
    }
  });