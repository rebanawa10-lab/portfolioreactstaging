// file:    src/api/userAPI.ts
//          FastAPI + Axios with JWT support


import axios from "axios";

import type { User } from "../types/user";

import { log } from "../../src/config/debug";

const API_URL = import.meta.env.VITE_API_BASE;
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
  const res = await axios.get(`${API_URL}/users`, authHeaders());

  if (!Array.isArray(res.data)) {
    throw new Error("Invalid API response");
  }

  return res.data;
};

  // OLD
  // export const getUsers = async () => {
  //     const token = getToken();

  //     if (!token) throw new Error("No token");

  //     // silent
  //     // if (!token) {
  //     //   console.error("❌ No token found");
  //     //   return [];
  //     // }

  //     const res = await axios.get(`${API_URL}/users/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!Array.isArray(res.data)) {
  //       console.error("❌ INVALID RESPONSE:", res.data);
  //       throw new Error("Invalid API response");
  //     }

  //     return res.data;
      
  // };






    // OLD
    // const authHeaders = () => ({
    //   headers: {
    //     Authorization: `Bearer ${getToken()}`,
    //   },
    // });


export const getUserById = async (id: number): Promise<User> => {
  const res = await axios.get(`${API_URL}/users/${id}`, authHeaders());
  return res.data;
};


// NEW

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


    // export const createUser = async (data: Partial<User>) => {
    //   try {
    //     const res = await axios.post(
    //       `${API_URL}/users/`,
    //       data,
    //       authHeaders()
    //     );

    //     log("✅ CREATE RESPONSE:", res.data);
    //     return res.data;
    //   } catch (err: any) {
    //      console.error("❌ CREATE USER ERROR");
    //     console.error("STATUS:", err?.response?.status);
    //     console.error("DATA:", err?.response?.data);
    //     console.error("MESSAGE:", err?.message);

    //     throw err; // ❗ IMPORTANT: let UI handle it
    //   }
    // };

      // OLD
      // export const createUser = async (data: Partial<User>) => {
      //   const res = await axios.post(`${API_URL}/users/`, data, authHeaders());
      //   return res.data;
      // };


// VER2
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

    // OLD 
    // 202604 13 Working#2

    // export const updateUser = async (id: number, payload: any) => {
    //   try {

    //     const token = localStorage.getItem("token");

    //     log("========== src/api/userAPI.ts: updateUser - Token ", `{token}`)

    //     // `http://localhost:8000/users/${id}`,

    //     // `${import.meta.env.VITE_API_BASE}/users/${id}`,
    //     const res = await axios.put(
    //       `${API_URL}/users/${id}`,
    //       payload,
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );

    //     log("✅ UPDATE RESPONSE:", res.data);
    //     return res.data;
    //   } catch (err: any) {
    //     console.error("❌ UPDATE ERROR:");
    //     console.error("STATUS:", err?.response?.status);
    //     console.error("DATA:", err?.response?.data);
    //     throw err;
    //   }
    // };


export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, authHeaders());
  return res.data;
};





// Base URL
// Working
// const API_URL = "http://localhost:8000"; // FastAPI backend


// TEST : Working
// const API_URL = " http://127.0.0.1:8000";
//       Load this: C:\Repos\PortfolioStaging\ReactCRUDFastAPIIIS>uvicorn app.main:app --reload


// TEST : Working
// const API_URL = import.meta.env.VITE_FASTAPI; // FastAPI backend  , VITE_FASTAPI=http://127.0.0.1:8000
//      Load this:  C:\Repos\PortfolioStaging\ReactCRUDFastAPIIIS>    uvicorn app.main:app --reload  

// TEST : Working
// const API_URL = import.meta.env.VITE_FASTAPI;
//      Load this:  C:\Repos\PortfolioStaging\ReactCRUDFastAPIIIS>    uvicorn app.main:app --reload --port 8000



// TEST : Inprogress.  

// const API_URL = import.meta.env.VITE_FASTAPI;
//      Load: Services.msc , FastAPIService

// NSSM:
// Start Directory:     C:\ReposPUBLISH\ReachCRUDFastAPIService
// Arguments:           -m uvicorn app.main:app --host 127.0.0.1 --port 8000


// ---------- Users API ----------

// VER2 temp

// 20260420


// 202604 13 Working#1

// export const getUsers_20260420B4 = async (): Promise<User[]> => {
//   try {
//       const token = getToken();

//       // log("🔑 TOKEN:", token);
//       console.log("API BASE =", import.meta.env.VITE_API_BASE); // 👈 PUT HERE
//       console.log("FULL URL =", `${API_URL}/users`);
//       console.log("TOKEN =", localStorage.getItem("token"));

//       const res = await axios.get(`${API_URL}/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // Detect bad API response early
//       if (!Array.isArray(res.data)) {
//         console.error("❌ INVALID RESPONSE FROM API:", res.data);
//         return [];
//       }

//       // DEBUG MODE: 
//       // log("✅ USERS API RESPONSE:", res.data);

//       return res.data;
//   } catch (err: any) {
//       console.error("❌ AXIOS ERROR:");
//       console.error("STATUS:", err?.response?.status);
//       console.error("DATA:", err?.response?.data);
//       console.error("MESSAGE:", err?.message);

//       throw err;
//   }
// };

// VER2

// export const getUsers = async (): Promise<User[]> => {
//   const token = getToken();

//   if (!token) {
//     console.error("❌ No token found in localStorage");
//     throw new Error("No token");
//   }

//   const res = await axios.get(`${API_URL}/users`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   log("***** userAPI TOKEN USED:", token);
//   return res.data;
// };


// VER1
// export const getUsers = async (): Promise<User[]> => {
//   const res = await axios.get(`${API_URL}/users`, authHeaders());
//   log("***** userAPI TOKEN USED:", getToken());
//   return res.data;
// };


// VER1
// export const updateUser = async (id: number, payload: any) => {
//   const token = localStorage.getItem("token"); // must exist
//   const res = await axios.put(`http://localhost:8000/users/${id}`, payload, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// };