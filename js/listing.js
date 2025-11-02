import { getProducts } from "./api.js";

let allProducts = [];

function imgUrl(image) {
  if (typeof image === "string") return image;
  if (image && image.url) return image.url;
  return "images/placeholder.jpg";
}

function priceHtml(p) {
  const hasDiscount =
    typeof p.discountedPrice === "number" && p.discountedPrice < p.price;
  const normal = Number(p.price).toFixed(2);
  if (hasDiscount) {
    const disc = Number(p.discountedPrice).toFixed(2);
    return `
      <div class="product-price-sale text-center"><h3>$${normal}</h3></div>
      <div class="product-price text-center"><h3>$${disc}</h3></div>
    `;
  }
  return `<div class="product-price text-center"><h3>$${normal}</h3></div>`;
}

function card(p) {
  const href = `product/index.html?id=${encodeURIComponent(p.id)}`;
  const img = imgUrl(p.image);
  const alt = (p.image && p.image.alt) || p.title || "Game cover";
  return `
    <div class="game-card">
      <a href="${href}">
        <div class="product-image">
          <img src="${img}" alt="${alt}" />
        </div>
        <div class="product-title text-center uppercase">
          <h2>${(p.title || "").toLowerCase()}</h2>
        </div>
        ${priceHtml(p)}
      </a>
      <div class="add-to-cart-btn">
        <a class="button-primary" href="${href}">Add to cart</a>
      </div>
    </div>
  `;
}

function renderList(list, grid) {
  if (!list.length) {
    grid.innerHTML = `<p class="text-center clr-primary">No products found.</p>`;
    return;
  }
  grid.innerHTML = list.map(card).join("");
}

function handleFilter() {
  const select = document.getElementById("genre-filter");
  const grid = document.querySelector(".game-cards");
  if (!select || !grid) return;

  select.addEventListener("change", () => {
    const value = select.value;
    if (value === "all") {
      renderList(allProducts, grid);
    } else {
      const filtered = allProducts.filter(
        (p) => (p.genre || "").toLowerCase() === value.toLowerCase()
      );
      renderList(filtered, grid);
    }
  });
}

async function init() {
  const grid = document.querySelector(".game-cards");
  if (!grid) return;

  grid.innerHTML = `<p class="text-center clr-primary">Loading…</p>`;

  try {
    const products = await getProducts();
    allProducts = products;
    renderList(allProducts, grid);
    handleFilter();
  } catch {
    grid.innerHTML = `<p class="text-center clr-primary">Couldn’t load products. Please try again.</p>`;
  }
}

init();
