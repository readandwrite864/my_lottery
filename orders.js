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
      alert(error);
    }

    window.order_side = original_side;
  } else {
    const numberToOrderMap = getNumberToOrderMap();

    const invalid = order.numbers.find((n) => n.length !== 2);
    if (invalid) throw `Invalid number "${invalid}"!`;

    const found = order.numbers.find((n) => numberToOrderMap[n]);
    if (found) throw `Order for number "${found}" already exists!`;

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

export function getOrders() {
  return JSON.parse(localStorage.getItem(storageKey()) || "[]");
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
