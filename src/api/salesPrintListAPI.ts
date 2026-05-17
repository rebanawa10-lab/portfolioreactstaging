// file:    src/api/salesServiceAPI.ts
// salesServiceAPI

import { nodeApi } from "./axiosClient";


import { log } from "../../src/config/debug";

export type User = {
  userid: number;
  username: string;
  country: string;
  countrydesc: string;
  hired: string;
  active: number; 
  sales: number;
};

export const getSalesman = async (): Promise<User[]> => {
  
  const url = `${import.meta.env.VITE_NODEJS_API || ""}/api/sales`
  log("Todo MS SQL SVR:", url); 

  // ORIG      : "/salesman";
  // log("Fetching Salesman from URL:", url); // ✅ debug log

  const res = await nodeApi.get(url);

  return res.data;


};


