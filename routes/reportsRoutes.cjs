const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController.cjs");

router.post("/package", reportsController.package);
router.post("/instructor", reportsController.instructor);
router.post("/customer", reportsController.customer);
router.get("/getPackageIds", reportsController.getPackageIds);
router.get("/getInstructorIds", reportsController.getInstructorIds);
router.get("/getCustomerIds", reportsController.getCustomerIds);

module.exports = router;