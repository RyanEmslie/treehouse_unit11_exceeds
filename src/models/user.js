'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
// const validator = require('validator');

const UserSchema = new Schema({
	fullName: String,
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});


// authenticate input against database documents
// Code taken from the Unit lesson
UserSchema.statics.authenticate = function(email, password, callback) {
	User.findOne({ email: email })
		.exec(function (error, user) {
		  if (error) {
			return callback(error);
		  } else if ( !user ) {
			const err = new Error('User not found.');
			err.status = 401;
			return callback(err);
		  }
		  bcrypt.compare(password, user.password , function(error, result) {
			if (result === true) {
			  return callback(null, user);
			} else {
			  return callback();
			}
		  })
		});
	}


// hash password before saving to database
// Code taken from the Unit lesson
UserSchema.pre('save', function(next) {
	const user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
	  if (err) {
		return next(err);
	  }
	  user.password = hash;
	  next();
	})
  });
 

const User = mongoose.model('User', UserSchema);
module.exports = User;


// const saltRounds = 10;
// UserSchema.methods.setPassword = function (password, confirmPassword) {
//   // Update the User model to store the user's password as a salted & hashed value
//   const salt = bcrypt.genSaltSync(saltRounds);
//   this.password = bcrypt.hashSync(password, salt);
//   this.confirmPassword = bcrypt.hashSync(confirmPassword, salt);
// };

// // Validate email
// UserSchema.path('emailAddress').validate(function (v) {
//   return validator.isEmail(v);
// }, 'Please provide a valid email address.');

// Ensure email is unique
// Model already does this, but we should provide a custom validation error so the user knows what's wrong
// UserSchema.path('emailAddress').validate(function (value, done) {
//   this.model('User').count({ emailAddress: value }, function (err, count) {
//     if (err) {
//       return done(err);
//     }
//     // If count is greater than zero invalidate the request
//     done(!count);
//   });
// }, 'This email address is already being used by another user.');