const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const Pet = require('../../models/addpet');
const Product = require('../../models/product');
const { User } = require('../../models/user');

// Add an item to the cart
router.post('/', async (req, res) => {
  try {
    const { productId, petId, userId, type } = req.body;

    // Check if the item already exists in the cart
    const existingCart = await Cart.findOne({ productId, petId, userId });

    if (existingCart) {
      return res.status(400).json({ message: 'Item already exists in the cart' });
    }

    // Fetch the product and pet based on their IDs
    const product = await Product.findById(productId);
    const pet = await Pet.findById(petId);

    if (!product && !pet) {
      return res.status(404).json({ message: 'Product or pet not found' });
    }

    const item = product || pet;

    const cart = new Cart({
      productId: product ? product._id : null,
      petId: pet ? pet._id : null,
      productname: item.productname || item.petname,
      category: item.category,
      price: item.price,
      image: item.image,
      userId,
      type: product ? 'product' : 'pet',
    });

    await cart.save();

    res.status(201).json({ message: 'Cart item added successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get the cart for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('userId:', userId);

    const user = await User.findById(userId);

    const cart = await Cart.find({ userId: user._id });

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get the cart and username for a specific user
router.get('/use/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('userId:', userId);

    const user = await User.findById(userId);

    const cart = await Cart.find({ userId: user._id });
    const username = user.firstName;
    console.log(username);

    res.status(200).json({ cart, username });
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an item from the cart
router.delete('/delete/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedItem = await Cart.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
