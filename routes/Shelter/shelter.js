const express = require("express");
const router = express.Router();
const { Shelter } = require("../../models/shelter");


router.get("/:shelterId", async (req, res) => {
    try {
        const shelterId = req.params.shelterId;


        const shelter = await Shelter.findById(shelterId);

        if (!shelter) {
            return res.status(404).json({ message: "Shelter not found" });
        }

        const shelterDetails = {
            name: shelter.shelterName,
            email: shelter.email,
            location: shelter.location,
            phone: shelter.phone,

        };
        console.log(shelterDetails);
        res.status(200).json(shelterDetails);

    } catch (error) {
        console.error("Error fetching shelter details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
