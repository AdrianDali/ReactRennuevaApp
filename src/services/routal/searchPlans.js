// src/services/routal/searchPlans.js

const BASE_URL = process.env.REACT_APP_SERVER_URL;


export async function searchPlans(params = {}, options = {}) {
  const base = process.env.REACT_APP_SERVER_URL; 
  const url = new URL("/routal/search-plans/", base);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    // credentials: "include",
    headers: { "Content-Type": "application/json" },
    signal: options.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text}`);
  }

  return res.json();
}

