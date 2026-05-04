// footerService.js
async function fetchFooterData() {
  // Simulate API call to fetch footer data
  const res = await fetch("http://localhost:3000/api/footer");

  // Error handling
  if (!res.ok) throw new Error("Failed to load footer");

  // Parse JSON response
  const json = await res.json();

  // Return JSON data
  return json.data || json;
}
