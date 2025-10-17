const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController.cjs");

router.get("/getPackage", saleController.getPackage);
router.get("/getCustomer", saleController.getCustomer);
router.post("/add", saleController.add);
router.get("/getPackageIds", saleController.getPackageIds);
router.get("/getCustomerIds", saleController.getCustomerIds);

module.exports = router;