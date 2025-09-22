const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const packageModel = new mongoose.Schema({
    packageId: String,
    name: String,
    category: String,
    classnum: String,
    classtype: String,
    startdate: String,
    enddate: String,
    price: String
}, {collection:"package"});

module.exports = mongoose.model("Package", packageModel);