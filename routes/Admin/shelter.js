const express = require('express');
const router = express.Router();
const { Shelter } = require('../../models/shelter');
const Pet = require('../../models/addpet')

router.get('/admin/shelter', async (req, res) => {
    try {
        const users = await Shelter.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/admin/shelter/:userId/activate', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await Shelter.findById(userId);

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



router.get('/admin/shelter/count', async (req, res) => {
    try {
        const userCount = await Shelter.countDocuments();
        res.json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/admin/pet/count', async (req, res) => {
    try {
        const petCount = await Pet.countDocuments();
        res.json({ count: petCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
