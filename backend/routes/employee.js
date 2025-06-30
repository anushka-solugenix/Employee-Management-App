const nodemailer=require('nodemailer');
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || '_id';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const total = await Employee.countDocuments();

    const employees = await Employee.find()
      .select('-password -access_token')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      employees,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password -access_token');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

router.post('/register', verifyToken, upload.single('userimage'), async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    const employeeData = {
      ...req.body,
      empId: Math.floor(100000 + Math.random() * 900000).toString(),
      userimage: req.file ? req.file.filename : ''
    };

    const employee = new Employee(employeeData);
    await employee.save();
    res.status(201).json({ message: 'Employee registered successfully', employee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register employee' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user found with this email' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password cannot be same as the current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Employee.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: false,
      port: 587,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Employee Management App" <${process.env.MAIL_USERNAME}>`,
      to: user.email,
      subject: 'Password Changed Successfully',
      text: `Hi ${user.firstname},\n\nYour password has been changed successfully.\n\nIf you did not request this, please contact 
      support immediately.\n\nThank you.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password updated successfully. An email has been sent to notify the user.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

router.put('/:id', verifyToken, upload.single('userimage'), async (req, res) => {
  try {
    const updateFields = {
      ...req.body
    };

    if (req.file) {
      updateFields.userimage = req.file.filename;
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Employee not found' });

      res.json({ message: 'Profile updated successfully', updated });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;