const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have less than or equal to 40 characters',
      ],
      minLength: [
        10,
        'A tour name must have greater than or equal to 10 characters',
      ],
    //   validate: [validator.isAlpha, "Name should be only characters"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Diffculty is either: esay, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above : 1.0'],
      max: [5, 'Rating must be below : 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
            //this will not work while updatinggg. only work while creating new document
          return val < this.price; //false will trigger the validation error.
        },
        message: 'Discount price ({VALUE}) should be below the regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Your tour must have a description'],
      //remove all the white space in beginning and end.
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Image Cover is required'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//it will be created when we get some data from database so get method is used.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
tourSchema.virtual('Rs').get(function () {
  return this.price * 133.38;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create() but not for insertMany, findOne and FindByIdAndUpdate,
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: false }).toUpperCase();
  next();
});

tourSchema.pre('save', function (next) {
  // console.log('Will save document.....');
  next();
});

//here the doc contains the document that was just saved in database
//post middleware are executed after all pre middleware are completed
tourSchema.post('save', function (doc, next) {
  // console.log("doc in post middle ware", doc);
  next();
});

//QUERY MIDDLEWARE ALLOWS US FUNCTIONS BEFORE OR AFTER CERTAIN QUERY IS EXECUTED LIKE FIND QUERY
// this keyword will point at current query not at current document
//find query is different from findOne which is used by findById
//so the solution for this is to use regular expression that starts with find -> works for all query like findById, findOne, findOneAndUpdate
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//will run after the query is already executed
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ----> ${Date.now() - this.start} milliseconds`);
  //   console.log('docs for last post  middleware', docs);
  next();
});

//AGGREGATION MIDDLEWARE (used before and after aggregation happens)

tourSchema.pre('aggregate', function (next) {
  //we add $match query in front of all aggregate function to remove the secret tour
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  //   console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
