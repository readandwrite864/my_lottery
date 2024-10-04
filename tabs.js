import { updateOrdersList } from "./orders.js";

window.tab = "tab_table";
updateTabs();

document.querySelectorAll("nav > button").forEach((button) => {
  button.onclick = (e) => {
    window.tab = button.dataset.tab;
    updateTabs();
  };
});

function updateTabs() {
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = window.tab === section.id ? "flex" : "none";
  });

  document.querySelectorAll("nav > button").forEach((button) => {
    button.className = window.tab === button.dataset.tab ? "active" : "";
  });

  switch (window.tab) {
    case "tab_orders":
      updateOrdersList();
      break;
  }
}
