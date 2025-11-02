import { getCart, changeQty, removeFromCart, cartTotal } from "./storage.js";

function imgUrl(image) {
  if (typeof image === "string") return image;
  if (image && image.url) return image.url;
  return "images/placeholder.jpg";
}

const section = document.querySelector(".shopping-cart");

function row(p) {
  const unit =
    typeof p.discountedPrice === "number" && p.discountedPrice < p.price
      ? p.discountedPrice
      : p.price;
  const lineTotal = Number(unit) * (p.qty || 1);
  const img = imgUrl(p.image);
  const alt = (p.image && p.image.alt) || p.title || "Game cover";

  return `
    <div class="product-info" data-id="${p.id}">
      <div class="product-img"><img src="${img}" alt="${alt}" /></div>

      <div class="game-title uppercase clr-primary">
        <h2>${p.title}</h2>
        <h4 class="text-center clr-white">${
          p.onSale ? "On sale" : "Regular price"
        }</h4>
      </div>

      <div class="quantity">
        <button class="button-primary-small" data-dec="${p.id}">−</button>
        <div>${p.qty || 1}</div>
        <button class="button-primary-small" data-inc="${p.id}">+</button>
      </div>

      <div class="product-price">
        <h5>Unit: $${Number(unit).toFixed(2)}</h5>
        <h3>$${lineTotal.toFixed(2)}</h3>
        <a href="#" class="remove" data-remove="${p.id}">Remove</a>
      </div>

      <a class="button-primary" href="checkout.html">Checkout</a>
      <a href="our-games.html">Continue shopping</a>
    </div>
  `;
}

function render() {
  const items = getCart();

  if (!items.length) {
    section.innerHTML = `
      <div class="product-info" style="display:block;text-align:center">
        <h2>Your shopping cart is empty</h2>
        <a href="our-games.html">Continue shopping</a>
      </div>
    `;
    return;
  }

  section.innerHTML =
    items.map(row).join("") +
    `
    <div class="product-info" style="justify-content:center">
      <div class="product-price"><h3>Total: $${cartTotal().toFixed(
        2
      )}</h3></div>
    </div>
  `;

  // qty handlers
  section.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      changeQty(btn.dataset.inc, +1);
      render();
    });
  });
  section.querySelectorAll("[data-dec]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      changeQty(btn.dataset.dec, -1);
      render();
    });
  });

  // remove
  section.querySelectorAll("[data-remove]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      removeFromCart(link.dataset.remove);
      render();
    });
  });
}

render();
