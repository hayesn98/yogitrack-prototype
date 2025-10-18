const Package = require("../models/packageModel.cjs");
const Instructor = require("../models/instructorModel.cjs");
const Class = require("../models/classModel.cjs");
const Customer = require("../models/customerModel.cjs");

exports.getPackageIds = async (req, res) => {
    try {
        const packages = await Package.find(
            {},
            { packageId: 1, name: 1, _id: 0 }
        ).sort();

        res.json(packages);
    } catch (e) {
        res.status(400).json({ error: e.message });
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
