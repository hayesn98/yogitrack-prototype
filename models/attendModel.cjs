const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const saleModel = new mongoose.Schema({
    instructorId: String,
    customerId: String,
    date: String,
    time: String
}, {collection:"attend"});

module.exports = mongoose.model("Attend", attendModel);