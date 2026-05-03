async function fetchProductData(id) {
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}
