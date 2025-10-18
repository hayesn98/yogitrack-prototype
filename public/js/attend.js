let formMode = "idle";

document.addEventListener("DOMContentLoaded", () => {
    setFormForAdd();
    initInstructorDropdown();
    initCustomerDropdown();
});

document.getElementById("classBtn").addEventListener("click", async () => {
    const form = document.getElementById("attendForm");

    if (form.instructorId.value.trim() != "") {
        initClassDropdown(form.instructorId.value.trim());
        formMode = "add";
    }

    let currDateTime = new Date();
    let currDate = currDateTime.getFullYear() + "-" + String(currDateTime.getMonth() + 1).padStart(2, "0") + "-" + String(currDateTime.getDate()).padStart(2, "0");
    form.date.value = currDate;
    let currTime = String(currDateTime.getHours()).padStart(2, "0") + ":" + String(currDateTime.getMinutes()).padStart(2, "0");
    form.time.value = currTime;
});

document.getElementById("saveBtn").addEventListener("click", async () => {
    if (formMode === "add") {
        const form = document.getElementById("attendForm");
        const selectedClass = document.getElementById("instructorIdSelect2");
        const classOptions = selectedClass.options[selectedClass.selectedIndex];

        if (!classOptions || !classOptions.value) {
            alert("Please select a class.");
            return;
        }

        const attendData = {
            instructorId: form.instructorId.value.trim(),
            customerId: form.customerId.value.trim(),
            date: form.date.value.trim(),
            time: form.time.value.trim(),
        };

        attendData.classDate = classOptions.dataset.day;
        attendData.classTime = classOptions.dataset.time;

        try {
            let res = await fetch("/api/attend/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(attendData),
            });

            let result = await res.json();

            if (res.status === 409 && result.duplicate) {
                if (confirm(`${result.message}`)) {
                    attendData.forceAdd = true;

                    res = await fetch("/api/attend/add", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(attendData),
                    });

                    result = await res.json();

                    if (!res.ok)
                        throw new Error(result.message || "Failed to add attendance");
                }
                else {
                    throw new Error("Attendance was not added.");
                }
            }
            else if (!res.ok)
                throw new Error(result.message || "Failed to add attendance");

            alert(`✅ Attendance added successfully!`);
            form.reset();
            formMode = "idle";
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    }
});

async function initInstructorDropdown() {
  const select = document.getElementById("instructorIdSelect");
  try {
    const response = await fetch("/api/attend/getInstructorIds");
    const instructorIds = await response.json();

    instructorIds.forEach((instr) => {
      const option = document.createElement("option");
      option.value = instr.instructorId;
      option.textContent = `${instr.instructorId}:${instr.firstname} ${instr.lastname}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.err("Failed to load instructor IDs: ", err);
  }
}

async function initClassDropdown(givenId) {
  const select = document.getElementById("instructorIdSelect2");
  try {
    const response = await fetch("/api/attend/getClassIds");
    const classIds = await response.json();

    classIds.forEach((classItem) => {
      if (classItem.instructorId === givenId) {
        const option = document.createElement("option");
        option.value = classItem.instructorId;
        option.textContent = `${classItem.instructorId}:${classItem.day} ${classItem.time}`;
        option.dataset.day = classItem.day;
        option.dataset.time = classItem.time;
        select.appendChild(option);
      }
    });
  } catch (err) {
    console.err("Failed to load classes: ", err);
  }
}

async function initCustomerDropdown() {
  const select = document.getElementById("customerIdSelect");
  try {
    const response = await fetch("/api/attend/getCustomerIds");
    const customerIds = await response.json();

    customerIds.forEach((cust) => {
      const option = document.createElement("option");
      option.value = cust.customerId;
      option.textContent = `${cust.customerId}:${cust.firstname} ${cust.lastname}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.err("Failed to load customer IDs: ", err);
  }
}

function clearAttendForm() {
    document.getElementById("attendForm").reset();
    document.getElementById("instructorIdSelect").innerHTML = "";
    document.getElementById("instructorIdSelect2").innerHTML = "";
    document.getElementById("customerIdSelect").innerHTML = "";
}

function setFormForAdd() {
    formMode = "idle";
    document.getElementById("instructorIdLabel").style.display = "block";
    document.getElementById("instructorIdTextLabel").style.display = "none";
    document.getElementById("instructorIdText").value = "";
    document.getElementById("instructorIdText").style.display = "none";
    document.getElementById("instructorIdLabel2").style.display = "block";
    document.getElementById("instructorIdTextLabel2").style.display = "none";
    document.getElementById("instructorIdText2").value = "";
    document.getElementById("instructorIdText2").style.display = "none";
    document.getElementById("customerIdLabel").style.display = "block";
    document.getElementById("customerIdTextLabel").style.display = "none";
    document.getElementById("customerIdText").value = "";
    document.getElementById("customerIdText").style.display = "none";
    document.getElementById("attendForm").reset();
}