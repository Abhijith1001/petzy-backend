const express = require('express');
const router = express.Router();
const { Shelter } = require('../../models/shelter');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/shelter');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

router.put('/:shelterId', async (req, res) => {
  try {
    const shelterId = req.params.shelterId;
    const updateData = req.body;

    const updatedShelter = await Shelter.findByIdAndUpdate(shelterId, updateData, { new: true });

    if (!updatedShelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    res.status(200).json(updatedShelter);
  } catch (error) {
    console.error('Error updating shelter details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/image/:shelterId', upload.single('file'), async (req, res) => {
  try {
    const shelterId = req.params.shelterId;
    const imageFilename = req.file.filename;

    const updatedShelter = await Shelter.findByIdAndUpdate(
      shelterId,
      { image: imageFilename },
      { new: true }
    );

    if (!updatedShelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    res.status(201).json(updatedShelter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding image to the shelter.' });
  }
});

module.exports = router;
