


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeHook.ts

import { useCallback, useEffect, useState } from "react";

import type { Employee } from "./employeeTypes";

import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "./employeeAPIservice";


export function useEmployee() {

    const [employees, setEmployees] =
        useState<Employee[]>([]);

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
            employee: Employee
        ): Promise<Employee> => {

            try {

                setError(null);

                let savedEmployee: Employee;

                if (employee.EmployeeID) {

                    // UPDATE

                    savedEmployee = await updateEmployee(
                        employee.EmployeeID,
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
        EmployeeID: string
    ) => {

        try {

            setError(null);

            await deleteEmployee(EmployeeID);

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