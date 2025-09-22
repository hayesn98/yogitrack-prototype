const Package = require("../models/packageModel.cjs");

exports.search = async (req, res) => {
  try {
    const searchString = req.query.name;
    const packageOne = await Package.find({
      name: { $regex: searchString, $options: "i" },
    });

    if (!packageOne || packageOne.length == 0) {
      return res.status(404).json({ message: "No package found" });
    } else {
      res.json(packageOne[0]);
    }
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

//Find the package selected in the dropdown
exports.getPackage = async (req, res) => {
  try {
    const packageId = req.query.packageId;
    const packageDetail = await Package.findOne({ packageId: packageId });

    res.json(packageDetail);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.add = async (req, res) => {
  try {
    const {
      packageId,
      name,
      category,
      classnum,
      classtype,
      startdate,
      enddate,
      price
    } = req.body;

    // Basic validation
    if (!name || !category || !classnum || !classtype) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new instructor document
    const newPackage = new Package({
      packageId,
      name,
      category,
      classnum,
      classtype,
      startdate,
      enddate,
      price
    });

    // Save to database
    await newPackage.save();
    res.status(201).json({ message: "Package added successfully", package: newPackage });
  } catch (err) {
    console.error("Error adding package:", err.message);
    res.status(500).json({ message: "Failed to add package", error: err.message });
  }
};

//Populate the packageId dropdown
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

exports.getNextId = async (req, res) => {
  const lastPackage = await Packages.find({})
    .sort({ packageId: -1 })
    .limit(1);

  let maxNumber = 1;
  if (lastPackage.length > 0) {
    const lastId = lastPackage[0].packageId;
    const match = lastId.match(/\d+$/);
    if (match) {
      maxNumber = parseInt(match[0]) + 1;
    }
  }
  const nextId = `P${maxNumber}`;
  res.json({ nextId });
};

exports.deletePackage = async (req, res) => {
  try {
     const {packageId} = req.query;
     const result = await Package.findOneAndDelete({ packageId });
     if (!result) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json({ message: "Package deleted", packageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
