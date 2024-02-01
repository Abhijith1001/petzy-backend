const express = require('express');
const router = express.Router();
const { Petsitter } = require('../../models/petsittinguser');

router.get('/findpetsitter', async (req, res) => {
    try {
        const petsitters = await Petsitter.find();
        console.log(petsitters);
        res.status(200).json(petsitters);
    } catch (error) {
        console.error('Error fetching petsitters', error);
        res.status(500).json({ message: 'Error fetching pets.' });
    }
});

module.exports = router;
