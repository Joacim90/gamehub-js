// Enkel helper for å hente bildeadresse uansett format (string eller { url }).
export function imgUrl(image) {
  return typeof image === "string" ? image : (image && image.url) || "";
}
