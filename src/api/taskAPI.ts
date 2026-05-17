// file:    src/api/taskAPI.ts
//          FastAPI + Axios

import axios from "axios";

import API_BASE from "../../src/config/apiBase";

const API_URL = import.meta.env.VITE_API_BASE;


export const getTasks = async () => {
  const res = await axios.get(`${API_BASE}/tasks/`);
  return res.data;
};




// OLD
// export const getTasks_20260420B4 = async () => {
//   const res = await axios.get(`${API_URL}/tasks/`);
//   return res.data;
// };

// OLD2
// export const getTasks = async () => {
//   const res = await axios.get(`${API_URL}/tasks`);

//   const data = res.data;

//   return Array.isArray(data) ? data : [];
// };

// OLD3
// export const getTasks = async () => {
//   const res = await axios.get(`${API_URL}/tasks`);

//   const data = res.data;

//   if (!Array.isArray(data)) {
//     console.error("Invalid API response (expected array):", data);
//     return [];
//   }

//   return data;
// };

// OLD
// // const response = await axios.get(`${API_URL}/tasks/`);
// export const getTasks = async () => {
//   try {   
//     const response = await axios.get(`${API_URL}/tasks`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching tasks", error);
//     throw error;
//   }
// };

export const createTask = async (taskData: { name: string; iscompleted: boolean }) => {
  try {
    const response = await axios.post(`${API_URL}/tasks/`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task", error);
    throw error;
  }
};

export const updateTask = async (id: number, taskData: { name: string; iscompleted: boolean }) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task", error);
    throw error;
  }
};

export const getTaskById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task by id", error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  return axios.delete(`${API_URL}/tasks/${id}`);
};


