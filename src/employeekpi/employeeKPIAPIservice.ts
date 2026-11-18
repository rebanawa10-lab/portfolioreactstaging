


// file:    employeeKPIAPIservice.ts 

import axios from "axios";

import type {
    EmployeeKPIYearToYear,
    KPIEmployee
} from "./employeeKPIYearToYearTypes";


const API_BASE = import.meta.env.VITE_NODEJS_API;

// http://localhost:3000/api/employeekpi/employeeKPIYearToYear
export const getEmployeeKPIYearToYear =
    async (): Promise<EmployeeKPIYearToYear[]> => {

        const response = await axios.get(
            `${API_BASE}/api/employeekpi/employeeKPIYearToYear`
        );

        return response.data;
    };

// http://localhost:3000/api/employeekpi/employees
export const getKPIEmployees =
    async (): Promise<KPIEmployee[]> => {

        const response = await axios.get(
            `${API_BASE}/api/employeekpi/employees`
        );

        return response.data;
    };


