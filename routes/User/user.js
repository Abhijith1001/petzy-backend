const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");


router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;


        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const userDetails = {
            name: user.firstName,
            email: user.email,
            location: user.location,
            phone: user.phone,

        };
        console.log(userDetails);
        res.status(200).json(userDetails);

    } catch (error) {
        console.error("Error fetching shelter details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
