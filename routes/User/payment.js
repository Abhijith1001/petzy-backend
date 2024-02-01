const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { Payment } = require("../../models/payment.js");
const Razorpay = require("razorpay");


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


router.post("/a/checkout", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      throw new Error("Amount is required in the request body.");
    }

    const amountInPaisa = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaisa,
      currency: "INR",
    };
    
    // Create an order using Razorpay API
    const order = await instance.orders.create(options);
    console.log(order);

    // Now, include the paymentId in the response
    res.status(200).json({
      success: true,
      order,
      
    });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(400).json({
      success: false,
      error: error.message || "An error occurred during checkout.",
    });
  }
});


router.post("/a/pay", express.json(), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =  req.body
    console.log(req);

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Example: await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

      res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid payment signature.",
      });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    res.status(500).json({
      success: false,
      error: "An internal server error occurred during payment verification.",
    });
  }
});

module.exports = router;
