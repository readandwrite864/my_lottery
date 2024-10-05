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

  const thead = document.createElement("thead");
  const theadRow1 = document.createElement("tr");
  const theadRow2 = document.createElement("tr");
  thead.appendChild(theadRow1);
  thead.appendChild(theadRow2);
  table.appendChild(thead);

  const header = document.createElement("th");
  header.colSpan = cols - 3;
  header.textContent = `เบอร์ทอง 2 ตัว`;
  theadRow1.appendChild(header);

  const prices = getPrices();
  const ticket_price = document.createElement("th");
  ticket_price.rowSpan = 2;
  ticket_price.colSpan = 3;
  ticket_price.innerHTML = `
    <div class="circle" style="padding: 1rem 0">
      <div style="font-size: 1.2rem">เบอร์ละ</div>
      <div class="price">${prices.ticket_price}</div>
    </div>
  `;
  theadRow1.appendChild(ticket_price);

  const win_prize = document.createElement("th");
  const win_prize_amount = `<span style="color: red;">${prices.win_prize}</span>`;
  const win_side = window.order_side === "up" ? `บน` : `ล่าง`;
  win_prize.colSpan = cols - 3;
  win_prize.innerHTML = `
    <div style="margin-bottom: .5rem">
      ถูกรับ <span class="price">${win_prize_amount}</span> ${win_side}
    </div>
  `;
  theadRow2.appendChild(win_prize);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  const numberToOrderMap = getNumberToOrderMap();
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
      button.className = orderId ? "active": undefined;
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

  const wrapper = document.createElement("div");
  wrapper.id = "table";
  wrapper.className = window.order_side;
  wrapper.appendChild(table);

  return wrapper;
}
