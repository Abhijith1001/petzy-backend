const express = require('express');
const router = express.Router();
const { Doctor, validateDoctor } = require('../../models/doctor');
const bcrypt = require('bcrypt');
const Token = require('../../models/token');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');

router.post('/doctorsignup/d', async (req, res) => {
  try {
    const { error } = validateDoctor(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let doctor = await Doctor.findOne({ email: req.body.email });
    if (doctor) {
      console.log('User with given email already exists:', req.body.email);
      return res.status(409).send({ message: 'User with given email already exists!' });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    doctor = await new Doctor({
      ...req.body,
      password: hashedPassword,
    }).save();

    const token = await new Token({
      userId: doctor._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();

    const url = `${process.env.BASE_URL}doctorUser/${doctor._id}/verify/${token.token}`;

    await sendEmail(doctor.email, 'Verify Email', url);

    res.status(201).send({
      message: 'An email has been sent to your account. Please verify.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/:id/verify/:token', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id });
    if (!doctor) {
      return res.status(400).send({ message: 'Invalid link' });
    }

    const token = await Token.findOne({
      userId: doctor._id,
      token: req.params.token,
    });

    if (!token) {
      return res.status(400).send({ message: 'Invalid link' });
    }

    await Doctor.updateOne({ _id: doctor._id }, { verified: true });
    await token.remove();

    res.status(200).send({ message: 'Verification successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;