const express = require("express");
const router = express.Router();
const { Petsitter } = require("../../models/petsittinguser");

router.get("/:petsitterId", async (req, res) => {
    try {
        const petsitterId = req.params.petsitterId;



        const petsitter = await Petsitter.findById(petsitterId);

        if (!petsitter) {
            return res.status(404).json({ message: "Petsitter not found" });
        }

        const petsitterDetails = {
            name: petsitter.petsitterName,
            email: petsitter.email,
            location: petsitter.location,
            phone: petsitter.phone,
            about: petsitter.about,
            overview: petsitter.overview,
            pet: petsitter.pet,
            experience: petsitter.experience,
            selectedGig: petsitter.selectedGig,
            selectedService: petsitter.selectedService,
          };
          
        res.status(200).json(petsitterDetails);

    } catch (error) {
        console.error("Error fetching petsitter details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router;
