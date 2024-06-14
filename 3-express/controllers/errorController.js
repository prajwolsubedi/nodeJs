const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please login again', 401);

const handleDuplicateFieldsErrorDB = (err) => {
  const value = err.errmsg.match(/"(.*?)"/)[0];
  const message = `Duplicate filed value ${value} Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //programming or other unknown error : don't leak error details
  else {
    //log error
    console.log('Error 💥', err);

    //2. Send generic message
    res.status(500).json({
      status: 'error',
      err: err,
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log("Inside the app.use global error handling function -------|")
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { name: err?.name };
    Object.getOwnPropertyNames(err).forEach(function (property) {
      error[property] = err[property];
    });
    console.log('Error ---->', error);
    if (error.name === 'CastError') error = handleCastErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldsErrorDB(err);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
