const express = require('express');
const morgan = require('morgan');
const app = express();

//---------1) MIDDLEWARE -------

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log("hello from the middleware 👋");
//   next();
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//-----ROUTES-----
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  console.log('Inside the route not found -------💥💥');
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
  // const err = new Error(`Can't find ${req. originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  //If we any argument in next it will automatically assume ther is error and skip all the middleware stack to reach the global error handling middleware
});

//ERROR HANDLING MIDDLEWARE
//by specifying 4 params express already knows this is error handling middleware
app.use(globalErrorHandler);


module.exports = app;
