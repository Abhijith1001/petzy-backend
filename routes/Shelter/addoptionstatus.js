const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../../models/adoptionrequest');
const ApprovedAdoption = require('../../models/ApprovedAdoption');
const RejectedAdoption = require('../../models/RejectedAdoption');
const { Shelter } = require("../../models/shelter");

router.put('/approve/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const adoptionRequest = await AdoptionRequest.findById(applicationId);

    if (!adoptionRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Get the petId of the approved pet
    const approvedPetId = adoptionRequest.petId;

    // Delete all adoption requests with the same petId but different applicationId
    await AdoptionRequest.deleteMany({
      petId: approvedPetId,
      _id: { $ne: applicationId }, // Exclude the one just approved
    });

    const approvedApplication = new ApprovedAdoption({
      petId: approvedPetId,
      userId: adoptionRequest.userId,
      shelterID: adoptionRequest.shelterID,
      shelterName: adoptionRequest.shelterName,
      firstName: adoptionRequest.firstName,
      requestDate: adoptionRequest.requestDate,
      image: adoptionRequest.image,
      petname: adoptionRequest.petname,
      category: adoptionRequest.category,
      price: adoptionRequest.price,
    });

    await approvedApplication.save();
    await adoptionRequest.remove();

    res.status(200).json({ message: 'Application approved' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/re/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { rejectionStatement } = req.body; 

    const adoptionRequest = await AdoptionRequest.findById(applicationId);

    if (!adoptionRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    const rejectedApplication = new RejectedAdoption({
      petId: adoptionRequest.petId,
      userId: adoptionRequest.userId,
      shelterID: adoptionRequest.shelterID,
      shelterName: adoptionRequest.shelterName,
      firstName: adoptionRequest.firstName,
      requestDate: adoptionRequest.requestDate,
      image: adoptionRequest.image,
      petname: adoptionRequest.petname,
      category: adoptionRequest.category,
      rejectionStatement, 
    });

    await rejectedApplication.save();
    await adoptionRequest.remove();

    res.status(200).json({ message: 'Application rejected' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/approved/:shelterId', async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.shelterId);

    const approvedApplications = await ApprovedAdoption.find({ shelterID: shelter._id });
    res.json(approvedApplications);
  } catch (error) {
    console.error('Error fetching approved applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/rejected/:shelterId', async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.shelterId);

    const rejectedApplications = await RejectedAdoption.find({ shelterID: shelter._id });
    res.json(rejectedApplications);
  } catch (error) {
    console.error('Error fetching rejected applications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
