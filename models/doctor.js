const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const doctorSchema = new mongoose.Schema({
    doctorName: { type: String },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
});

doctorSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};


const Doctor = mongoose.model('Doctor', doctorSchema);

const validateDoctor = (data) => {
    const schema = Joi.object({
        // doctorName: Joi.string().required().label("Doctor Name"), // Correct the label
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = { Doctor, validateDoctor };
