// file:    src/api/authAPI.ts


// VER1
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE;
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const switchRole = async (payload: any) => {
  const res = await axios.post(
    `${API_BASE_URL}/users/auth/switch-role`,
    payload,
    authHeaders()
  );

  // 🔥 IMPORTANT: replace token after switch
  localStorage.setItem("token", res.data.access_token);

  return res.data;
};


// VER2. NEW NO TO CHANGES 
// import { api } from "./client";

// export interface LoginResponse {
//   access_token: string;
//   token_type: string;
//   username: string;
//   is_admin: number;
//   is_level: number;
// }

// export const loginAPI = async (email: string, password: string) => {
//   const params = new URLSearchParams();
//   params.append("username", email);
//   params.append("password", password);

//   return api.post<LoginResponse>("/token", params, {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });
// };


// DUMMY ---- 
// export const loginAsRole = async (email: string, password: string) => {
//     const params = new URLSearchParams();
//     params.append("username", email);
//     params.append("password", password);

//     const res = await axios.post(
//         // "http://localhost:8000/api/token",
//         `${API_BASE_URL}/api/token`,
//         params,
//         {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         }
//     );

//     localStorage.setItem("token", res.data.access_token);

//     return res.data;
// };








// export const switchToRole  = async (email: string, password: string) => {
//   const params = new URLSearchParams();
//   params.append("username", email);
//   params.append("password", password);

//   const res = await axios.post(
//     "http://localhost:8000/api/token",
//     params,
//     {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     }
//   );

//     const token = res.data.access_token;

//     localStorage.setItem("token", token);

//   return res.data;
// };