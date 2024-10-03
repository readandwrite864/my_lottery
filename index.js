import { addOrder, getNumberToOrderMap, parseNumbers } from "./orders.js";
import { getPrices, setPrices } from "./price.js";
import { downloadFile, screenshot } from "./screenshot.js";

function createTable(rows, cols) {
  const table = document.createElement("table");
  const numberToOrderMap = getNumberToOrderMap();

  const thead = document.createElement("thead");
  const theadRow1 = document.createElement("tr");
  const theadRow2 = document.createElement("tr");
  thead.appendChild(theadRow1);
  thead.appendChild(theadRow2);
  table.appendChild(thead);

  const prices = getPrices();
  const ticket_price = document.createElement("th");
  ticket_price.colSpan = cols;
  ticket_price.textContent = `Ticket: ${prices.ticket_price} baht`;
  theadRow1.appendChild(ticket_price);

  const win_prize = document.createElement("th");
  win_prize.colSpan = cols;
  win_prize.textContent = `Win Prize: ${prices.win_prize} baht`;
  theadRow2.appendChild(win_prize);

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
        debugger;
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
  document.getElementById("parsedNumbers").textContent = "";
}

function updateTable() {
  const table = createTable(10, 10);
  table.id = "table";
  document.getElementById("table")?.remove();
  document.body.prepend(table);
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
}

updateTable();
initForm();
