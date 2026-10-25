// Where the backend lives. Change it later by setting VITE_API_URL (needed when we deploy).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchProducts(signal) {
  const res = await fetch(`${API_URL}/api/products`, { signal });
  if (!res.ok) {
    throw new Error(`Server replied with status ${res.status}`);
  }
  return res.json();
}