const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");

router.put('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const updateData = req.body; 
  

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Shelter not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating shelter details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;
