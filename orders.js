export function addOrder(order, both_sides = false) {
  if (both_sides) {
    const original_side = window.order_side;

    const originalOrders = ["up", "down"].map((side) => {
      window.order_side = side;
      return getOrders();
    });

    try {
      for (const side of ["up", "down"]) {
        window.order_side = side;
        addOrder(order, false);
      }
    } catch (error) {
      ["up", "down"].forEach((side, i) => {
        window.order_side = side;
        saveOrders(originalOrders[i]);
      });
    }

    window.order_side = original_side;
  } else {
    const numberToOrderMap = getNumberToOrderMap();

    const invalid = order.numbers.find((n) => n.length !== 2);
    if (invalid) {
      const error = `Invalid number "${invalid}"!`;
      alert(error);
      throw error;
    }

    const found = order.numbers.find((n) => numberToOrderMap[n]);
    if (found) {
      const error = `Order for number "${found}" already exists!`;
      alert(error);
      throw error;
    }

    const orders = getOrders();
    order.id = nextId(orders);
    orders.push(order);
    saveOrders(orders);
  }
}

export function removeOrder(order) {
  const orders = getOrders();
  const i = orders.findIndex((o) => o.id === order.id);
  if (i === -1) throw `order with id ${order.id} not found`;
  orders.splice(i, 1);
  saveOrders(orders);
}

export function removeAllOrders() {
  saveOrders([]);
}

export function getOrders() {
  return JSON.parse(localStorage.getItem(storageKey()) || "[]");
}

export function getOrderById(id) {
  return getOrders().find((o) => o.id === id);
}

export function getNumberToOrderMap() {
  return getOrders().reduce((map, order) => {
    order.numbers.forEach((n) => (map[n] = order.id));
    return map;
  }, {});
}

function saveOrders(orders) {
  localStorage.setItem(storageKey(), JSON.stringify(orders));
}

function nextId(orders) {
  const ids = orders.map((order) => order.id);
  return Math.max(0, ...ids) + 1;
}

function storageKey() {
  const side = window.order_side || "up";
  return "orders_" + side;
}

export function parseNumbers(numbers) {
  return numbers.match(new RegExp("\\d+", "gm")) || [];
}

window.updateOrdersList = updateOrdersList;
export function updateOrdersList() {
  const ordersList = document.getElementById("orders_list");
  const ordersSearch = document.getElementById("orderSearch");
  ordersSearch.oninput = filterList;
  filterList();

  for (const radio of document.querySelectorAll("input[type='radio']")) {
    if (!radio.name.match("search_side")) continue;
    radio.removeEventListener("click", filterList);
    radio.addEventListener("click", filterList);
  }
}

function filterList() {
  const ordersList = document.getElementById("orders_list");
  const ordersSearch = document.getElementById("orderSearch");

  const orders = getOrders();
  const ordersFilter = (o) => {
    const str = ordersSearch.value?.trim() || "";
    return o.user.match(str) || o.numbers.find((n) => n.match(str));
  };

  const filteredOrders = orders.filter(ordersFilter);
  ordersList.innerHTML = filteredOrders.length
    ? ""
    : "ไม่มีคำสั่งซื้อที่ตรงกับการค้นหาของคุณบนการ์ดนี้";

  for (const order of filteredOrders) {
    const orderEl = document.createElement("div");
    orderEl.className = "item";
    orderEl.innerHTML = `
    <div class="user"><b>${order.user}</b></div>
    <div class="numbers">${order.numbers.join(", ")}</div>
  `;
    orderEl.onclick = (e) => {
      showOrderDialog(order);
    };
    ordersList.appendChild(orderEl);
  }
}

export function showOrderDialog(order) {
  const form = document.getElementById("numberDialogForm");
  form.elements["user"].value = order.user;
  form.elements["numbers"].value = order.numbers.join(", ");

  const orderDelete = document.getElementById("numberDialogDelete");
  orderDelete.onclick = (e) => {
    if (!confirm("Delete order?")) return;
    removeOrder(order);
    window.updateTable();
    window.updateOrdersList();
  };

  const dialog = document.getElementById("numberDialog");
  dialog.showModal();
}
