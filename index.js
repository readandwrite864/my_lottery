import { addOrder, parseNumbers, removeAllOrders } from "./orders.js";
import { getPrices, setPrices } from "./price.js";
import { downloadFile, screenshot } from "./screenshot.js";
import { updateTable } from "./table.js";

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
    try {
      e.target.disabled = true;
      const s = await screenshot("table");
      downloadFile(s, "my_lottery.png");
    } finally {
      e.target.disabled = false;
    }
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
    if (!radio.name.match("_side")) return;
    radio.onclick = (e) => {
      const newSide = radio.value;
      window.order_side = newSide;
      updateTable();
      for (const radio of document.querySelectorAll("input[type='radio']")) {
        radio.checked = radio.value === newSide;
      }
    };
  }

  window.order_side = "up";
}

initForm();
updateTable();
