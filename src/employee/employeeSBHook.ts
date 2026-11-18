


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeSBHook.ts

import { useCallback, useEffect, useState } from "react";

import type { employee } from "./employeeSBTypes";

import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "./employeeSBAPIservice";


export function useEmployee() {

    const [employees, setEmployees] =
        useState<employee[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    // ==========================================
    // LOAD EMPLOYEES
    // ==========================================

    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);         
            await new Promise(resolve => setTimeout(resolve, 10));  // LOADING DELAYER
            const data = await getEmployees();
            setEmployees(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load employees.");
        } finally {
            setLoading(false);
        }
    }, []);


    // ==========================================
    // SAVE EMPLOYEE
    // CREATE OR UPDATE
    // ==========================================

        const saveEmployee = async (
            employee: employee
        ): Promise<employee> => {

            try {

                setError(null);

                let savedEmployee: employee;

                if (employee.employeeid) {

                    // UPDATE

                    savedEmployee = await updateEmployee(
                        employee.employeeid,
                        employee
                    );

                } else {

                    // CREATE

                    savedEmployee = await createEmployee(
                        employee
                    );

                }

                await loadEmployees();

                return savedEmployee;

            } catch (err) {

                console.error(err);

                setError("Failed to save employee.");

                throw err;

            }
        };


    // ==========================================
    // DELETE EMPLOYEE
    // ==========================================

    const removeEmployee = async (
        employeeid: string
    ) => {

        try {

            setError(null);

            await deleteEmployee(employeeid);

            await loadEmployees();

        } catch (err) {

            console.error(err);

            setError("Failed to delete employee.");

            throw err;

        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================
    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);


    return {
        employees,
        loading,
        error,
        loadEmployees,
        saveEmployee,
        deleteEmployee: removeEmployee
    };
}