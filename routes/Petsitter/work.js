const express = require('express');
const router = express.Router();
const Hiresitter  = require('../../models/sitterHire');
const { User } = require('../../models/user');

router.get('/pending/:petsitterId', async (req, res) => {
    try {
        const petsitterId = req.params.petsitterId;

        // Find pending hires for the specific petsitterId
        const pendingHires = await Hiresitter.find({
            petsitterId: petsitterId,
            status: 'pending', // Update with your actual status field
        });

        if (!pendingHires || pendingHires.length === 0) {
            return res.status(404).json({ message: 'No pending hires found for this Petsitter' });
        }

        // Extract and display details for each pending hire
        const pendingHiresDetails = await Promise.all(pendingHires.map(async hire => {
            // Find the corresponding user details based on the userId
            const user = await User.findById(hire.userId);

            return {
                requestId: hire._id,
                petsitterId: hire.petsitterId,
                userId: hire.userId,
                status: hire.status,
                username: user ? user.firstName : 'Unknown', // Display username or 'Unknown' if not found
            };
        }));
        console.log(pendingHiresDetails);

        res.status(200).json(pendingHiresDetails);
    } catch (error) {
        console.error('Error fetching pending hires:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/approve', async (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({ message: 'Request ID is required in the request body' });
        }

        // Find the hire by requestId and update the status to 'hired'
        const updatedHire = await Hiresitter.findByIdAndUpdate(requestId, { status: 'hired' }, { new: true });

        if (!updatedHire) {
            return res.status(404).json({ message: 'Hire not found' });
        }

        res.status(200).json(updatedHire);
    } catch (error) {
        console.error('Error approving hire:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/approved/:petsitterId', async (req, res) => {
    try {
        const petsitterId = req.params.petsitterId;

        // Find pending hires for the specific petsitterId
        const approvedHires = await Hiresitter.find({
            petsitterId: petsitterId,
            status: 'hired', // Update with your actual status field
        });

        if (!approvedHires || approvedHires.length === 0) {
            return res.status(404).json({ message: 'No pending hires found for this Petsitter' });
        }

        // Extract and display details for each pending hire
        const approvedHiresDetails = await Promise.all(approvedHires.map(async hire => {
            // Find the corresponding user details based on the userId
            const user = await User.findById(hire.userId);

            return {
                requestId: hire._id,
                petsitterId: hire.petsitterId,
                userId: hire.userId,
                status: hire.status,
                username: user ? user.firstName : 'Unknown', // Display username or 'Unknown' if not found
            };
        }));
        console.log(approvedHiresDetails);

        res.status(200).json(approvedHiresDetails);
    } catch (error) {
        console.error('Error fetching pending hires:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
