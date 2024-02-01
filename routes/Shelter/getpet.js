const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet');

router.get('/getpet', async (req, res) => {
    try {
        const pets = await AddPet.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pets.' });
    }
});

module.exports = router;
