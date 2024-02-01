const router = require("express").Router();
const { Petsitter } = require("../../models/petsittinguser");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Token = require("../../models/token")
const sendEmail = require("../../utils/sendEmail")
const crypto = require("crypto")

router.post("/log/petsittinglogin", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const petsittinguser = await Petsitter.findOne({ email: req.body.email });
		if (!petsittinguser) {
			console.log("Sheldot")
			return res.status(401).send({ message: "Invalid Email or Password" });

		}

		if (!petsittinguser.active) {
			return res.status(403).json({ error: 'User is not active' });
		  }

		const validPassword = await bcrypt.compare(
			req.body.password,
			petsittinguser.password
		);
		if (!validPassword) {
			console.log(req.body.password)
			console.log(petsittinguser.password)
			return res.status(401).send({ message: "Invalid Email or Password" });
		}
		if (!petsittinguser.verified) {
			let token = await Token.findOne({ userId: petsittinguser._id })
			if (!token) {
				token = await new Token({
					userId: petsittinguser._id,
					token: crypto.randomBytes(32).toString("hex")
				}).save();

				const url = `${process.env.BASE_URL}petsittinguser/${petsittinguser._id}/verify/${token.token}`

				await sendEmail(petsittinguser.email, "verify Email", url)
			}
			res.status(400).send({ message: "An email send to your account please verify" });
		}

		req.session.petsittinguserID = petsittinguser._id;
		console.log(req.session.petsittinguserID);

		const token = petsittinguser.generateAuthToken();
		res.status(200).send({ data: token,petsittinguser_id: petsittinguser._id, message: "logged in successfully" });

	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
