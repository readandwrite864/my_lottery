import {
  addOrder,
  getNumberToOrderMap,
  getOrderById,
  parseNumbers,
  removeAllOrders,
  removeOrder,
} from "./orders.js";
import { getPrices, setPrices } from "./price.js";
import { downloadFile, screenshot } from "./screenshot.js";

function createTable(rows, cols) {
  const table = document.createElement("table");
  const numberToOrderMap = getNumberToOrderMap();

  const bg = window.order_side === "up" ? "bg_3.jpg" : "bg_2.jpg";
  table.style.backgroundImage = `radial-gradient(
    circle,
    rgba(251, 244, 250, 0.5) 0%,
    rgba(205, 228, 255, 0.5) 100%
  ), url("${bg}")`;

  const thead = document.createElement("thead");
  const theadRow1 = document.createElement("tr");
  const theadRow2 = document.createElement("tr");
  const theadRow3 = document.createElement("tr");
  thead.appendChild(theadRow1);
  thead.appendChild(theadRow2);
  thead.appendChild(theadRow3);
  table.appendChild(thead);

  const header = document.createElement("th");
  header.colSpan = cols;
  header.style.textAlign = "center";
  header.style.fontSize = "1.5rem";
  header.textContent =
    window.order_side === "up"
      ? "รัฐบาล2ตัวบน 16.ต.ค 67"
      : "รัฐบาล2ตัวล่าง 16.ต.ค 67";
  theadRow1.appendChild(header);

  const prices = getPrices();
  const ticket_price = document.createElement("th");
  ticket_price.colSpan = cols - 3;
  ticket_price.textContent = `เบอร์ละ ${prices.ticket_price} บ.`;
  theadRow2.appendChild(ticket_price);

  const win_prize = document.createElement("th");
  const win_prize_amount = `<span style="color: red;">${prices.win_prize}</span>`;
  win_prize.colSpan = cols - 3;
  win_prize.innerHTML = `ถูกรับ ${win_prize_amount} บ.`;
  theadRow3.appendChild(win_prize);

  const order_side = document.createElement("th");
  order_side.rowSpan = 2;
  order_side.colSpan = 3;
  order_side.style.textAlign = "center";
  order_side.style.fontSize = "2.2rem";
  order_side.innerHTML = window.order_side === "up" ? "บน" : "ล่าง";
  theadRow2.appendChild(order_side);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");
    tbody.appendChild(row);
    for (let j = 0; j < cols; j++) {
      const col = document.createElement("td");
      row.appendChild(col);
      const number = i * rows + j;
      const button = document.createElement("button");
      const numberFormatted = `${number}`.padStart(2, "0");
      const orderId = numberToOrderMap[numberFormatted];
      button.dataset.orderId = orderId;
      button.textContent = numberFormatted;
      button.style.background = orderId ? "red" : undefined;
      button.style.color = orderId ? "white" : undefined;
      button.onclick = (e) => {
        const button = e.target;
        const orderId = Number(button.dataset.orderId);
        if (!orderId) return;
        const order = getOrderById(orderId);

        const form = document.getElementById("numberDialogForm");
        form.elements["user"].value = order.user;
        form.elements["numbers"].value = order.numbers.join(", ");

        const orderDelete = document.getElementById("numberDialogDelete");
        orderDelete.onclick = (e) => {
          if (!confirm("Delete order?")) return;
          removeOrder(order);
          updateTable();
        };

        const dialog = document.getElementById("numberDialog");
        dialog.showModal();
      };

      col.appendChild(button);
    }
  }

  return table;
}

function onSubmit(e) {
  e.preventDefault();

  const form = document.getElementById("order");
  const user = form.elements["user"];
  const numbers = form.elements["numbers"];
  const both_sides = form.elements["both_sides"];
  const order = { numbers: parseNumbers(numbers.value), user: user.value };

  if (!confirm("Add Order?")) return;

  addOrder(order, both_sides.checked);
  updateTable();
  user.value = "";
  numbers.value = "";
  both_sides.checked = false;
  document.getElementById("parsedNumbers").textContent = "";
}

function updateTable() {
  const table = createTable(10, 10);
  table.id = "table";
  document.getElementById("table")?.remove();
  document.body.prepend(table);
  const stats = document.getElementById("cardStats");
  const tickedCount = Object.keys(getNumberToOrderMap()).length;
  stats.textContent = `(${tickedCount} ตัวเลข)`;
}

function initForm() {
  const form = document.getElementById("order");
  form.onsubmit = onSubmit;
  form.elements["numbers"].onchange = onNumberInput;
  form.elements["numbers"].oninput = onNumberInput;

  function onNumberInput(e) {
    const unparsedNumbers = form.elements["numbers"].value;
    const parsedNumbers = document.getElementById("parsedNumbers");
    parsedNumbers.textContent = parseNumbers(unparsedNumbers).join(", ");
  }

  document.getElementById("screenshot").onclick = async (e) => {
    const s = await screenshot("table");
    downloadFile(s, "my_lottery.png");
  };

  document.getElementById("removeAll").onclick = async (e) => {
    if (!confirm("Remove all orders from this card?")) return;
    removeAllOrders();
    updateTable();
  };

  const prices = getPrices();
  const priceForm = document.getElementById("price");
  priceForm.elements["ticket_price"].value = prices.ticket_price;
  priceForm.elements["win_prize"].value = prices.win_prize;
  priceForm.onsubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const prices = getPrices();
    prices.ticket_price = form.elements["ticket_price"].value;
    prices.win_prize = form.elements["win_prize"].value;
    setPrices(prices);
    updateTable();
  };

  for (const radio of document.querySelectorAll("input[type='radio']")) {
    if (radio.name !== "order_side") return;
    radio.onclick = (e) => {
      window.order_side = radio.value;
      updateTable();
    };
  }

  window.order_side = "up";
}

initForm();
updateTable();
