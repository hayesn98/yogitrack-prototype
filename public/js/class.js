let formMode = "add"; // Tracks the current mode of the form

// Load DOM
document.addEventListener("DOMContentLoaded", () => {
  setFormForAdd();
});

//SAVE
document.getElementById("saveBtn").addEventListener("click", async () => {
  if (formMode === "add") {
    const form = document.getElementById("classForm");

    const classData = {
      instructorId: form.instructorId.value.trim(),
      day: form.day.value.trim(),
      time: form.time.value.trim(),
      classType: form.type[0].checked ? "general" : "special",
      payRate: form.payRate.value.trim(),
    };
    try {
      const res = await fetch("/api/class/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classData),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to add class");

      alert(`✅ Class for instructor ${classData.instructorId} added successfully!`);
      form.reset();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  }
});

function clearClassForm() {
  document.getElementById("classForm").reset(); // Clears all inputs including text, textarea, and unchecks radio buttons
}

function setFormForAdd() {
  formMode = "add";
  document.getElementById("classForm").reset();
}
