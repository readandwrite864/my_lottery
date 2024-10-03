export function addOrder(order) {
  const orders = getOrders();
  order.id = nextId(orders);
  orders.push(order);
  saveOrders(orders);
}

export function removeOrder(order) {
  const orders = getOrders();
  const i = orders.findIndex((o) => o.id === order.id);
  if (i === -1) throw `order with id ${order.id} not found`;
  orders.splice(i, 1);
  saveOrders(orders);
}

export function getOrders() {
  return JSON.parse(localStorage.getItem("orders") || "[]");
}

export function getNumberToOrderMap() {
  return getOrders().reduce((map, order) => {
    order.numbers.forEach((n) => (map[n] = order.id));
    return map;
  }, {});
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function nextId(orders) {
  const ids = orders.map((order) => order.id);
  return Math.max(0, ...ids) + 1;
}

export function parseNumbers(numbers) {
  return numbers.match(new RegExp("\\d+", "gm")) || [];
}
