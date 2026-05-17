// file:    src/api.ts

import axios from "axios";

import { log } from "./config/debug";

const NODE_API = import.meta.env.VITE_NODE_API;
const FAST_API = import.meta.env.VITE_FASTAPI;

log("Node API:", NODE_API);
log("FastAPI:", FAST_API);

export const nodeApi = axios.create({
  baseURL: NODE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fastApi = axios.create({
  baseURL: FAST_API,
  headers: {
    "Content-Type": "application/json",
  },
});
