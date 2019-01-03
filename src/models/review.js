'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const User = require('../models/user')

const ReviewSchema = new Schema({
    user: {
        ref: "User",
        type: Schema.Types.ObjectId
      },
	postedOn: {type: Date, default: Date.now},
	rating: {type: Number, required: true, min:1,max: 5},
	review: {type: String}
})

  
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;