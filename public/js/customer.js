let formMode = "search"; // Tracks the current mode of the form

// Fetch all customer IDs and populate the dropdown
document.addEventListener("DOMContentLoaded", () => {
  setFormForSearch();
  initCustomerDropdown();
  addCustomerDropdownListener();

});

//SEARCH
document.getElementById("searchBtn").addEventListener("click", async () => {
  clearCustomerForm();
  setFormForSearch();
  initCustomerDropdown();
});


//ADD
document.getElementById("addBtn").addEventListener("click", async () => {
  setFormForAdd();
});

//SAVE
document.getElementById("saveBtn").addEventListener("click", async () => {
  if (formMode === "add") {
    //Get max ID for customerId
    const res = await fetch("/api/customer/getNextId");
    const {nextId } = await res.json();
    document.getElementById("customerIdText").value = nextId;

    const form = document.getElementById("customerForm");

    const customerData = {
      customerId: nextId,
      firstname: form.firstname.value.trim(),
      lastname: form.lastname.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      preferredContact: form.pref[0].checked ? "phone" : "email",
      classBalance: 0
    };
    try {
      let res = await fetch("/api/customer/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      let result = await res.json();

      if (res.status === 409 && result.duplicate) {
        if (confirm(`${result.message}`)) {
          customerData.forceAdd = true;

          res = await fetch("/api/customer/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
          });

          result = await res.json();

          if (!res.ok)
            throw new Error(result.message || "Failed to add customer");
        }
        else {
          throw new Error("Customer was not added.");
        }
      }
      else if (!res.ok) {
        throw new Error(result.message || "Failed to add customer");
      }

      alert(`✅ Customer ${customerData.customerId} added successfully!`);
      alert(`Welcome to Yoga'Hom! Your customer id is ${customerData.customerId}.`);
      form.reset();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  }
});

//DELETE
document.getElementById("deleteBtn").addEventListener("click", async () => {
  var select = document.getElementById("customerIdSelect");
  var customerId = select.value.split(":")[0];

  const response = await fetch(
    `/api/customer/deleteCustomer?customerId=${customerId}`, {
      method: "DELETE"
    });

  if (!response.ok) {
    throw new Error("Customer delete failed");
  } else {
    alert(`Customer with id ${customerId} successfully deleted`);
    clearCustomerForm();
    initCustomerDropdown();
    
  }
});

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

async function addCustomerDropdownListener() {
  const form = document.getElementById("customerForm");
  const select = document.getElementById("customerIdSelect");
  select.addEventListener("change", async () => {
    var customerId = select.value.split(":")[0];
    console.log(customerId);
    try {
      const res = await fetch(
        `/api/customer/getCustomer?customerId=${customerId}`
      );
      if (!res.ok) throw new Error("Customer search failed");

      const data = await res.json();
      console.log(data);
      if (!data || Object.keys(data).length === 0) {
        alert("No customer found");
        return;
      }

      //Fill form with data
      form.firstname.value = data.firstname || "";
      form.lastname.value = data.lastname || "";
      form.email.value = data.email || "";
      form.phone.value = data.phone || "";

      if (data.preferredContact === "phone") {
        form.pref[0].checked = true;
      } else form.pref[1].checked = true;

      form.classBalance.value = data.classBalance || "";
    } catch (err) {
      alert(`Error searching package: ${customerId} - ${err.message}`);
    }
  });
}

function clearCustomerForm() {
  document.getElementById("customerForm").reset(); // Clears all inputs including text, textarea, and unchecks radio buttons
  document.getElementById("customerIdSelect").innerHTML = "";
}

function setFormForSearch() {
  formMode = "search";
  //toggle back to search mode
  document.getElementById("customerIdLabel").style.display = "block"; // Show dropdown
  document.getElementById("customerIdTextLabel").style.display = "none"; // Hide text input
  document.getElementById("customerIdText").value = "";
  document.getElementById("customerIdText").style.display = "none";
  document.getElementById("customerForm").reset();
}

function setFormForAdd() {
  formMode = "add";
    //hide the customer id drop down and label
  document.getElementById("customerIdLabel").style.display = "none";
  document.getElementById("customerIdTextLabel").style.display = "block";
  document.getElementById("customerIdText").value = "";
  document.getElementById("customerForm").reset();
}
