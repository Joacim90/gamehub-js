const KEY = "gh.cart";

function normalize(items) {
  return (items || []).map((p) => ({
    ...p,
    qty: Math.max(1, Number(p.qty || 1)),
  }));
}

export function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || [];
    return normalize(raw);
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(normalize(items)));
}

export function addToCart(item, qty = 1) {
  const cart = getCart();
  const i = cart.findIndex((p) => String(p.id) === String(item.id));
  if (i > -1) {
    cart[i].qty = Math.max(1, Number(cart[i].qty || 1) + Number(qty || 1));
  } else {
    cart.push({ ...item, qty: Math.max(1, Number(qty || 1)) });
  }
  saveCart(cart);
}

export function removeFromCart(id) {
  const items = getCart().filter((p) => String(p.id) !== String(id));
  saveCart(items);
}

export function changeQty(id, delta) {
  const cart = getCart();
  const i = cart.findIndex((p) => String(p.id) === String(id));
  if (i === -1) return;
  const next = (Number(cart[i].qty) || 1) + Number(delta || 0);
  if (next <= 0) {
    cart.splice(i, 1);
  } else {
    cart[i].qty = next;
  }
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(KEY);
}

function unitPrice(p) {
  return typeof p.discountedPrice === "number" && p.discountedPrice < p.price
    ? Number(p.discountedPrice)
    : Number(p.price);
}

export function cartTotal() {
  return getCart().reduce((sum, p) => sum + unitPrice(p) * (p.qty || 1), 0);
}
