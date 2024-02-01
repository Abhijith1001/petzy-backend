const { number } = require("joi");
const mongoose = require("mongoose");

const addpetSchema = new mongoose.Schema({
  petname: { type: String },
  category: { type: String },
  description: { type: String },
  price:{type:Number},
  image: { type: String },
  shelterID: { type: mongoose.Schema.Types.ObjectId, ref: 'shelter', required: true },
  breed: { type: String }, // Add Breed field
  age: { type: String }, // Add Age field
  gender: { type: String }, // Add Gender field
  size: { type: String }, // Add Size field
  healthInformation: { type: String }, // Add Health Information field
  temperament: { type: String }, // Add Temperament field
  favoriteActivities: { type: String }, // Add Favorite Activities field
  diet: { type: String }, // Add Diet field
  exerciseNeeds: { type: String }, // Add Exercise Needs field
  summary: String,
  overview: String,
  analysis: String,
});

const AddPet = mongoose.model("AddPet", addpetSchema);

module.exports = AddPet;
