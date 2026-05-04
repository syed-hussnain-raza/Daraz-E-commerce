// Fetch main data from the API
async function fetchMainData() {
  // Make API call to fetch main data
  const res = await fetch("http://localhost:3000/api/main");

  // Error handling
  if (!res.ok) throw new Error("Failed to load main");

  // Parse JSON response
  const json = await res.json();

  // Return JSON data
  return json.data || json;
}
