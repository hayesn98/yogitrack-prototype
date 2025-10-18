let formMode = "none";

document.addEventListener("DOMContentLoaded", () => {
    setFormForAdd();
    initPackageDropdown();
    initInstructorDropdown();
    initCustomerDropdown();
});

document.getElementById("packageBtn").addEventListener("click", async () => {
    const form = document.getElementById("reportsForm");
    form.reset();

    formMode = "package";

    document.getElementById("packageIdLabel").style.visibility = "visible";
    document.getElementById("packageIdSelect").style.visibility = "visible";
    document.getElementById("salesNum").style.visibility = "visible";
    document.getElementById("salesNumLabel").style.visibility = "visible";
    document.getElementById("instructorIdLabel").style.visibility = "hidden";
    document.getElementById("instructorIdSelect").style.visibility = "hidden";
    document.getElementById("checkIns").style.visibility = "hidden";
    document.getElementById("checkInsLabel").style.visibility = "hidden";
    document.getElementById("customerIdLabel").style.visibility = "hidden";
    document.getElementById("customerIdSelect").style.visibility = "hidden";
    document.getElementById("attendances").style.visibility = "hidden";
    document.getElementById("attendancesLabel").style.visibility = "hidden";
});

document.getElementById("instructorBtn").addEventListener("click", async () => {
    const form = document.getElementById("reportsForm");
    form.reset();

    formMode = "instructor";

    document.getElementById("packageIdLabel").style.visibility = "hidden";
    document.getElementById("packageIdSelect").style.visibility = "hidden";
    document.getElementById("salesNum").style.visibility = "hidden";
    document.getElementById("salesNumLabel").style.visibility = "hidden";
    document.getElementById("instructorIdLabel").style.visibility = "visible";
    document.getElementById("instructorIdSelect").style.visibility = "visible";
    document.getElementById("checkIns").style.visibility = "visible";
    document.getElementById("checkInsLabel").style.visibility = "visible";
    document.getElementById("customerIdLabel").style.visibility = "hidden";
    document.getElementById("customerIdSelect").style.visibility = "hidden";
    document.getElementById("attendances").style.visibility = "hidden";
    document.getElementById("attendancesLabel").style.visibility = "hidden";
});

document.getElementById("customerBtn").addEventListener("click", async () => {
    const form = document.getElementById("reportsForm");
    form.reset();

    formMode = "customer";

    document.getElementById("packageIdLabel").style.visibility = "hidden";
    document.getElementById("packageIdSelect").style.visibility = "hidden";
    document.getElementById("salesNum").style.visibility = "hidden";
    document.getElementById("salesNumLabel").style.visibility = "hidden";
    document.getElementById("instructorIdLabel").style.visibility = "hidden";
    document.getElementById("instructorIdSelect").style.visibility = "hidden";
    document.getElementById("checkIns").style.visibility = "hidden";
    document.getElementById("checkInsLabel").style.visibility = "hidden";
    document.getElementById("customerIdLabel").style.visibility = "visible";
    document.getElementById("customerIdSelect").style.visibility = "visible";
    document.getElementById("attendances").style.visibility = "visible";
    document.getElementById("attendancesLabel").style.visibility = "visible";
});

document.getElementById("generateBtn").addEventListener("click", async () => {
    const form = document.getElementById("reportsForm");

    if (formMode === "package") {
        const packageData = {
            packageId: form.packageId.value.trim(),
        };
        try {
            const res = await fetch("/api/reports/package", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(packageData),
            });

            const result = await res.json();
            if (!res.ok)
                throw new Error(result.message || "Failed to get package data.");

            alert(`Package data obtained.`);

            form.salesNum.value = result.salesCount;
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
    else if (formMode === "instructor") {
        const instructorData = {
            instructorId: form.instructorId.value.trim(),
        };
        try {
            const res = await fetch("/api/reports/instructor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(instructorData),
            });

            const result = await res.json();
            if (!res.ok)
                throw new Error(result.message || "Failed to get instructor data.");

            alert(`Instructor data obtained.`);

            form.checkIns.value = result.checkCount;
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
    else if (formMode === "customer") {
        const customerData = {
            customerId: form.customerId.value.trim(),
        };
        try {
            const res = await fetch("/api/reports/customer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerData),
            });

            const result = await res.json();
            if (!res.ok)
                throw new Error(result.message || "Failed to get customer data.");

            alert(`Customer data obtained.`);

            form.attendances.value = result.attendCount;
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
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
    document.getElementById("customerIdSelect").innerHTML = "";
}

function setFormForAdd() {
    formMode = "none";
    document.getElementById("packageIdLabel").style.display = "block";
    document.getElementById("packageIdTextLabel").style.display = "none";
    document.getElementById("packageIdText").value = "";
    document.getElementById("packageIdText").style.display = "none";
    document.getElementById("instructorIdLabel").style.display = "block";
    document.getElementById("instructorIdTextLabel").style.display = "none";
    document.getElementById("instructorIdText").value = "";
    document.getElementById("instructorIdText").style.display = "none";
    document.getElementById("customerIdLabel").style.display = "block";
    document.getElementById("customerIdTextLabel").style.display = "none";
    document.getElementById("customerIdText").value = "";
    document.getElementById("customerIdText").style.display = "none";
    document.getElementById("reportsForm").reset();
}