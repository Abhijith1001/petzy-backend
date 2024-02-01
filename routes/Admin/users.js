// adminRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../../models/user');
const AdoptionPending = require('../../models/adoptionrequest')
const AdoptionApproved = require('../../models/ApprovedAdoption')
const AdoptionRejected = require('../../models/RejectedAdoption')


// Display a list of users in a JSON format (for the API)
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Activate or deactivate a user
router.post('/admin/users/:userId/activate', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.active = !user.active;
    await user.save();

    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/admin/users/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/admin/req/count', async (req, res) => {
  try {
      const reqCount = await AdoptionPending.countDocuments();
      res.json({ count: reqCount });
  } catch (error) {
      console.error('Error fetching user count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/admin/appr/count', async (req, res) => {
  try {
      const reqCount = await AdoptionApproved.countDocuments();
      res.json({ count: reqCount });
  } catch (error) {
      console.error('Error fetching user count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/admin/rej/count', async (req, res) => {
  try {
      const reqCount = await AdoptionRejected.countDocuments();
      res.json({ count: reqCount });
  } catch (error) {
      console.error('Error fetching user count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
