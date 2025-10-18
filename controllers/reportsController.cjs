const Package = require("../models/packageModel.cjs");
const Sale = require("../models/saleModel.cjs");
const Instructor = require("../models/instructorModel.cjs");
const Customer = require("../models/customerModel.cjs");
const Attend = require("../models/attendModel.cjs");

exports.package = async (req, res) => {
    try {
        const {
            packageId
        } = req.body;

        if (!packageId) {
            return res.status(400).json({ message: "Missing package." });
        }

        const allSales = await Sale.find({});
        let count = 0;
        for (let i = 0; i < allSales.length; i++) {
            if (allSales[i].packageId === packageId) {
                count++;
            }
        }

        res.status(201).json({ message: "Generated package sales.", salesCount: count });
    } catch (err) {
        console.error("Error getting sales info:", err.message);
        res.status(500).json({ message: "Failed to get sales info", error: err.message });
    }
};

exports.instructor = async (req, res) => {
    try {
        const {
            instructorId
        } = req.body;

        if (!instructorId) {
            return res.status(400).json({ message: "Missing instructor." });
        }

        const allAttends = await Attend.find({});
        let count = 0;
        for (let i = 0; i < allAttends.length; i++) {
            if (allAttends[i].instructorId === instructorId) {
                count++;
            }
        }

        res.status(201).json({ message: "Generated check-in count.", checkCount: count });
    } catch (err) {
        console.error("Error getting check-in info:", err.message);
        res.status(500).json({ message: "Failed to get check-in info", error: err.message });
    }
}

exports.customer = async (req, res) => {
    try {
        const {
            customerId
        } = req.body;

        if (!customerId) {
            return res.status(400).json({ message: "Missing customer." });
        }

        const allAttends = await Attend.find({});
        let count = 0;
        for (let i = 0; i < allAttends.length; i++) {
            if (allAttends[i].customerId === customerId) {
                count++;
            }
        }

        res.status(201).json({ message: "Generated attendance count.", attendCount: count });
    } catch (err) {
        console.error("Error getting attendance info:", err.message);
        res.status(500).json({ message: "Failed to get attendance info", error: err.message });
    }
}

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
