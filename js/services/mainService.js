async function fetchMainData() {
  const res = await fetch("http://localhost:3000/api/main");
  if (!res.ok) throw new Error("Failed to load main");
  return res.json();
}
