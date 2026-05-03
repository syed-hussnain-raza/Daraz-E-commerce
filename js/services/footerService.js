async function fetchFooterData() {
  const res = await fetch("http://localhost:3000/api/footer");
  if (!res.ok) throw new Error("Failed to load footer");
  return res.json();
}
