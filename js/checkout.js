import { getCart, cartTotal, clearCart } from "./storage.js";

function imgUrl(image) {
  if (typeof image === "string") return image;
  if (image && image.url) return image.url;
  return "images/placeholder.jpg";
}

const box = document.querySelector(".summary");
const payBtn =
  document.querySelector(".checkout-btn button") ||
  document.querySelector(".checkout-btn a");

function render() {
  const items = getCart();
  const total = cartTotal().toFixed(2);

  const thumbs = items
    .map((p) => {
      const src = imgUrl(p.image);
      const alt = (p.image && p.image.alt) || p.title || "Game cover";
      const qty = p.qty || 1;
      return `
      <div style="display:inline-block;text-align:center;margin:5px">
        <img src="${src}" alt="${alt}" style="max-width:120px;display:block" />
        <small>x${qty}</small>
      </div>
    `;
    })
    .join("");

  box.innerHTML = `
    <h4 class="clr-primary text-center">You're paying</h4>
    <h2 class="clr-primary text-center">$${total}</h2>
    ${thumbs || ""}
  `;
}

if (payBtn) {
  payBtn.addEventListener("click", (e) => {
    const isButton = payBtn.tagName.toLowerCase() === "button";
    if (isButton) e.preventDefault();
    clearCart();
    if (isButton) location.href = "order-confirmation.html";
  });
}

render();
