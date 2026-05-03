async function fetchHeaderData() {
  const res = await fetch("http://localhost:3000/api/header");
  if (!res.ok) throw new Error("Failed to load header");
  return res.json();
}
