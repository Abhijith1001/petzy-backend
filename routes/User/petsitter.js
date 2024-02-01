const express = require('express')
const router = express.Router()
const HireSitter = require('../../models/sitterHire')

router.post('/sitter/hire', async (req, res) => {
    try {
        const { petsitterId ,userId} = req.body; 

        const hireSitter = new HireSitter({
            petsitterId,
            userId, 
            status: 'pending', 
        });

        await hireSitter.save();


        await HireSitter.findByIdAndUpdate(petsitterId, { status: 'hired' });

        res.status(200).json(hireSitter);
    } catch (error) {
        console.error('Error hiring petsitter', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
