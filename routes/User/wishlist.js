
const express = require('express');
const router = express.Router();
const Wishlist = require('../../models/wishlist');
const Pet = require('../../models/addpet');
const { Shelter } = require('../../models/shelter');
const { User } = require("../../models/user")
const Product = require("../../models/product")



router.post('/', async (req, res) => {
  try {
    const { petId, userId } = req.body;

    const existingWishlistItem = await Wishlist.findOne({
      petId,
      userId,
    });

    if (existingWishlistItem) {
      return res.status(400).json({ message: 'Item already exists in the wishlist' });
    }

    const pet = await Pet.findById(petId);


    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const { petname, category, image, shelterID } = pet;

    const shelter = await Shelter.findById(shelterID);
    const { shelterName } = shelter;

    const wishlist = new Wishlist({
      petId: pet._id,
      petname,
      category,
      image,
      userId,
      shelterID,
      shelterName,
    });

    await wishlist.save();

    res.status(201).json({ message: 'Wishlist item added successfully' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/:userId', async (req, res) => {
  try {

    const userId = req.params.userId;
    console.log("userId:", userId);

    const user = await User.findById(userId);


    const wishlist = await Wishlist.find({ userId: user._id });
    const username = user.firstName;
    console.log(username);
    res.status(200).json({wishlist,username});
  } catch (error) {
    console.error('Error retrieving wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedItem = await Wishlist.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.status(200).json({ message: 'Wishlist item deleted successfully' });
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;

