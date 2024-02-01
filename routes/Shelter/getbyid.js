const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet');

router.get('/:id', async (req, res) => {
    try {
        const petId = req.params.id;
        console.log(petId)
        const pet = await AddPet.findById(petId);
        
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found.' });
        }

        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pet.' });
    }
});

module.exports = router;
