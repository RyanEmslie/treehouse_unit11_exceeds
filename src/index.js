"use strict";

// Modules
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require('body-parser').json;

const app = express();


// use bodyParser
app.use(bodyParser());
// set our port
app.set("port", process.env.PORT || 5000);
// http request logging
app.use(morgan("dev"));


// **************************************
// ********** DATABASE ******************
// **************************************
const db = mongoose.connection;
mongoose.connect(
  "mongodb://localhost:27017/course-api",
  { useNewUrlParser: true }
);

db.on("error", function(err) {
  console.log("connection error:", err);
});

db.once("open", function() {
  console.log("database connection sucessful!!");
});



// **************************************
// ********** ROUTES ********************
// **************************************
// send a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    author: "Ryan Emslie",
    message: "Welcome to the Course Review API - Unit 11 Project"
  });
});


// serve files from the "public" folder
app.use('/', express.static('public'));

// set up api routes router
const api_routes = require('./routes');
app.use('/api', api_routes);


// **************************************
// ********** ERROR HANDLERS*************
// **************************************

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    Test: 'From Global Error Handler',
    message: err.message,
    error: {}
  });
});

// start listening on port 5000
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
