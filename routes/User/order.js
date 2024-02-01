const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Pet = require('../../models/addpet');
const Approved = require('../../models/ApprovedAdoption')

router.post("/", async (req, res) => {
  try {
    const { username, userId, orderId, paymentId, items, totalPrice } = req.body;

    // Create and save the order
    const order = new Order({
      username,
      userId,
      orderId,
      paymentId,
      items,
      totalPrice,
    });
    await order.save();

    for (const item of items) {
      if (item.type === 'product') {
        // Handle product logic as before
        const product = await Product.findById(item.productId);
        if (product && product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          return res.status(400).json({ success: false, error: "Product stock is insufficient." });
        }
      } else if (item.type === 'pet') {
        // Attempt to delete the regular pet
        const pet = await Pet.findByIdAndDelete(item.petId);

        // Attempt to delete the approved adoption (if it exists)
        const adopt = await Approved.findByIdAndDelete(item.petId);

        if (!pet && !adopt) {
          return res.status(400).json({ success: false, error: "Pet not found." });
        }
      }
    }

    // Delete cart items for the user
    await Cart.deleteMany({ userId });

    res.status(201).json({
      success: true,
      message: "Order details saved successfully, and cart items deleted. The pet has been removed from the listing.",
    });
  } catch (error) {
    console.error("Error saving order details:", error);
    res.status(500).json({
      success: false,
      error: "An internal server error occurred during order saving.",
    });
  }
});


router.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
