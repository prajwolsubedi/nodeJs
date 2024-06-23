const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'This route is not defined yet',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'This route is not yet defined',
  });
};
