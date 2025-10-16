let formMode = "search"; // Tracks the current mode of the form

// Fetch all instructor IDs and populate the dropdown
document.addEventListener("DOMContentLoaded", () => {
  setFormForSearch();
  initClassDropdown();
  addClassDropdownListener();

});

//SEARCH
document.getElementById("searchBtn").addEventListener("click", async () => {
  clearClassForm();
  setFormForSearch();
  initClassDropdown();
});


//ADD
document.getElementById("addBtn").addEventListener("click", async () => {
  setFormForAdd();
});

//SAVE
document.getElementById("saveBtn").addEventListener("click", async () => {
  if (formMode === "add") {
    //Get max ID for instructorId
    const res = await fetch("/api/class/getNextId");
    const {nextId } = await res.json();
    document.getElementById("instructorIdText").value = nextId;

    const form = document.getElementById("classForm");

    const classData = {
      instructorId: nextId,
      firstname: form.day.value.trim(),
      lastname: form.time.value.trim(),
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

      alert(`✅ Class ${classData.instructorId} added successfully!`);
      form.reset();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  }
});

//DELETE
document.getElementById("deleteBtn").addEventListener("click", async () => {
  var select = document.getElementById("instructorIdSelect");
  var instructorId = select.value.split(":")[0];

  const response = await fetch(
    `/api/class/deleteClass?instructorId=${instructorId}`, {
      method: "DELETE"
    });

  if (!response.ok) {
    throw new Error("Class delete failed");
  } else {
    alert(`Class with id ${instructorId} successfully deleted`);
    clearClassForm();
    initClassDropdown();
    
  }
});

async function initClassDropdown() {
  const select = document.getElementById("instructorIdSelect");
  try {
    const response = await fetch("/api/class/getInstructorIds");
    const instructorIds = await response.json();

    instructorIds.forEach((class1) => {
      const option = document.createElement("option");
      option.value = class1.instructorId;
      option.textContent = `${class1.instructorId}:${class1.day} ${class1.time}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.err("Failed to load instructor IDs: ", err);
  }
}

async function addClassDropdownListener() {
  const form = document.getElementById("classForm");
  const select = document.getElementById("instructorIdSelect");
  select.addEventListener("change", async () => {
    var instructorId = select.value.split(":")[0];
    console.log(instructorId);
    try {
      const res = await fetch(
        `/api/class/getClass?instructorId=${instructorId}`
      );
      if (!res.ok) throw new Error("Class search failed");

      const data = await res.json();
      console.log(data);
      if (!data || Object.keys(data).length === 0) {
        alert("No class found");
        return;
      }

      //Fill form with data
      form.day.value = data.day || "";
      form.time.value = data.time || "";
      form.payRate.value = data.payRate || "";

      if (data.classType === "general") {
        form.type[0].checked = true;
      } else form.type[1].checked = true;
    } catch (err) {
      alert(`Error searching class: ${instructorId} - ${err.message}`);
    }
  });
}

function clearClassForm() {
  document.getElementById("classForm").reset(); // Clears all inputs including text, textarea, and unchecks radio buttons
  document.getElementById("instructorIdSelect").innerHTML = "";
}

function setFormForSearch() {
  formMode = "search";
  //toggle back to search mode
  document.getElementById("instructorIdLabel").style.display = "block"; // Show dropdown
  document.getElementById("instructorIdTextLabel").style.display = "none"; // Hide text input
  document.getElementById("instructorIdText").value = "";
  document.getElementById("instructorIdText").style.display = "none";
  document.getElementById("classForm").reset();
}

function setFormForAdd() {
  formMode = "add";
    //hide the instructor id drop down and label
  document.getElementById("instructorIdLabel").style.display = "none";
  document.getElementById("instructorIdTextLabel").style.display = "block";
  document.getElementById("instructorIdText").value = "";
  document.getElementById("classForm").reset();
}
