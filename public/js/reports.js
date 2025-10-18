document.addEventListener("DOMContentLoaded", () => {
    setFormForAdd();
    initPackageDropdown();
    initInstructorDropdown();
    initClassDropdown();
    initCustomerDropdown();
});

async function initPackageDropdown() {
  const select = document.getElementById("packageIdSelect");
  try {
    const response = await fetch("/api/reports/getPackageIds");
    const packageIds = await response.json();

    packageIds.forEach((pack) => {
      const option = document.createElement("option");
      option.value = pack.packageId;
      option.textContent = `${pack.packageId}:${pack.name}`;
      select.appendChild(option);
    });
  } catch (err) {
    console.err("Failed to load package IDs: ", err);
  }
}

async function initInstructorDropdown() {
  const select = document.getElementById("instructorIdSelect");
  try {
    const response = await fetch("/api/reports/getInstructorIds");
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

async function initClassDropdown() {
  const select = document.getElementById("instructorIdSelect2");
  try {
    const response = await fetch("/api/reports/getClassIds");
    const classIds = await response.json();

    classIds.forEach((classItem) => {
        const option = document.createElement("option");
        option.value = classItem.instructorId;
        option.textContent = `${classItem.instructorId}:${classItem.day} ${classItem.time}`;
        select.appendChild(option);
    });
  } catch (err) {
    console.err("Failed to load classes: ", err);
  }
}

async function initCustomerDropdown() {
  const select = document.getElementById("customerIdSelect");
  try {
    const response = await fetch("/api/reports/getCustomerIds");
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
    document.getElementById("reportsForm").reset();
    document.getElementById("packageIdSelect").innerHTML = "";
    document.getElementById("instructorIdSelect").innerHTML = "";
    document.getElementById("instructorIdSelect2").innerHTML = "";
    document.getElementById("customerIdSelect").innerHTML = "";
}

function setFormForAdd() {
    document.getElementById("packageIdLabel").style.display = "block";
    document.getElementById("packageIdTextLabel").style.display = "none";
    document.getElementById("packageIdText").value = "";
    document.getElementById("packageIdText").style.display = "none";
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
    document.getElementById("reportsForm").reset();
}