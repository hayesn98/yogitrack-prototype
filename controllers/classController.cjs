const Class = require("../models/classModel.cjs");

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

    const allClasses = await Class.find({});
    let conflict = false;
    for (let i = 0; i < allClasses.length; i++) {
      if (allClasses[i].day === day && allClasses[i].time === time) {
        conflict = true;
      }
    }

    if (conflict) {
      let errStr = "This time slot is already full.";
      let selectedTime = time;
      let [hours, minutes] = selectedTime.split(":").map(Number);

      if (hours === 23) {
        errStr += " This day is full, please try another day.";
      }
      else {
        let timeFound = false;

        while ((hours < 22) && (timeFound === false)) {
          hours += 1;

          for (let j = 0; j < allClasses.length; j++) {
            if (allClasses[j].day === day && allClasses[j].time === (hours + ":" + minutes)) {
              // continue searching
            }
            else {
              timeFound = true;
            }
          }
        }

        if (timeFound) {
          if (minutes < 10) {
            errStr += " The next available time is " + hours + ":0" + minutes + ".";
          }
          else {
            errStr += " The next available time is " + hours + ":" + minutes + ".";
          }
        }
        else {
          errStr += " This day is full, please try another day.";
        }
      }

      return res.status(400).json({ message: errStr });
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