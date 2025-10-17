const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const saleModel = new mongoose.Schema({
    packageId: String,
    amountPaid: String,
    paymentMode: String,
    date: String,
    time: String,
    startDate: String,
    endDate: String
}, {collection:"sale"});

module.exports = mongoose.model("Sale", saleModel);