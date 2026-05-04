// Header service to fetch header data from the server
async function fetchHeaderData() {
  // Fetch header data from the API
  const res = await fetch("http://localhost:3000/api/header");

  // Check if the response is successful
  if (!res.ok) throw new Error("Failed to load header");

  // Parse JSON response
  const json = await res.json();

  // Return JSON data
  return json.data || json;
}
