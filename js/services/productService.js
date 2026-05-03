async function fetchProductData(id) {
  const res = await fetch("../data/products.json");
  if (!res.ok) throw new Error("Failed to load products.json");
  const data = await res.json();
  return (
    data.products.find((p) => p.id === id) ||
    data.products.find((p) => p.id === "dustproof")
  );
}
