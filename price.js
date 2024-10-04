export function getPrices() {
  const prices = JSON.parse(localStorage.getItem("prices") || "{}");
  prices.ticket_price = prices.ticket_price || 100;
  prices.win_prize = prices.win_prize || 7500;
  return prices;
}

export function setPrices(prices) {
  localStorage.setItem("prices", JSON.stringify(prices));
}
