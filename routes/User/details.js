const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet');


router.get('/:userId/:petId', async (req, res) => {
  const { petId } = req.params;


  try {
    const pet = await AddPet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    return res.status(200).json({ pet });
  } catch (error) {
    console.error('Error fetching pet details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
