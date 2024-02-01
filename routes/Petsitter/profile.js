const express = require("express");
const router = express.Router();
const { Petsitter } = require("../../models/petsittinguser");

router.put('/:petsitterId', async (req, res) => {
    try {
      const petsitterId = req.params.petsitterId;
      const updateData = req.body; 
  

      const updatedUser = await Petsitter.findByIdAndUpdate(
        petsitterId,
        updateData,
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Shelter not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating shelter details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;
