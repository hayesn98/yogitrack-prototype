const express = require("express");
const router = express.Router();
const attendController = require("../controllers/attendController.cjs");

router.get("/getInstructor", attendController.getInstructor);
router.get("/getClass", attendController.getClass);
router.get("/getCustomer", attendController.getCustomer);
router.post("/add", attendController.add);
router.get("/getInstructorIds", attendController.getInstructorIds);
router.get("/getClassIds", attendController.getClassIds);
router.get("/getCustomerIds", attendController.getCustomerIds);

module.exports = router;