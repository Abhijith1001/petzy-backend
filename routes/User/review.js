const router = require("express").Router();
const { User } = require("../../models/user");
const Review = require("../../models/review");

router.post('/rev/:userId/:petId', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { userId, petId } = req.params;

    // Check if the user with the specified userId exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch username associated with userId
    const username = user.firstName;

    // Create a new review using the Review model
    const newReview = new Review({
      rating,
      comment,
      userId,
      petId,
      username,  // Include username in the new review
    });

    // Save the review to the database
    await newReview.save();

    console.log("Review saved successfully");
    res.status(201).json({ message: 'Review saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/revlist/:userId/:petId', async (req, res) => {
  try {
    const { userId, petId } = req.params;

    // Fetch reviews for the specific user and pet
    const reviews = await Review.find({ petId });

    // Fetch username associated with userId
    const user = await User.findById(userId);
    const username = user ? user.firstName : null;

    res.status(200).json({ reviews, username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
