//Vendors data to be received from the server
var vendors = {};

//The drop-down menu
let select = document.getElementById("vendor-select");
// for add new item form
let selectVendorForNewItem = document.getElementById("vendor-select-add-item");
let selectVendorCategoryForNewItem =
  document.getElementById("add-item-category");
//Stores the currently selected vendor index to allow it to be set back when switching vendors is cancelled by user
let currentSelectIndex = select.selectedIndex;
//Stores the current vendor to easily retrieve data. The assumption is that this object is following the same format as the data included above. If you retrieve the vendor data from the server and assign it to this variable, the client order form code should work automatically.
let currentVendor;
/** vendors file name in storage. This is retrieved to help us to update the file when adding new item later */
let vendorsStorageFileName;

// for add item for
let currentVendorAddItem;
//Stored the order data. Will have a key with each item ID that is in the order, with the associated value being the number of that item in the order.
let order = {};
let orderResult;
// get vendor data returned from server
function initVendorsData(vendor = "") {
  vendors = vendor.vendorsData;
  vendorsStorageFileName = vendor.vendorsStorageFileName;
  console.log("vendorsData", vendorsStorageFileName);
  // initialize and populate the page with data
  init();
}

//Called on page load. Initialize the drop-down list, add event handlers, and default to the first vendor.
function init() {
  document.getElementById("vendor-select").innerHTML = genSelList();
  document.getElementById("vendor-select").onchange = selectVendor;
  selectVendor();
}

//Generate new HTML for a drop-down list containing all vendors.
//For A2, you will likely have to make an XMLHttpRequest from here to retrieve the array of vendor names.
function genSelList() {
  let result = '<select name="vendor-select" id="vendor-select">';
  Object.keys(vendors).forEach((elem) => {
    result += `<option value="${elem}">${elem}</option>`;
  });
  result += "</select>";
  return result;
}

//Helper function. Returns true if object is empty, false otherwise.
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

//Called when drop-down list item is changed.
//For A2, you will likely have to make an XMLHttpRequest here to retrieve the supplies list data for the selected vendor
function selectVendor() {
  let result = true;

  //If order is not empty, confirm the user wants to switch vendors
  if (!isEmpty(order)) {
    result = confirm(
      "Are you sure you want to clear your order and switch vendor?"
    );
  }

  //If switch is confirmed, load the new vendor data
  if (result) {
    //Get the selected index and set the current vendor
    let selected = select.options[select.selectedIndex].value;
    currentSelectIndex = select.selectedIndex;

    //In A2, current vendor will be data you received from the server
    currentVendor = vendors[selected];

    //Update the page contents to contain the new supply list
    document.getElementById("left").innerHTML = getCategoryHTML(currentVendor);
    document.getElementById("middle").innerHTML =
      getSuppliesHTML(currentVendor);

    //Clear the current oder and update the order summary
    order = {};
    updateOrder();

    //Update the vendor info on the page
    let info = document.getElementById("info");
    info.innerHTML =
      "<h1>" +
      currentVendor.name +
      "</h1>" +
      "<br>Minimum Order: $" +
      currentVendor.min_order +
      "<br>Delivery Fee: $" +
      currentVendor.delivery_fee +
      "<br><br>";
  } else {
    //If user refused the change of vendor, reset the selected index to what it was before they changed it
    let select = document.getElementById("vendor-select");
    select.selectedIndex = currentSelectIndex;
  }
}

//Given a vendor object, produces HTML for the left column
function getCategoryHTML(vend) {
  let supplies = vend.supplies;
  let result = "<h3>Categories</h3><br>";
  Object.keys(supplies).forEach((key) => {
    result += `<a href="#${key}">${key}</a><hr>`;
  });
  addItemButton = `
  <div> <button class=" button add-item-btn" onclick="showAddItemPanel()" style=" margin-left: 30px;">Add Item</button> </div>
  `;
  return result + addItemButton;
}

