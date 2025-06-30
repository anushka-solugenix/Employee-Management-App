const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes); 
app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
});
