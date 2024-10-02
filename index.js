function createTable(rows, cols) {
  const table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");
    table.appendChild(row);
    for (let j = 0; j < cols; j++) {
      const col = document.createElement("td");
      row.appendChild(col);
      const number = i * rows + j;
      const button = document.createElement("button");
      button.textContent = `${number}`.padStart(2, "0");
      col.appendChild(button);
    }
  }

  return table;
}

document.body.appendChild(createTable(10, 10));
