const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../../models/adoptionrequest');
const { User } = require("../../models/user")
router.get('/:userId', async (req, res) => {
  try {

    const userId = req.params.userId;
    console.log("userId:", userId);

    const user = await User.findById(userId);


    const adoptionRequests = await AdoptionRequest.find({ userId: user._id });
    res.status(200).json(adoptionRequests);
  } catch (error) {
    console.error('Error retrieving adoption requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
