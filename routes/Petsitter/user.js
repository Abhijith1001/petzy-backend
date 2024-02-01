const express = require('express');
const router = express.Router();
const { Petsitter, validatePetsitter } = require('../../models/petsittinguser');
const bcrypt = require('bcrypt');
const Token = require('../../models/token');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');

router.post('/petsittersignup/s', async (req, res) => {
  try {
    console.log('Received data:', req.body);

    const { error } = validatePetsitter(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Trim email to handle leading/trailing spaces
    let petsittinguser = await Petsitter.findOne({ email: req.body.email.trim() });
    if (petsittinguser) {
      return res.status(409).send({ message: 'User with given email already exists!' });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    petsittinguser = await new Petsitter({
      ...req.body,
      password: hashedPassword,
    }).save();

    console.log('Saved user:', petsittinguser);

    const token = await new Token({
      userId: petsittinguser._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();

    console.log('Saved token:', token);

    const url = `${process.env.BASE_URL}petsittinguser/${petsittinguser._id}/verify/${token.token}`;
    await sendEmail(petsittinguser.email, 'Verify Email', url);

    res.status(201).send({
      message: 'An email has been sent to your account. Please verify.',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/:id/verify/:token', async (req, res) => {
  try {
    const petsittinguser = await Petsitter.findOne({ _id: req.params.id });
    if (!petsittinguser) {
      return res.status(400).send({ message: 'Invalid link' });
    }

    const token = await Token.findOne({
      userId: petsittinguser._id,
      token: req.params.token,
    });

    if (!token) {
      return res.status(400).send({ message: 'Invalid link' });
    }

    await Petsitter.updateOne({ _id: petsittinguser._id }, { verified: true });
    await token.remove();

    res.status(200).send({ message: 'Verification successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});
// Export the router
module.exports = router;
