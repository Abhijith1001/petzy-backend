const express = require('express');
const router = express.Router();
const WishlistProduct = require('../../models/WishlistProduct'); // Create a WishlistProduct model
const Product = require('../../models/product');
const { User } = require('../../models/user');



router.post('/product', async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const existingWishlistItem = await WishlistProduct.findOne({
            productId,
            userId,
        });

        if (existingWishlistItem) {
            return res.status(400).json({ message: 'Product already exists in the wishlist' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { productname, category, image } = product;

        const wishlistProduct = new WishlistProduct({
            productId: product._id,
            productname,
            category,
            image,
            userId,
        });

        await wishlistProduct.save();

        res.status(201).json({ message: 'Product added to wishlist successfully' });
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/u/:userId', async (req, res) => {
    try {
  
      const userId = req.params.userId;
      console.log("userId:", userId);
  
      const user = await User.findById(userId);
  
  
      const wishlist = await WishlistProduct.find({ userId: user._id });
      res.status(200).json(wishlist);
    } catch (error) {
      console.error('Error retrieving wishlist:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    const itemId = req.params.id;
  
    try {
      const deletedItem = await WishlistProduct.findByIdAndDelete(itemId);
  
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
