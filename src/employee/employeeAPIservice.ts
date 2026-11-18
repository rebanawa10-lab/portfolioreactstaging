


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeAPIservice.ts

import axios from "axios";

import type { Employee } from "./employeeTypes";



const API_BASE = import.meta.env.VITE_NODEJS_API;


// ==========================================
// EMPLOYEE 
// ==========================================

        // GET all employees
        export const getEmployees = async (): Promise<Employee[]> => {

            const response = await axios.get(
                `${API_BASE}/api/employee`
            );

            return response.data;
        };


        // GET employee by ID
        export const getEmployee = async (
            EmployeeID: string
        ): Promise<Employee> => {

            const response = await axios.get(
                `${API_BASE}/api/employee/${EmployeeID}`
            );

            return response.data;
        };


        // CREATE employee
        export const createEmployee = async (
            employee: Omit<Employee, "EmployeeID">
        ): Promise<Employee> => {

            const response = await axios.post(
                `${API_BASE}/api/employee`,
                employee
            );

            return response.data;
        };


        // UPDATE employee
        export const updateEmployee = async (
            EmployeeID: string,
            employee: Omit<Employee, "EmployeeID">
        ): Promise<Employee> => {

            const response = await axios.put(
                `${API_BASE}/api/employee/${EmployeeID}`,
                employee
            );

            return response.data;
        };


        // DELETE employee
        export const deleteEmployee = async (
            EmployeeID: string
        ): Promise<void> => {

            await axios.delete(
                `${API_BASE}/api/employee/${EmployeeID}`
            );
        };


// ==========================================
// WORK EXPERIENCE
// ==========================================


        // ==========================================
        // GET  WORK EXPERIENCE
        // ==========================================

        export const getWorkExperiences = async (
            EmployeeID: string
        ): Promise<Employee["WorkExperiences"]> => {

            const response = await axios.get(
                `${API_BASE}/api/employee/${EmployeeID}/workexperience`
            );

            return response.data;
        };


        // ==========================================
        // CREATE WORK EXPERIENCE
        // ==========================================

        export const createWorkExperience = async (
            EmployeeID: string,
            workExperience: NonNullable<Employee["WorkExperiences"]>[number]
        ) => {

            const response = await axios.post(
                `${API_BASE}/api/employee/${EmployeeID}/workexperience`,
                {
                    DurationFrom:
                        workExperience.DurationFrom || "",

                    DurationTo:
                        workExperience.DurationTo || "",

                    Company:
                        workExperience.Company || "",

                    Designation:
                        workExperience.Designation || "",

                    LastGrossSalary:
                        workExperience.LastGrossSalary || "",

                    ReasonForLeaving:
                        workExperience.ReasonForLeaving || ""
                }
            );

            return response.data;
        };


        // ==========================================
        // UPDATE WORK EXPERIENCE
        // ==========================================

        export const updateWorkExperience = async (
            EmployeeID: string,
            WorkExperienceID: string,
            workExperience: NonNullable<Employee["WorkExperiences"]>[number]
        ) => {

            const response = await axios.put(
                `${API_BASE}/api/employee/${EmployeeID}/workexperience/${WorkExperienceID}`,
                {
                    DurationFrom:
                        workExperience.DurationFrom || "",

                    DurationTo:
                        workExperience.DurationTo || "",

                    Company:
                        workExperience.Company || "",

                    Designation:
                        workExperience.Designation || "",

                    LastGrossSalary:
                        workExperience.LastGrossSalary || "",

                    ReasonForLeaving:
                        workExperience.ReasonForLeaving || ""
                }
            );

            return response.data;
        };


        // ==========================================
        // DELETE WORK EXPERIENCE
        // ==========================================

        export const deleteWorkExperience = async (
            EmployeeID: string,
            WorkExperienceID: string
        ) => {

            await axios.delete(
                `${API_BASE}/api/employee/${EmployeeID}/workexperience/${WorkExperienceID}`
            );
        };



// ==========================================
// REFERENCE CONTACT
// ==========================================

        // GET REFERENCE CONTACTS
        export const getReferenceContacts = async (
            EmployeeID: string
        ): Promise<Employee["ReferenceContacts"]> => {

            const response = await axios.get(
                `${API_BASE}/api/employee/${EmployeeID}/referencecontact`
            );

            return response.data;
        };


        // CREATE REFERENCE CONTACT
        export const createReferenceContact = async (
            EmployeeID: string,
            referenceContact: NonNullable<Employee["ReferenceContacts"]>[number]
        ) => {

            const response = await axios.post(
                `${API_BASE}/api/employee/${EmployeeID}/referencecontact`,
                {
                    Name:
                        referenceContact.Name || "",

                    Company:
                        referenceContact.Company || "",

                    Position:
                        referenceContact.Position || "",

                    ContactNumber:
                        referenceContact.ContactNumber || "",

                    ContactEmail:
                        referenceContact.ContactEmail || ""
                }
            );

            return response.data;
        };


        // UPDATE REFERENCE CONTACT
        export const updateReferenceContact = async (
            EmployeeID: string,
            ReferenceContactID: string,
            referenceContact: NonNullable<Employee["ReferenceContacts"]>[number]
        ) => {

            const response = await axios.put(
                `${API_BASE}/api/employee/${EmployeeID}/referencecontact/${ReferenceContactID}`,
                {
                    Name:
                        referenceContact.Name || "",

                    Company:
                        referenceContact.Company || "",

                    Position:
                        referenceContact.Position || "",

                    ContactNumber:
                        referenceContact.ContactNumber || "",

                    ContactEmail:
                        referenceContact.ContactEmail || ""
                }
            );

            return response.data;
        };


        // DELETE REFERENCE CONTACT
        export const deleteReferenceContact = async (
            EmployeeID: string,
            ReferenceContactID: string
        ) => {

            await axios.delete(
                `${API_BASE}/api/employee/${EmployeeID}/referencecontact/${ReferenceContactID}`
            );
        };


