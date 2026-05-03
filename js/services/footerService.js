async function fetchFooterData() {
  const res = await fetch("../data/footer.json");
  if (!res.ok) throw new Error("Failed to load footer.json");
  return res.json();
}
