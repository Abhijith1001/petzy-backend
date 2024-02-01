const express = require('express')
const router = express.Router()
const { Petsitter } = require('../../models/petsittinguser')

router.get('/sitter/:petsitterName', async (req, res) => {
    try {
        const searchTerm  = req.params.petsitterName; // Corrected the variable name and the way to access params
        const sitter = await Petsitter.find({ petsitterName: new RegExp(searchTerm, 'i') });
        console.log(sitter);
        res.status(200).json(sitter);
    } catch (error) {
        console.error('Error fetching petsitter', error);
        res.status(500).json({ message: 'Error fetching petsitter.' });
    }
});

module.exports = router;
