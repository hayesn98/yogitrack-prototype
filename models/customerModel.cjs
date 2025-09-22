const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const customerModel = new mongoose.Schema({
    customerId: String,
    firstname: String,
    lastname: String,
    email: String,
    phone: String,
    preferredContact: String,
    classBalance: String
}, {collection:"customer"});

module.exports = mongoose.model("Customer", customerModel);