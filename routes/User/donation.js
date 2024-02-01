const express = require('express');
const router = express.Router();
const Donation = require('../../models/donation')

router.post("/ad/donatio", async (req, res) => {
    try {
        // Extract order details from the request body
        const { username, userId, petId, price } = req.body;
        console.log(req.body);

        // Create a new order document
        const newDonation = new Donation({
            username,
            userId,
            petId,
            price,
        });

        // Save the order to the database
        const savedDonation = await newDonation.save();

        res.status(201).json(savedDonation); // Respond with the saved order
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
