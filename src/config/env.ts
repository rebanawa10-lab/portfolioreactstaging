// file:    src/config/env.ts


// const env = {
//   API_BASE: import.meta.env.VITE_API_BASE,
//   MODE: import.meta.env.VITE_MODE,
// };


const env = {
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
  apiBase: import.meta.env.VITE_API_BASE,
};

export default env;