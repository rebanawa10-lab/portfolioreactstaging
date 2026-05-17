// file:    src/config/apiBase.ts


const API_BASE =
  import.meta.env.VITE_API_BASE || "/api";

export default API_BASE;


// .env.development
// VITE_API_BASE=http://127.0.0.1:8000

// .env.iis
// VITE_API_BASE=/api