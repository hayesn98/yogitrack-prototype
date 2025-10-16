const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController.cjs");

router.post("/add", classController.add);

module.exports = router;