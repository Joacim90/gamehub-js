import { getProduct } from "./api.js";
import { addToCart } from "./storage.js";

function imgUrl(image) {
  if (typeof image === "string") return image;
  if (image && image.url) return image.url;
  return "../images/placeholder.jpg";
}

const params = new URLSearchParams(location.search);
const id = params.get("id");

const imgEl = document.getElementById("prodImage");
const titleEl = document.getElementById("prodTitle");
const shortEl = document.getElementById("prodShort");
const priceEl = document.getElementById("prodPrice");
const headingEl = document.getElementById("prodHeading");
const descEl = document.getElementById("prodDesc");
const addBtn = document.getElementById("addBtn");

function priceText(p) {
  const hasDiscount =
    typeof p.discountedPrice === "number" && p.discountedPrice < p.price;
  const normal = Number(p.price).toFixed(2);
  if (hasDiscount) {
    const d = Number(p.discountedPrice).toFixed(2);
    return `From $${d} <span class="product-price-sale">$${normal}</span>`;
  }
  return `From $${normal}`;
}

async function init() {
  if (!id) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<p class="text-center clr-primary">Missing product id.</p>`
    );
    return;
  }

  try {
    document.title = "Loading…";
    const p = await getProduct(id);

    titleEl.textContent = (p.title || "").toLowerCase();
    imgEl.src = imgUrl(p.image);
    imgEl.alt = (p.image && p.image.alt) || p.title || "Game cover";
    shortEl.textContent = p.description || "";
    priceEl.innerHTML = priceText(p);
    headingEl.textContent = `${p.title} — Details`;
    descEl.textContent = p.description || "";

    addBtn.addEventListener("click", () => {
      addToCart(
        {
          id: p.id,
          title: p.title,
          price: p.price,
          discountedPrice: p.discountedPrice,
          onSale: p.onSale,
          image: p.image,
        },
        1
      ); // legg til/øk mengde
    });

    document.title = `${p.title} - GameHub`;
  } catch {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<p class="text-center clr-primary">Couldn’t load product. Please try again.</p>`
    );
  }
}

init();
