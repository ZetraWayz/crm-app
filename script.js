const API_URL = "https://script.google.com/macros/s/AKfycbwu3d6n0j9Si_W8KIUhkU75qHvaoZfsCRvDNDHOerrhKhkOZSZvYdnGTRlj6-GTTaBD/exec";

// Load dropdowns on page load
window.onload = async () => {
  await loadDropdown("getCustomers", "customerSelect");
  await loadDropdown("getSuppliers", "supplierSelect");
};

async function loadDropdown(action, elementId) {
  try {
    const response = await fetch(`${API_URL}?action=${action}`);
    const data = await response.json();

    const dropdown = document.getElementById(elementId);
    dropdown.innerHTML = "";

    data.forEach((row, index) => {
      const option = document.createElement("option");
      option.value = row[0]; // Assuming ID
      option.text = `${row[1]} (${row[2]})`; // Name + Email
      dropdown.appendChild(option);
    });

    // Pre-fill email if customer dropdown
    if (elementId === "customerSelect") {
      dropdown.addEventListener("change", () => {
        const selected = dropdown.selectedIndex;
        const email = data[selected][2]; // assuming 3rd column is email
        document.getElementById("email").value = email;
      });

      // Trigger initial fill
      if (data.length > 0) {
        document.getElementById("email").value = data[0][2];
      }
    }
  } catch (error) {
    console.error("Dropdown Load Error:", error);
  }
}

document.getElementById("transactionForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const payload = {
    customerId: document.getElementById("customerSelect").value,
    supplierId: document.getElementById("supplierSelect").value,
    qtySold: document.getElementById("qtySold").value,
    qtyBought: document.getElementById("qtyBought").value,
    materialType: document.getElementById("materialType").value,
    sellingPrice: document.getElementById("sellingPrice").value,
    buyingPrice: document.getElementById("buyingPrice").value,
    date: document.getElementById("transactionDate").value,
    email: document.getElementById("email").value,
  };

  try {
    const res = await fetch(`${API_URL}?action=addTransaction`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const text = await res.text();
    document.getElementById("status").innerText = text;
    document.getElementById("transactionForm").reset();
  } catch (err) {
    console.error("Submit Error:", err);
    document.getElementById("status").innerText = "Error occurred.";
  }
});
