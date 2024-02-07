const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const petsitterSchema = new mongoose.Schema({
  petsitterName: { type: String },
  email: { type: String },
  password: { type: String },
  verified: { type: Boolean, default: false },
  image: { type: String },
  location: { type: String },
  phone: { type: String },
  active: { type: Boolean, default: true },
  about: { type: String },
  pet: { type: String },
  experience: { type: String },
  overview: { type: String },
  selectedGig: { type: String, default: null },
  selectedService: { type: String, default: null }
});


petsitterSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEYS, {
    expiresIn: "7d",
  });
  return token;
};

petsitterSchema.methods.updateSelectedGig = function (selectedGig) {
  this.selectedGig = selectedGig
}

petsitterSchema.methods.updateSelectedService = function (selectedService) {
  this.selectedService = selectedService
}


const Petsitter = mongoose.model("Petsitter", petsitterSchema);

const validatePetsitter = (data) => {
  const schema = Joi.object({
    petsitterName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { Petsitter, validatePetsitter };
