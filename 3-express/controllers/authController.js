const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { promisify } = require('util');

const signInToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signInToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

console.log('whatever eslint');
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1. check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2. Check if user exists && password is correct
  //in schema we did password select: false so the password won't appear here as well so
  //we have to write it explicitly here.
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3. If everything ok send json web token to client
  const token = signInToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Get the token from the rquest and check if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401),
    );
  }

  //2. Verifying the token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );
  console.log(decodedToken);

  //3. Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to token no longer exist!', 401),
    );

  //4. Check if user changed password after the JWT token was issued
  if (currentUser.chagedPasswordAfterJWT(decodedToken.iat)) {
    return next(
      new AppError('User recently changed password! Please login again.', 401),
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassowrd = catchAsync(async (req, res, next) => {
  //Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 400));
  }

  //Generate the random reset
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});

  //Send it to users email
});
exports.resetPassowrd = (req, res, next) => {};