//Given a vendor object, produces the supplies HTML for the middle column
function getSuppliesHTML(vend) {
  let supplies = vend.supplies;
  let result = "";
  //For each category in the supply list
  Object.keys(supplies).forEach((key) => {
    result += `<b>${key}</b><a name="${key}"></a><br>`;
    //For each item in the category
    Object.keys(supplies[key]).forEach((id) => {
      item = supplies[key][id];
      result += `${item.name} (\$${item.price}, stock=${item.stock}) <img src='/assets/images/add.png' style='height:20px;vertical-align:bottom;' onclick='addItem(${item.stock}, ${id})'/> <br>`;
      result += item.description + "<br><br>";
    });
  });
  return result;
}

//Responsible for adding one of the items with given id to the order, updating the summary, and alerting if "Out of stock"
function addItem(stock, id) {
  if (order.hasOwnProperty(id) && stock == order[id]) {
    alert("Out if stock!");
    return;
  } else if (order.hasOwnProperty(id)) {
    order[id] += 1;
  } else {
    order[id] = 1;
  }
  updateOrder();
}

//Responsible for removing one of the items with given id from the order and updating the summary
function removeItem(id) {
  if (order.hasOwnProperty(id)) {
    order[id] -= 1;
    if (order[id] <= 0) {
      delete order[id];
    }
  }
  updateOrder();
}

//Reproduces new HTML containing the order summary and updates the page
//This is called whenever an item is added/removed in the order
function updateOrder() {
  let result = "";
  let subtotal = 0;

  //For each item ID currently in the order
  Object.keys(order).forEach((id) => {
    //Retrieve the item from the supplies data using helper function
    //Then update the subtotal and result HTML
    let item = getItemById(id);
    subtotal += item.price * order[id];
    result += `${item.name} x ${order[id]} (${(item.price * order[id]).toFixed(
      2
    )}) <img src='/assets/images/remove.png' style='height:15px;vertical-align:bottom;' onclick='removeItem(${id})'/><br>`;
  });

  //Add the summary fields to the result HTML, rounding to two decimal places
  result += `<br>Subtotal: \$${subtotal.toFixed(2)}<br>`;
  result += `Tax: \$${(subtotal * 0.1).toFixed(2)}<br>`;
  result += `Delivery Fee: \$${currentVendor.delivery_fee.toFixed(2)}<br>`;
  let total = subtotal + subtotal * 0.1 + currentVendor.delivery_fee;
  result += `Total: \$${total.toFixed(2)}<br>`;
  orderResult = result;

  //Decide whether to show the Submit Order button or the "Order X more" label
  if (subtotal >= currentVendor.min_order) {
    result += `<button type="button" id="submit" onclick="submitOrder()">Submit Order</button>`;
  } else {
    result += `Add \$${(currentVendor.min_order - subtotal).toFixed(
      2
    )} more to your order.`;
  }

  document.getElementById("right").innerHTML = result;
}

//Simulated submitting the order
//For A2, you will likely make an XMLHttpRequest here
function submitOrder() {
  console.log("order data", order);
  let xhr = new XMLHttpRequest();
  let timeCreated = new Date().toISOString();
  console.log("time", timeCreated);
  let data = {
    order: orderResult,
    timeCreated: timeCreated,
  };

  // post to server
  xhr.open("POST", "http://localhost:3000/orderform");

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  data = JSON.stringify(data);
  xhr.send(data);

  xhr.onload = () => {
    let res = JSON.parse(xhr.responseText);
    console.log("server response", res);
    order = {};
    selectVendor();
    alert(res.message);
  };
}

//Helper function. Given an ID of an item in the current vendors' supply list, returns that item object if it exists.
function getItemById(id) {
  let categories = Object.keys(currentVendor.supplies);
  for (let i = 0; i < categories.length; i++) {
    if (currentVendor.supplies[categories[i]].hasOwnProperty(id)) {
      return currentVendor.supplies[categories[i]][id];
    }
  }
  return null;
}

/**
 * Add new order to category
 */

// generate dropdown for add new item form
function addItemGenSelList() {
  let result =
    '<select name="vendor-select-add-item" id="vendor-select-add-item">';
  Object.keys(vendors).forEach((elem) => {
    result += `<option value="${elem}">${elem}</option>`;
  });
  result += "</select>";
  return result;
}

//Given a vendor object, produces HTML for the left column
function getAddItemFormCategoryHTML(vend) {
  let supplies = vend.supplies;
  let result = '<select name="add-item-category" id="add-item-category">';
  Object.keys(supplies).forEach((key) => {
    result += `<option value="${key}">${key}</option>`;
  });
  result += "</select>";
  return result;
}

