import {
  getNumberToOrderMap,
  getOrderById,
  showOrderDialog,
} from "./orders.js";
import { getPrices } from "./price.js";

window.updateTable = updateTable;
export function updateTable() {
  const table = createTable(10, 10);
  table.id = "table";
  document.getElementById("table")?.remove();
  document.getElementById("tab_table").prepend(table);
  const stats = document.getElementById("cardStats");
  const tickedCount = Object.keys(getNumberToOrderMap()).length;
  stats.textContent = `(${tickedCount} ตัวเลข)`;
}

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
        showOrderDialog(order);
      };

      col.appendChild(button);
    }
  }

  return table;
}
