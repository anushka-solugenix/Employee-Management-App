const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true 
  },
  password: String,
  access_token: String,
  phno: String,
  dob: String,
  gender: String,
  street1: String,
  street2: String,
  city: String,
  state: String,
  region: String,
  postalcode: String,
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
