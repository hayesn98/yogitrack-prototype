let formMode = "search"; // Tracks the current mode of the form

// Fetch all package IDs and populate the dropdown
document.addEventListener("DOMContentLoaded", () => {
  setFormForSearch();
  initPackageDropdown();
  addPackageDropdownListener();

});

//SEARCH
document.getElementById("searchBtn").addEventListener("click", async () => {
  clearPackageForm();
  setFormForSearch();
  initPackageDropdown();
});


//ADD
document.getElementById("addBtn").addEventListener("click", async () => {
  setFormForAdd();
});

//SAVE
document.getElementById("saveBtn").addEventListener("click", async () => {
  if (formMode === "add") {
    //Get max ID for packageId
    const res = await fetch("/api/package/getNextId");
    const {nextId } = await res.json();
    document.getElementById("packageIdText").value = nextId;

    const form = document.getElementById("packageForm");

    const packageData = {
      packageId: nextId,
      name: form.name.value.trim(),
      category: form.category[0].checked ? "general" : "senior",
      classnum: form.classnum.value.trim(),
      classtype: form.classtype[0].checked ? "general" : "special",
      startdate: form.startdate.value.trim(),
      enddate: form.enddate.value.trim(),
      price: form.price.value.trim()
    };
    try {
      const res = await fetch("/api/package/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageData),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Failed to add package");

      alert(`✅ Package ${packageData.packageId} added successfully!`);
      form.reset();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  }
});

//DELETE
document.getElementById("deleteBtn").addEventListener("click", async () => {
  var select = document.getElementById("packageIdSelect");
  var packageId = select.value.split(":")[0];

  const response = await fetch(
    `/api/package/deletePackage?packageId=${packageId}`, {
      method: "DELETE"
    });

  if (!response.ok) {
    throw new Error("Package delete failed");
  } else {
    alert(`Package with id ${packageId} successfully deleted`);
    clearPackageForm();
    initPackageDropdown();
    
  }
});

async function initPackageDropdown() {
  const select = document.getElementById("packageIdSelect");
  try {
    const response = await fetch("/api/package/getPackageIds");
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

async function addPackageDropdownListener() {
  const form = document.getElementById("packageForm");
  const select = document.getElementById("packageIdSelect");
  select.addEventListener("change", async () => {
    var packageId = select.value.split(":")[0];
    console.log(packageId);
    try {
      const res = await fetch(
        `/api/package/getPackage?packageId=${packageId}`
      );
      if (!res.ok) throw new Error("Package search failed");

      const data = await res.json();
      console.log(data);
      if (!data || Object.keys(data).length === 0) {
        alert("No package found");
        return;
      }

      //Fill form with data
      form.name.value = data.name || "";
      form.startdate.value = data.startdate || "";
      form.enddate.value = data.enddate || "";
      form.price.value = data.price || "";

      if (data.category === "general") {
        form.category[0].checked = true;
      } else form.category[1].checked = true;

      if (data.classnum === "1") {
        form.classnum[0].checked = true;
      } else if (data.classnum === "4") {
        form.classnum[1].checked = true;
      } else if (data.classnum === "10") {
        form.classnum[2].checked = true;
      } else form.classnum[3].checked = true;

      if (data.classtype === "general") {
        form.classtype[0].checked = true;
      } else form.classtype[1].checked = true;
    } catch (err) {
      alert(`Error searching package: ${packageId} - ${err.message}`);
    }
  });
}

function clearPackageForm() {
  document.getElementById("packageForm").reset(); // Clears all inputs including text, textarea, and unchecks radio buttons
  document.getElementById("packageIdSelect").innerHTML = "";
}

function setFormForSearch() {
  formMode = "search";
  //toggle back to search mode
  document.getElementById("packageIdLabel").style.display = "block"; // Show dropdown
  document.getElementById("packageIdTextLabel").style.display = "none"; // Hide text input
  document.getElementById("packageIdText").value = "";
  document.getElementById("packageIdText").style.display = "none";
  document.getElementById("packageForm").reset();
}

function setFormForAdd() {
  formMode = "add";
    //hide the package id drop down and label
  document.getElementById("packageIdLabel").style.display = "none";
  document.getElementById("packageIdTextLabel").style.display = "block";
  document.getElementById("packageIdText").value = "";
  document.getElementById("packageForm").reset();
}
