const express = require('express');
const router = express.Router();
const { Doctor } = require('../../models/doctor');
const DocBook = require('../../models/docbook');


router.get('/finddoctor', async (req, res) => {
    try {
        const doctor = await Doctor.find();
        console.log(doctor);
        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error fetching doctor', error);
        res.status(500).json({ message: 'Error fetching doctors.' });
    }
});


router.post('/doc/hire', async (req, res) => {
    try {
        const { doctorId, userId, timeSlot, date } = req.body; 

        // Create a new hire request with the provided details
        const hireRequest = new DocBook({
            doctorId,
            userId, 
            status: 'pending', 
            timeSlot,
            date
        });

        // Save the hire request to the database
        await hireRequest.save();

        // Optionally, you might want to update the doctor status to 'Booked' after hiring
        // This part is optional and depends on your business logic
        await Doctor.findByIdAndUpdate(doctorId, { status: 'Booked' });

        // Send a success response
        res.status(200).json(hireRequest);
    } catch (error) {
        console.error('Error hiring doctor', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
