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
});

document.getElementById("saveBtn").addEventListener("click", async () => {
    if (formMode === "add") {
        const form = document.getElementById("saleForm");

        const saleData = {
            packageId: form.packageId.value.trim(),
            amountPaid: form.amountPaid.value.trim(),
            paymentMode: form.paymentMode.value.trim(),
            date: form.date.value.trim(),
            time: form.time.value.trim(),
            startDate: form.startDate.value.trim(),
            endDate: form.endDate.value.trim(),
            customerId: form.customerId.value.trim(),
        };
        try {
            const res = await fetch("/api/sale/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saleData),
            });

            const result = await res.json();
            if (!res.ok)
                throw new Error(result.message || "Failed to add sale");

            alert(`✅ Sale for package ${saleData.packageId} added successfully!`);
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
    const response = await fetch("/api/instructor/getInstructorIds");
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
    const response = await fetch("/api/customer/getCustomerIds");
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

function clearSaleForm() {
    document.getElementById("saleForm").reset();
    document.getElementById("packageIdSelect").innerHTML = "";
}

function setFormForAdd() {
    formMode = "idle";
    document.getElementById("packageIdLabel").style.display = "block";
    document.getElementById("packageIdTextLabel").style.display = "none";
    document.getElementById("packageIdText").value = "";
    document.getElementById("packageIdText").style.display = "none";
    document.getElementById("customerIdLabel").style.display = "block";
    document.getElementById("customerIdTextLabel").style.display = "none";
    document.getElementById("customerIdText").value = "";
    document.getElementById("customerIdText").style.display = "none";
    document.getElementById("saleForm").reset();
}