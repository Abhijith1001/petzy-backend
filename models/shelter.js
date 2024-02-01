const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const shelterSchema = new mongoose.Schema({
  shelterName: { type: String },
  email: { type: String },
  password: { type: String },
  verified: { type: Boolean },
  image: { type: String },
  location: { type: String }, 
  phone: { type: String },    
	active: { type: Boolean, default: true },
});


shelterSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEYS, {
		expiresIn: "7d",
	});
	return token;
};


const Shelter = mongoose.model("Shelter", shelterSchema);

const validateShelter = (data) => {
  const schema = Joi.object({
    shelterName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { Shelter, validateShelter };
