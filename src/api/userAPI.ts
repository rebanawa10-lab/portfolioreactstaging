


// file:    src/api/userAPI.ts
//          FastAPI + Axios with JWT support

import axios from "axios";

import type { User } from "../types/user";

import { log } from "../../src/config/debug";

const API_URL = import.meta.env.VITE_API_BASE; 

log("20260710 VITE_API_BASE =", API_URL);
log("20260710 VITE_FASTAPI =", import.meta.env.VITE_FASTAPI);


// const API_URL = import.meta.env.VITE_API_BASE;
  // OLD 
  // import API_BASE from "../../src/config/apiBase";

const getToken = () => localStorage.getItem("token"); // get stored JWT


// Helper to add Authorization header
const authHeaders = () => {
  const token = getToken();
  if (!token) throw new Error("No token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};


// OLD:  const res = await axios.get(`${API_URL}/users`, authHeaders());
export const getUsers = async () => {
  // 20260710 
  // Old
  // const res = await axios.get(`${API_URL}/users`, authHeaders());

  // New
  const res = await axios.get(`${API_URL}/users/`, authHeaders());


  // 20260702
  console.log(res.data);

  // 20260710 
  console.log("20260710 Final URL:", res.request.responseURL);
  console.log("20260710 Content-Type:", res.headers["content-type"]);
  console.log("20260710 Data:", res.data);


  if (!Array.isArray(res.data)) {
    throw new Error("Invalid API response");
  }

  return res.data;
};

// Temp 20260710
export const getUsers_20260710 = async () => {
  const url = `${API_URL}/users/`;

  console.log("Calling URL:", url);

  const res = await axios.get(url, authHeaders());

  console.log("20260710 Final URL:", res.request.responseURL);
  console.log("20260710 Content-Type:", res.headers["content-type"]);
  console.log("20260710 Data:", res.data);

  console.log("Response status:", res.status);
  console.log("Response data:", res.data);

  if (!Array.isArray(res.data)) {
    throw new Error("Invalid API response");
  }

  return res.data;
};

 
export const getUserById = async (id: number): Promise<User> => {
  const res = await axios.get(`${API_URL}/users/${id}`, authHeaders());
  return res.data;
};


export const createUser = async (data: Partial<User>) => {
    try {
      const res = await axios.post(
        `${API_URL}/users/`,
        data,
        authHeaders()
      );

      log("✅ CREATE RESPONSE:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("❌ CREATE USER ERROR");
      console.error("STATUS:", err?.response?.status);
      console.error("DATA:", err?.response?.data);
      throw err;
    }
};


export const updateUser = async (id: number, payload: any) => {
  try {
    const res = await axios.put(
      `${API_URL}/users/${id}`,
      payload,
      authHeaders()
    );

    log("✅ UPDATE RESPONSE:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("❌ UPDATE ERROR:");
    console.error("STATUS:", err?.response?.status);
    console.error("DATA:", err?.response?.data);
    throw err;
  }
};


export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, authHeaders());
  return res.data;
};


// -- EOF