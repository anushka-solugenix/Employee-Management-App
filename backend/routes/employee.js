const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const verifyToken = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.post('/register', verifyToken, async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      empId: Math.floor(100000 + Math.random() * 900000).toString(),
    };

    const employee = new Employee(employeeData);
    await employee.save();
    res.status(201).json({ message: 'Employee registered successfully', employee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register employee' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Employee.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Employee not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching employee' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { email: req.body.email },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Email updated successfully', updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
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
