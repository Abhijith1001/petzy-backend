const express = require("express");
const router = express.Router();
const { Petsitter } = require("../../models/petsittinguser");

router.put('/up/:petsitterId', async (req, res) => {
  try {
    const petsitterId = req.params.petsitterId;
    const updateData = req.body;


    const updatedUser = await Petsitter.findByIdAndUpdate(
      petsitterId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Sitter not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating shelter details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:petsitterId', async (req, res) => {
  try {
    const petsitterId = req.params.petsitterId;

    const sitterUser = await Petsitter.findById(petsitterId);

    if (!sitterUser) {
      return res.status(404).json({ message: 'Sitter not found' });
    }

    res.status(200).json(sitterUser);
  } catch (error) {
    console.error('Error updating shelter details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/updateSelectedGig/:petsitterId', async (req, res) => {
  const petsitterId = req.params.petsitterId;
  const selectedGig = req.body.selectedGig;

  try {
    const petsitter = await Petsitter.findById(petsitterId);
    if (!petsitter) {
      return res.status(404).json({ error: 'User not found' });
    }

    petsitter.updateSelectedGig(selectedGig);
    await petsitter.save();

    return res.json({ message: 'Selected gig updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/updateSelectedService/:petsitterId', async (req, res) => {
  const petsitterId = req.params.petsitterId;
  const selectedService = req.body.selectedService;

  try {
      const petsitter = await Petsitter.findById(petsitterId);
      if (!petsitter) {
          return res.status(404).json({ error: 'User not found' });
      }

      petsitter.updateSelectedService(selectedService);
      await petsitter.save();

      return res.json({ message: 'Selected service updated successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
