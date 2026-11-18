


// file: employeeSBKPIAPIservice.ts

import axios from "axios";

import type {
    EmployeeSBKPIYearToYear,
    KPIEmployee
} from "./employeeSBKPIYearToYearTypes";

import type {
    EmployeeSBKPIYearMonth
} from "./employeeSBKPIYearMonthTypes";


const API_BASE = import.meta.env.VITE_NODEJS_API_CLOUD;



// ==========================================
// GET KPI YEAR TO YEAR
// ==========================================

export const getEmployeeSBKPIYearToYear =
    async (): Promise<EmployeeSBKPIYearToYear[]> => {

        const response = await axios.get(
            `${API_BASE}/api/employeekpi/employeeKPIYearToYear`
        );

        return response.data;
    };


// ==========================================
// GET KPI EMPLOYEES
// ==========================================

export const getEmployeesSBKPI =
    async (): Promise<KPIEmployee[]> => {

        const response = await axios.get(
            `${API_BASE}/api/employeekpi/employees`
        );

        return response.data;
    };

    
// ==========================================
// GET KPI AVAILABLE YEARS
// ==========================================

export const getEmployeeSBKPIYears =
    async (): Promise<{
        years: number[];
        count: number;
    }> => {

        const response = await axios.get(
            `${API_BASE}/api/employeekpi/years`
        );

        return response.data;
    };

// ==========================================
// GET KPI YEAR MONTH
// ==========================================

export const getEmployeeSBKPIYearMonth =
    async (): Promise<EmployeeSBKPIYearMonth[]> => {

        const response = await axios.get(
            `${API_BASE}/api/employeekpi/employeeKPIYearMonth`
        );

        return response.data;
    };