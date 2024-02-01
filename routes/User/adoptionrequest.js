const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../../models/adoptionrequest');
const Pet = require('../../models/addpet');
const { Shelter } = require('../../models/shelter');
const { User } = require('../../models/user');

router.post('/', async (req, res) => {
  try {
    const { petId, userId } = req.body;

    const existingAdopt = await AdoptionRequest.findOne({
      petId,
      userId,
      status: { $ne: 'rejected' },
    });

    if (existingAdopt) {
      return res.status(400).json({ message: 'Item already exists in the wishlist' });
    }

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const { petname, category, image, shelterID, price } = pet;
    console.log("fhasd", shelterID);


    const user = await User.findById(userId);
    const shelter = await Shelter.findById(shelterID);
    console.log("UserId:", shelter);



    // Continue with the rest of the code


    const { firstName } = user;
    const { shelterName } = shelter;



    const adoptionRequest = new AdoptionRequest({
      petId: pet._id,
      petname,
      category,
      image,
      userId,
      shelterID,
      price,
      firstName,
      shelterName // Include the user's name in the adoption request
    });

    await adoptionRequest.save();

    res.status(201).json({ message: 'Adoption request sent successfully' });
  } catch (error) {
    console.error('Error sending adoption request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.delete('/requests/:id', async (req, res) => {
  const requestId = req.params.id;

  try {

    const deletedRequest = await AdoptionRequest.findByIdAndDelete(requestId);

    deletedRequest.status = 'Cancelled';

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    res.status(200).json({ message: 'Adoption request deleted successfully' });
  } catch (error) {
    console.error('Error deleting adoption request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/count/all', async (req, res) => {
  try {
    const adoptionRequestCounts = await AdoptionRequest.aggregate([
      {
        $group: {
          _id: '$petId',
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(adoptionRequestCounts);
    const countsObject = adoptionRequestCounts.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    res.status(200).json({ counts: countsObject });
  } catch (error) {
    console.error('Error fetching adoption request counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;