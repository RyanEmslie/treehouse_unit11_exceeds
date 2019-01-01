'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/user')
// const ObjectId = mongoose.Schema.Types.ObjectId;



const ReviewSchema = new Schema({
    user: {
        ref: "User",
        type: Schema.Types.ObjectId
      },
	postedOn: {type: Date, default: Date.now},
	rating: {type: Number, required: true, min:1,max: 5},
	review: {type: String}
})


// // Round rating that user entered to nearest whole number
// ReviewSchema.pre('save', function(next) {
// 	Math.round(this.rating);
// 	next();
//   });
  
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;