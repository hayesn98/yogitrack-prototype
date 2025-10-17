let formMode = "add";

document.addEventListener("DOMContentLoaded", () => {
    setFormForAdd();
    initPackageDropdown();
    initCustomerDropdown();
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
        } catch (err) {
            alert("❌ Error: " + err.message);
        }
    }
});

async function initPackageDropdown() {
  const select = document.getElementById("packageIdSelect");
  try {
    const response = await fetch("/api/sale/getPackageIds");
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
    formMode = "add";
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