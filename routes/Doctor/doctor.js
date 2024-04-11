const express = require("express");
const router = express.Router();
const { Doctor } = require("../../models/doctor");

router.get("/:doctorId", async (req, res) => {
    try {
        const doctorId = req.params.doctorId;



        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "doctor not found" });
        }

        const doctorDetails = {
            name: doctor.doctorName,
            email: doctor.email,
            location: doctor.location,
            phone: doctor.phone,
        };
        res.status(200).json(doctorDetails);

    } catch (error) {
        console.error("Error fetching doctor details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
