const Sale = require("../models/saleModel.cjs");
const Package = require("../models/packageModel.cjs");
const Customer = require("../models/customerModel.cjs");

exports.getPackage = async (req, res) => {
    try {
        const packageId = req.query.packageId;
        const packageDetail = await Package.findOne({ packageId: packageId });

        res.json(packageDetail);
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
            packageId,
            amountPaid,
            paymentMode,
            date,
            time,
            startDate,
            endDate,
            customerId
        } = req.body;

        if (!packageId || !amountPaid || !date || !time || !startDate || !endDate || !customerId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const thePackage = await Package.findOne({ packageId: packageId });
        if ((thePackage.startdate != startDate) || (thePackage.enddate != endDate)) {
            return res.status(400).json({ message: "The start and end dates do not match the selected package." });
        }

        let [hours, minutes] = time.split(":").map(Number);
        let currTime = new Date();
        let currHours = currTime.getHours();
        let currMins = currTime.getMinutes();

        let [year, month, day] = date.split("-").map(Number);
        let currDay = currTime.getDate();
        let currMonth = currTime.getMonth();
        let currYear = currTime.getFullYear();

        if (year < currYear) {
            return res.status(400).json({ message: "The entered date is before the current year." });
        } else {
            if (month < currMonth) {
                return res.status(400).json({ message: "The entered date is before the current month." });
            } else {
                if (day < currDay) {
                    return res.status(400).json({ message: "The entered date is before the current day." });
                } else {
                    if (hours < currHours) {
                        return res.status(400).json({ message: "The entered time is before the current hour." });
                    } else {
                        if (minutes < currMins) {
                            return res.status(400).json({ message: "The entered time is before the current minute." });
                        }
                    }
                }
            }
        }

        if (thePackage.price != amountPaid) {
            return res.status(400).json({ message: "The amount paid is inconsistent with the package's price." });
        }

        if (thePackage.classnum != "unlimited") {
            const classNum = Number(thePackage.classnum);

            const theCustomer = await Customer.findOneAndUpdate(
                { customerId: customerId },
                { $inc: {classBalance: classNum } },
                { new: true }
            );
        } else {
            const theCustomer = await Customer.findOneAndUpdate(
                { customerId: customerId },
                { $inc: {classBalance: 999999 } },
                { new: true }
            );
        }

        const newSale = new Sale({ 
            packageId,
            amountPaid,
            paymentMode,
            date,
            time,
            startDate,
            endDate
        });

        await newSale.save();
        res.status(201).json({ message: "Sale added successfully", sale1: newSale });
    } catch (err) {
        console.error("Error adding sale:", err.message);
        res.status(500).json({ message: "Failed to add sale", error: err.message });
    }
};

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