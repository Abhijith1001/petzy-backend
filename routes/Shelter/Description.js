const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet'); 

router.post('/description/:petId', async (req, res) => {
  const { petId } = req.params;
  const { summary, overview, analysis } = req.body;

  try {
    const pet = await AddPet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    pet.summary = summary;
    pet.overview = overview;
    pet.analysis = analysis;


    await pet.save();

    res.status(200).json({ message: 'Pet description saved successfully.', pet });
  } catch (error) {
    console.error('Error saving pet description:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
