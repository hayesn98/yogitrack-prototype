const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const classModel = new mongoose.Schema({
    instructorId: String,
    day: String,
    time: String,
    classType: String,
    payRate: String
}, {collection:"class"});

module.exports = mongoose.model("Class", classModel);