
const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    },
});

const upload = multer({ storage: storage });

router.post('/:petId', upload.single('image'), async (req, res) => {
    try {
        const petId = req.params.petId;
        const updatedPetData = req.body;

        if (req.file) {
            updatedPetData.image = req.file.filename; // Set the image field in updatedPetData
        }

        const updatedPet = await AddPet.findByIdAndUpdate(petId, updatedPetData, { new: true });

        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(500).json({ message: 'Error updating pet details.' });
    }
});

module.exports = router;
