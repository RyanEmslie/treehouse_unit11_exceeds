"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CourseSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  title: {type: String, required: true},
  description: { type: String, required: true },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{
      stepNumber: Number,
      title: { type: String, required: true },
      description: {type: String,required: true}
    }],
  reviews: [{type: Schema.Types.ObjectId, ref: "Review"}]
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;


// // Ensure course contains at least one step
// CourseSchema.path('steps').validate(function (steps) {
//     if (!steps) {
//       return false;
//     } else if (steps.length === 0) {
//       return false;
//     }
//     return true;
//   }, 'Course must have at least one step');

//   // Update the Course schema with an overallRating virtual property.
//   CourseSchema.virtual('overallRating').get(function(){
//     var ratingTotal = 0;
//     for (var i=0; i<this.reviews.length; i++){
//       ratingTotal += this.reviews[i].rating;
//     }
//     var averageRating = Math.round(ratingTotal/this.reviews.length);

//     return averageRating;
//   });