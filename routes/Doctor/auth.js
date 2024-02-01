const express = require('express');
const router = express.Router();
const { Doctor, validateDoctor } = require('../../models/doctor');
const bcrypt = require('bcrypt');
const Token = require('../../models/token');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');

router.post('/doctorlogin/dl', async (req, res) => {
  try {
    const { error } = validateDoctor(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const doctor = await Doctor.findOne({ email: req.body.email });
    if (!doctor) {
      return res.status(401).send({ message: 'Invalid Email or Password' });
    }

    if (!doctor.verified) {
      let token = await Token.findOne({ userId: doctor._id });

      if (!token) {
        token = await new Token({
          userId: doctor._id,
          token: crypto.randomBytes(32).toString('hex'),
        }).save();

        const url = `${process.env.BASE_URL}doctorUser/${doctor._id}/verify/${token.token}`;
        await sendEmail(doctor.email, 'Verify Email', url);
      }

      return res.status(400).send({ message: 'An email has been sent to your account. Please verify.' });
    }

    const validPassword = await bcrypt.compare(req.body.password, doctor.password);

    if (!validPassword) {
      return res.status(401).send({ message: 'Invalid Email or Password' });
    }

    const token = doctor.generateAuthToken();
    res.status(200).send({ data: token, doctor_id: doctor._id, message: 'Logged in successfully' });
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