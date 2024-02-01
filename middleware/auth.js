const express = require('express');
const router = express.Router();
const Pet = require('../../models/addpet');
const authMiddleware = require('../../middleware/auth'); // Import your authentication middleware here

// Apply authentication middleware to protect this route
router.get('/shelter/:shelterId', authMiddleware, async (req, res) => {
  try {
    const shelterId = req.params.shelterId;
    console.log(shelterId);

    // Check if the shelter ID from the route matches the currently logged-in user's ID
    if (shelterId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const pets = await Pet.find({ shelterId });

    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
