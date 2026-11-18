


// file:    src/api/authAPI.ts

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

// -- EOF