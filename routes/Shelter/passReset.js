const router = require("express").Router();
const Token = require("../../models/token")
const sendEmail = require("../../utils/sendEmail")
const crypto = require("crypto")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")
const bcrypt = require("bcrypt");
const { Shelter } = require("../../models/shelter");



router.post("/passshel", async (req, res) => {
	try {
		const emailSchema = Joi.object({
			email: Joi.string().email().required().label("Email"),
		});
		const { error } = emailSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let shelter = await Shelter.findOne({ email: req.body.email });
		if (!shelter)
			return res
				.status(409)
				.send({ message: "User with given email does not existoo!" });

		let token = await Token.findOne({ userId: shelter._id });
		if (!token) {
			token = await new Token({
				userId: shelter._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url = `${process.env.BASE_URL}password-reset/${shelter._id}/${token.token}/`;
		await sendEmail(shelter.email, "Password Reset", url);

		res
			.status(200)
			.send({ message: "Password reset link sent to your email account" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


router.get("/:id/:token", async (req, res) => {
	try {
		const shelter = await Shelter.findOne({ _id: req.params.id });
		if (!shelter) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: shelter._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});



router.post("/:id/:token", async (req, res) => {
	try {
		const passwordSchema = Joi.object({
			password: passwordComplexity().required().label("Password"),
		});
		const { error } = passwordSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const shelter = await Shelter.findOne({ _id: req.params.id });
		if (!shelter) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: shelter._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		if (!shelter.verified) shelter.verified = true;

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		shelter.password = hashPassword;
		await shelter.save();
		await token.remove();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});


module.exports = router

