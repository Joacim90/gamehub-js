const API = "https://api.noroff.dev/api/v1/gamehub";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return await res.json();
}

export async function getProducts() {
  return await getJson(API);
}

export async function getProduct(id) {
  if (!id) throw new Error("Missing id");
  return await getJson(`${API}/${id}`);
}
