const express = require('express')
const router = express.Router()
const HireSitter = require('../../models/sitterHire')
const RequestSitter = require('../../models/sitterRequest')

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



router.post('/reqsitter/:userId', async (req, res) => {
    try {
        const { workHours, services } = req.body;
        const  userId  = req.params.userId

        // Create a new PetSitter document
        const newRequest = new RequestSitter({
            userId,
            workHours,
            services,
           
        });

        // Save the document to the database
        await newRequest.save();

        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;