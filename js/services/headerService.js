async function fetchHeaderData() {
  const res = await fetch("../data/header.json");
  if (!res.ok) throw new Error("Failed to load header.json");
  return res.json();
}