function selectVendorToAddItem() {
  let result = true;

  //If switch is confirmed, load the new vendor data
  if (result) {
    //Get the selected index and set the current vendor
    let selected =
      selectVendorForNewItem.options[selectVendorForNewItem.selectedIndex]
        .value;
    currentSelectIndex = selectVendorForNewItem.selectedIndex;

    //In A2, current vendor will be data you received from the server
    currentVendorAddItem = vendors[selected];
    document.getElementById("add-item-category").innerHTML =
      getAddItemFormCategoryHTML(currentVendorAddItem);
    console.log("currentVendorAddItem", currentVendorAddItem);
  }
}

let selectedCategory;

function selectVendorCategoryAddItem() {
  let result = true;

  //If switch is confirmed, load the new vendor data
  if (result) {
    //Get the selected index and set the current vendor
    let selected =
      selectVendorCategoryForNewItem.options[
        selectVendorCategoryForNewItem.selectedIndex
      ].value;
    selectedCategory = selected;
    console.log("selected", selectedCategory);
  }
}

// show add item form
function showAddItemPanel() {
  document.getElementById("add-item").style.display = "flex";
  document.getElementById("vendor-select-add-item").innerHTML =
    addItemGenSelList();
  document.getElementById("vendor-select-add-item").onchange =
    selectVendorToAddItem;
  document.getElementById("add-item-category").onchange =
    selectVendorCategoryAddItem;
  selectVendorToAddItem();
  selectVendorCategoryAddItem();
}

function closeAddItemForm() {
  document.getElementById("add-item").style.display = "none";
}

/**
 * Add item to vendors file data
 */
function addOneItem() {
  let categoryData = currentVendorAddItem.supplies[selectedCategory];
  let keys = Object.keys(categoryData);
  // get last key to increment the key for new entry
  let getLastKey = keys[keys.length - 1];
  // convert to number to increment and convert back to string to be used as a key
  let newKey = (Number(getLastKey) + 1).toString();

  let newItem = {
    description: document.getElementById("item-description").value,
    name: document.getElementById("item-name").value,
    price: document.getElementById("item-price").value,
    stock: document.getElementById("item-stock").value,
  };

  // add to the list
  categoryData[newKey] = newItem;
  currentVendorAddItem.supplies[selectedCategory] = categoryData;
  // update the main vendor data;
  currentVendor = currentVendorAddItem;

  let data = {
    data: currentVendorAddItem,
    file_name: vendorsStorageFileName[currentVendorAddItem.name] + ".json",
  };

  let xhr = new XMLHttpRequest();
  let timeCreated = new Date().toISOString();

  //   post to server
  xhr.open("PUT", "http://localhost:3000/update-vendor");

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  data = JSON.stringify(data);
  xhr.send(data);

  xhr.onload = () => {
    let res = JSON.parse(xhr.responseText);
    console.log("server response", res);
    // clear form data
    document.getElementById("item-description").value = "";
    document.getElementById("item-name").value = "";
    document.getElementById("item-price").value = "";
    document.getElementById("item-stock").value = "";
    alert(res.message);
  };
}

// this only update the local data but not the main serfer file...
function addMoreItem() {
  let categoryData = currentVendorAddItem.supplies[selectedCategory];
  let keys = Object.keys(categoryData);
  // get last key to increment the key for new entry
  let getLastKey = keys[keys.length - 1];
  // convert to number to increment and convert back to string to be used as a key
  let newKey = (Number(getLastKey) + 1).toString();

  let newItem = {
    description: document.getElementById("item-description").value,
    name: document.getElementById("item-name").value,
    price: document.getElementById("item-price").value,
    stock: document.getElementById("item-stock").value,
  };

  // add to the list
  categoryData[newKey] = newItem;
  currentVendorAddItem.supplies[selectedCategory] = categoryData;
  // update the main vendor data;
  currentVendor = currentVendorAddItem;

  // clear form data
  document.getElementById("item-description").value = "";
  document.getElementById("item-name").value = "";
  document.getElementById("item-price").value = "";
  document.getElementById("item-stock").value = "";
  console.log("new Item added", newItem);
}
