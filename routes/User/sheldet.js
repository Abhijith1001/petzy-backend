const express = require('express');
const router = express.Router();
const {Shelter} = require('../../models/shelter');

router.get('/shelterDetails/:shelterId', async (req, res) => {
    try {
      const shelterId = req.params.shelterId;
      console.log(shelterId);
  
      // Use Shelter.findById to find the shelter by _id
      const shelter = await Shelter.findById(shelterId);
  
      if (!shelter) {
        return res.status(404).json({ message: 'Shelter not found' });
      }
  
      // Return the shelter details as JSON
      return res.status(200).json({ shelter });
    } catch (error) {
      console.error('Error fetching shelter details:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
