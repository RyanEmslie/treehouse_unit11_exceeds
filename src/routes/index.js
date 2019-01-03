const express = require("express");
const router = express.Router();
const mid = require("../middleware");
const auth = require("basic-auth");

const mongoose = require("mongoose");

const User = require("../models/user");
const Review = require("../models/review");
const Course = require("../models/course");

// *******************
// ******USERS********
// *******************
// GET /api/users
router.get("/users", function(req, res, next) {
  User.find()
    // RETURNS USER ID AND FULLNAME
    .select("_id, fullName")
    .exec(function(err, users) {
      if (err) {
        return next(err);
      } else {
        // STATUS 200
        res.status(200).json({ response: users });
      }
    });
});

// CREATE NEW USER
// POST /api/users
router.post("/users", function(req, res, next) {
  if (req.body.fullName && req.body.emailAddress && req.body.password) {
    // IF TRUE CREATE NEW USER
    const newUserData = {
      fullName: req.body.Fullname,
      email: req.body.emailAddress,
      password: req.body.password
    };
    // RETURN TO ROOT DIRECTORY
    User.create(newUserData, function(err, user) {
      if (err) {
        return next(err);
      } else {
        return res
          .status(201)
          .location("/")
          .send();
      }
    });
  } // end IF TURE
  else {
    res.status(401).json({ error: "DOH! - All fields required." });
  }
});

// *******************
// ******COURSES******
// *******************
// GET /api/courses
router.get("/courses", function(req, res, next) {
  Course.find()
    //RETURNS COUSE ID AND TITLE
    .select("_id, title")
    .exec(function(err, courses) {
      if (err) {
        return next(err);
      } else {
        //STATUS 200
        res.status(200).json({ response: courses });
      }
    });
});

// GET /api/courses/
router.get("/courses/:courseId", (req, res, next) => {
  Course.findOne({ _id: req.params.courseId })
    // RETURNS RELATED USER AND REVIEW DOCUMENTS
    .populate("user reviews")
    .exec(function(err, course) {
      if (err) {
        next(err);
      } else {
        //STATUS 200
        res.status(200).json(course);
      }
    });
});

// CREATE NEW COURSE
// POST /api/courses
router.post("/courses", mid.requireAuth, function(req, res, next) {
  // IF TRUE CREATE NEW USER
  const course = new Course(req.body);
  course.save(function(error) {
    if (error && error.name === "ValidationError") {
      res.status(401).json({
        message: "DOH! - All fields required.",
        response: error
      });
    } else if (error) {
      return next(error);
    } else {
      res
        .status(201)
        .location("/")
        .send();
    }
  });
});

//PUT locates course by ID and Updates
// router.put("/courses/:courseId", (req, res, next) => {
router.put("/courses/:courseId", mid.requireAuth, (req, res, next) => {
  Course.findByIdAndUpdate(
    req.params.courseId,
    { $set: req.body },
    // (err, course) => {
    err => {
      if (err) {
        return next(err);
      } else {
        res.status(204).json();
      }
    }
  );
});

// *******************
// ******REVIEWS******
// *******************

// CREATE NEW REVIEW
// POST /api/courses/:courseId
router.post("/courses/:courseId/reviews", function(req, res, next) {
  // IF TRUE CREATE NEW USER
  const review = new Review(req.body);
  review.save(function(error) {
    if (error && error.name === "ValidationError") {
      res.status(401).json({
        message: "DOH! - All fields required.",
        response: error
      });
    } else if (error) {
      return next(error);
    } else {
      res
        .status(201)
        .location("/courses/:courseId")
        .send();
    }
  });
});


module.exports = router;
