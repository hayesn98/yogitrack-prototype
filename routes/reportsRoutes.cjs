const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController.cjs");

//router.post("/add", attendController.add);
router.get("/getPackageIds", reportsController.getPackageIds);
router.get("/getInstructorIds", reportsController.getInstructorIds);
router.get("/getClassIds", reportsController.getClassIds);
router.get("/getCustomerIds", reportsController.getCustomerIds);

module.exports = router;