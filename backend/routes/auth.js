const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Employee = require('../models/employee');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  secure:false,
  port:587,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN;

router.post('/register', async (req, res) => {
  try {
    const {
      firstname, lastname, gender, email, phno, dob,
      street1, street2, city, state, region, postalcode, password
    } = req.body;

    const username = email;

    const existingUser = await Employee.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Employee({
      firstname,
      lastname,
      username,
      email,
      phno,
      dob,
      gender,
      street1,
      street2,
      city,
      state,
      region,
      postalcode,
      password: hashedPassword,
      isVerified: false
    });

    await newUser.save();
    const verificationLink = `http://localhost:3000/api/auth/verify/${newUser._id}`;

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: 'Welcome to Employee Management App',
        html: `<p>Hi ${firstname},</p>
    <p>Thank you for registering. Please click the link below to verify your email:</p>
    <a href="${verificationLink}">${verificationLink}</a>
    <p>Regards,<br/>Employee Management Team</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');


    res.status(201).json({ message: 'User registered successfully and verification email sent.' });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body; 

  try {
    const user = await Employee.findOne({ email: username }); 
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessTokenPayload = {
      userId: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    await Employee.updateOne({ _id: user._id }, { $set: { access_token: accessToken } });

    res.status(200).json({ accessToken, firstname:user.firstname, lastname: user.lastname });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/verify/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await Employee.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found or already verified');
    }

    res.send('Email verified successfully! You can now log in.');
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).send('Verification failed');
  }
});


module.exports = router;
