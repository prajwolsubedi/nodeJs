const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You must specify your name'],
    minLength: [2, 'A Name should be atleast 1 characters!'],
    maxLength: [40, 'A Name should be less than 40 characters!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'You must specify your email!'],
    unique: [true, 'This email has been already used to sign in!'],
    lowercase: true, //convert to lowercase not a validator
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This only works on create and on save!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same!',
    },
  },
});

//ENCRYPTION FOR PASSWORD (USING MONGOOSE MIDDLEWARE I.E PRESAVE -> DOCUMENT MIDDLEWARE)

userSchema.pre('save', async function (next) {
  //we only want to encrypt when there is change in password field (i.e when created newly or changed)
  //if password not modified simply go to next middleware
  if (!this.isModified('password')) return next();
  //bcrypt is async function
  this.password = await bcrypt.hash(this.password, 12);
  //confirmPassword is only needed for the validation and not persisted to db.
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
