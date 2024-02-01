const express = require('express');
const router = express.Router();
const Pet = require('../../models/addpet'); 
const { Shelter } = require("../../models/shelter")

router.get('/shelter/:shelterId', async (req, res) => {
  try {
    const shelterId = req.params.shelterId;
    console.log("shelterId:", shelterId);

    const shelter = await Shelter.findById(shelterId);

    const pets = await Pet.find({ shelterID: shelter._id }); 

    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
