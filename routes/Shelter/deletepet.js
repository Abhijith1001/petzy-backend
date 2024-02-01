const express = require('express');
const router = express.Router();
const AddPet = require('../../models/addpet');

router.post("/petdelete/:id", async (req, res) => {
    try {
        const petId = req.params.id;
    
        const deletedPet = await AddPet.findByIdAndDelete(petId);

        if (!deletedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting pet.' });
    }
});
router.get("/petdelete/:id", async (req, res) => {
    res.status(200).json({messge:'dfsdf'})
})
module.exports = router;    
