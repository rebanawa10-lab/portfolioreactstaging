


// file:       employeeInvoiceAPIservice.ts

import axios from "axios";

import type { EmployeeInvoice } from "./employeeInvoiceTypes";

// const API_BASE = import.meta.env.VITE_NODEJS_API_CLOUD;

const API_BASE = import.meta.env.VITE_NODEJS_API;


// ==========================================
// EMPLOYEE INVOICE
// ==========================================

export const getEmployeeInvoices = async (
    employeeid?: string,
    year?: number | "ALL"
): Promise<EmployeeInvoice[]> => {

    const response = await axios.get(
        `${API_BASE}/api/employee/invoices`,
        {
            params: {
                employeeid,
                year
            }
        }
    );

    return response.data;
};


