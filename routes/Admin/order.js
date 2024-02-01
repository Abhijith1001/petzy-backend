const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const AdoptionRequest = require('../../models/adoptionrequest');


router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find();
      let totalAmount = 0; // Initialize a variable to store the total amount
      
      orders.forEach((order) => {
        totalAmount += order.totalPrice; // Add the totalPrice from each order to the totalAmount
      });
  
      res.json({
        totalAmount, // Send the totalAmount in the response
        orders, // Send the list of orders
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

  // Get revenue for products and pets
router.get('/revenue', async (req, res) => {
    try {
      // Calculate revenue from product orders
      const productRevenue = await Order.aggregate([
        {
          $match: {
            'items.type': 'product',
          },
        },
        {
          $group: {
            _id: null,
            totalProductRevenue: { $sum: '$totalPrice' },
          },
        },
      ]);
  
      // Calculate revenue from pet orders
      const petRevenue = await Order.aggregate([
        {
          $match: {
            'items.type': 'pet',
          },
        },
        {
          $group: {
            _id: null,
            totalPetRevenue: { $sum: '$totalPrice' },
          },
        },
      ]);
  
      res.json({
        productRevenue: productRevenue[0] ? productRevenue[0].totalProductRevenue : 0,
        petRevenue: petRevenue[0] ? petRevenue[0].totalPetRevenue : 0,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

  router.get('/adoption-data', async (req, res) => {
    try {
      const catCount = await AdoptionRequest.countDocuments({ category: 'cat' });
      const dogCount = await AdoptionRequest.countDocuments({ category: 'dog' });
      const totalRequests = catCount + dogCount;
      
      const catPercentage = (catCount / totalRequests) * 100;
      const dogPercentage = (dogCount / totalRequests) * 100;
  
      res.json({ catPercentage, dogPercentage });
    } catch (error) {
      console.error('Error fetching adoption data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  router.get('/adoption-counts', async (req, res) => {
    try {
      // Assuming you want to count adoption requests for each day
      const adoptionCounts = await AdoptionRequest.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$requestDate' } },
            count: { $sum: 1 },
          },
        },
      ]);
  
      res.json(adoptionCounts);
    } catch (error) {
      console.error('Error fetching adoption counts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
