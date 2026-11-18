


// file:   employeeSBInvoiceAPIservice.ts 

import axios from "axios";

import type { EmployeeSBInvoice } from "./employeeSBInvoiceTypes";

const API_BASE = import.meta.env.VITE_NODEJS_API_CLOUD;


// ==========================================
// EMPLOYEE SUPABASE INVOICE
// ==========================================

export const getEmployeeSBInvoices = async (
    employeeid?: string,
    year?: number | "ALL"
): Promise<EmployeeSBInvoice[]> => {

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
