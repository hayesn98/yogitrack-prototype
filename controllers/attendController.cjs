const Sale = require("../models/saleModel.cjs");
const Instructor = require("../models/instructorModel.cjs");
const Class = require("../models/classModel.cjs");
const Customer = require("../models/customerModel.cjs");

exports.getInstructor = async (req, res) => {
  try {
    const instructorId = req.query.instructorId;
    const instructorDetail = await Instructor.findOne({ instructorId: instructorId });

    res.json(instructorDetail);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    const instructorId = req.query.instructorId;
    const classDetail = await Class.findOne({ instructorId: instructorId });

    res.json(classDetail);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getCustomer = async (req, res) => {
    try {
        const customerId = req.query.customerId;
        const customerDetail = await Customer.findOne({ customerId: customerId });

        res.json(customerDetail);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.add = async (req, res) => {
    try {
        const {
            instructorId,
            customerId,
            date,
            time
        } = req.body;

        if (!instructorId || !customerId || !date || !time) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newAttend = new Attend({ 
            instructorId,
            customerId,
            date,
            time
        });

        await newAttend.save();
        res.status(201).json({ message: "Attendance added successfully", attend1: newAttend });
    } catch (err) {
        console.error("Error adding attendance:", err.message);
        res.status(500).json({ message: "Failed to add attendance", error: err.message });
    }
};

exports.getInstructorIds = async (req, res) => {
  try {
    const instructors = await Instructor.find(
      {},
      { instructorId: 1, firstname: 1, lastname: 1, _id: 0 }
    ).sort();

    res.json(instructors);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getClassIds = async (req, res) => {
  try {
    const classes = await Class.find(
      {},
      { instructorId: 1, day: 1, time: 1, _id: 0 }
    ).sort();

    res.json(classes);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getCustomerIds = async (req, res) => {
    try {
        const customers = await Customer.find(
            {},
            { customerId: 1, firstname: 1, lastname: 1, _id: 0}
        ).sort();

        res.json(customers);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};