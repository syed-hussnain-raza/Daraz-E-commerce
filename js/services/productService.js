// Fetch product data from the API
async function fetchProductData(id) {
  // Make API call to fetch product data
  const res = await fetch(`http://localhost:3000/api/products/${id}`);

  // Error handling
  if (!res.ok) throw new Error("Failed to load product");

  // Parse JSON response
  const json = await res.json();

  // Return JSON data
  return json.data || json;
}
