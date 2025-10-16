const Class = require("../models/classModel.cjs");

exports.search = async (req, res) => {
  try {
    const searchString = req.query.instructorId;
    const class1 = await Class.find({
      instructorId: { $regex: searchString, $options: "i" },
    });

    if (!class1 || class1.length == 0) {
      return res.status(404).json({ message: "No class found" });
    } else {
      res.json(class1[0]);
    }
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

//Find the package selected in the dropdown
exports.getClass = async (req, res) => {
  try {
    const instructorId = req.query.instructorId;
    const classDetail = await Class.findOne({ instructorId: instructorId });

    res.json(classDetail);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.add = async (req, res) => {
  try {
    const {
      instructorId,
      day,
      time,
      classType,
      payRate
    } = req.body;

    // Basic validation
    if (!instructorId || !day || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new class document
    const newClass = new Class({
      instructorId,
      day,
      time,
      classType,
      payRate
    });

    // Save to database
    await newClass.save();
    res.status(201).json({ message: "Class added successfully", class1: newClass });
  } catch (err) {
    console.error("Error adding class:", err.message);
    res.status(500).json({ message: "Failed to add class", error: err.message });
  }
};

//Populate the instructorId dropdown
exports.getInstructorIds = async (req, res) => {
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

exports.getNextId = async (req, res) => {
  const lastClass = await Class.find({})
    .sort({ instructorId: -1 })
    .limit(1);

  let maxNumber = 1;
  if (lastClass.length > 0) {
    const lastId = lastClass[0].instructorId;
    const match = lastId.match(/\d+$/);
    if (match) {
      maxNumber = parseInt(match[0]) + 1;
    }
  }
  const nextId = `I${maxNumber}`;
  res.json({ nextId });
};

exports.deleteClass = async (req, res) => {
  try {
     const {instructorId} = req.query;
     const result = await Class.findOneAndDelete({ instructorId });
     if (!result) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ message: "Class deleted", instructorId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
