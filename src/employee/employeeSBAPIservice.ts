


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeSBAPIservice.ts

import axios from "axios";

import type { employee } from "./employeeSBTypes";

const API_BASE = import.meta.env.VITE_NODEJS_API_CLOUD;


// ==========================================
// EMPLOYEE 
// ==========================================

        // GET all employees
        export const getEmployees = async (): Promise<employee[]> => {

            const response = await axios.get(
                `${API_BASE}/api/employee`
            );

            return response.data;
        };


        // GET employee by ID
        export const getEmployee = async (
            employeeid: string
        ): Promise<employee> => {

            const response = await axios.get(
                `${API_BASE}/api/employee/${employeeid}`
            );

            return response.data;
        };


        // CREATE employee
        export const createEmployee = async (
            employee: Omit<employee, "employeeid">
        ): Promise<employee> => {

            const response = await axios.post(
                `${API_BASE}/api/employee`,
                employee
            );

            return response.data;
        };


        // UPDATE employee
        export const updateEmployee = async (
            employeeid: string,
            employee: Omit<employee, "employeeid">
        ): Promise<employee> => {

            const response = await axios.put(
                `${API_BASE}/api/employee/${employeeid}`,
                employee
            );

            return response.data;
        };


        // DELETE employee
        export const deleteEmployee = async (
            employeeid: string
        ): Promise<void> => {

            await axios.delete(
                `${API_BASE}/api/employee/${employeeid}`
            );
        };


// ==========================================
// WORK EXPERIENCE
// ==========================================


        // ==========================================
        // GET  WORK EXPERIENCE
        // ==========================================

        export const getWorkExperiences = async (
            employeeid: string
        ): Promise<employee["workexperiences"]> => {

            const response = await axios.get(
                `${API_BASE}/api/employee/${employeeid}/workexperience`
            );

            return response.data;
        };


        // ==========================================
        // CREATE WORK EXPERIENCE
        // ==========================================

        export const createWorkExperience = async (
            employeeid: string,
            workexperience: NonNullable<employee["workexperiences"]>[number]
        ) => {

            const response = await axios.post(
                `${API_BASE}/api/employee/${employeeid}/workexperience`,
                {
                    durationfrom:
                        workexperience.durationfrom || "",

                    durationto:
                        workexperience.durationto || "",

                    company:
                        workexperience.company || "",

                    designation:
                        workexperience.designation || "",

                    lastgrosssalary:
                        workexperience.lastgrosssalary || "",

                    reasonforleaving:
                        workexperience.reasonforleaving || ""
                }
            );

            return response.data;
        };


        // ==========================================
        // UPDATE WORK EXPERIENCE
        // ==========================================

        export const updateWorkExperience = async (
            employeeid: string,
            workexperienceid: string,
            workexperience: NonNullable<employee["workexperiences"]>[number]
        ) => {

            const response = await axios.put(
                `${API_BASE}/api/employee/${employeeid}/workexperience/${workexperienceid}`,
                {
                    durationfrom:
                        workexperience.durationfrom || "",

                    durationto:
                        workexperience.durationto || "",

                    company:
                        workexperience.company || "",

                    designation:
                        workexperience.designation || "",

                    lastgrosssalary:
                        workexperience.lastgrosssalary || "",

                    reasonforleaving:
                        workexperience.reasonforleaving || ""
                }
            );

            return response.data;
        };


        // ==========================================
        // DELETE WORK EXPERIENCE
        // ==========================================

        export const deleteWorkExperience = async (
            employeeid: string,
            workexperienceid: string
        ) => {

            await axios.delete(
                `${API_BASE}/api/employee/${employeeid}/workexperience/${workexperienceid}`
            );
        };



// ==========================================
// REFERENCE CONTACT
// ==========================================

        // GET REFERENCE CONTACTS
        export const getReferenceContacts = async (
            employeeid: string
        ): Promise<employee["referencecontacts"]> => {

            const response = await axios.get(
                `${API_BASE}/api/employee/${employeeid}/referencecontact`
            );

            return response.data;
        };


        // CREATE REFERENCE CONTACT
        export const createReferenceContact = async (
            employeeid: string,
            referenceContact: NonNullable<employee["referencecontacts"]>[number]
        ) => {

            const response = await axios.post(
                `${API_BASE}/api/employee/${employeeid}/referencecontact`,
                {
                    name:
                        referenceContact.name || "",

                    company:
                        referenceContact.company || "",

                    position:
                        referenceContact.position || "",

                    contactnumber:
                        referenceContact.contactnumber || "",

                    contactemail:
                        referenceContact.contactemail || ""
                }
            );

            return response.data;
        };


        // UPDATE REFERENCE CONTACT
        export const updateReferenceContact = async (
            employeeid: string,
            referencecontactid: string,
            referenceContact: NonNullable<employee["referencecontacts"]>[number]
        ) => {

            const response = await axios.put(
                `${API_BASE}/api/employee/${employeeid}/referencecontact/${referencecontactid}`,
                {
                    name:
                        referenceContact.name || "",

                    company:
                        referenceContact.company || "",

                    position:
                        referenceContact.position || "",

                    contactnumber:
                        referenceContact.contactnumber || "",

                    contactemail:
                        referenceContact.contactemail || ""
                }
            );

            return response.data;
        };


        // DELETE REFERENCE CONTACT
        export const deleteReferenceContact = async (
            employeeid: string,
            referencecontactid: string
        ) => {

            await axios.delete(
                `${API_BASE}/api/employee/${employeeid}/referencecontact/${referencecontactid}`
            );
        };