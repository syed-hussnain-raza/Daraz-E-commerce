async function fetchMainData() {
  const res = await fetch("../data/main.json");
  if (!res.ok) throw new Error("Failed to load main.json");
  return res.json();
}
