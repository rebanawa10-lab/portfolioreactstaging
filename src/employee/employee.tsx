


// file:    C:\Repos\PortfolioStaging\React\src\employee\Employee.tsx

// 202609 12
import { useEffect, useState } from "react";
// import { useState } from "react";

import EmployeeForm from "./employeeForm";

import EmployeeTable from "./employeeTable";

import type { Employee } from "./employeeTypes";

import { useEmployee } from "./employeeHook";

import {
    getEmployee,

    // Work Experience
    getWorkExperiences,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,

    // Reference Contact
    getReferenceContacts,
    createReferenceContact,
    updateReferenceContact,
    deleteReferenceContact

} from "./employeeAPIservice";


import "./employee.css";


import { normalizeDate } from "../utils/gFunc";


import { log } from "../config/debug" ;

// 202609 12
import EmployeeReport from "./employeeRpt";




// ==========================================
// USER-FRIENDLY ERROR MESSAGES
// ==========================================

const ERROR_MESSAGES = {
    companyIdRequired: "Please enter Company ID.",
    employeeIdRequired: "Please enter Employee ID.",
    nameRequired: "Please enter Name.",
    emailRequired: "Please enter Email.",
    emailInvalid: "Please enter a valid email address.",
    duplicateEmployeeId: "Employee ID already exists.",
    duplicateEmail: "Email already exists.",
    duplicateCompanyId: "Company ID already exists.",
    saveFailed: "Unable to save employee. Please check the information entered."
};

// ==========================================
// EMPLOYEE COMPONENT
// ==========================================


function Employee() {

    const {
        employees,
        loading,
        saveEmployee,
        deleteEmployee
    } = useEmployee();

    // 202609 12
    const [filteredEmployees, setFilteredEmployees] =
        useState<Employee[]>([]);

    const [showModal, setShowModal] =
        useState(false);

    // 202609 05 
    const [saving, setSaving] =
    useState(false);

    const [editingEmployee, setEditingEmployee] =
        useState<Employee | undefined>(undefined);

    const [modalError, setModalError] =
        useState<string | null>(null);

    const [fieldErrors, setFieldErrors] =
    useState<Partial<Record<keyof Employee, string>>>({});

    const [deleteEmployeeTarget, setDeleteEmployeeTarget] =
    useState<Employee | null>(null);

    const [originalEmployee, setOriginalEmployee] =
    useState<Employee | undefined>(undefined);

    const [originalWorkExperiences, setOriginalWorkExperiences] =
    useState<Employee["WorkExperiences"]>([]);


    const [originalReferenceContacts, setOriginalReferenceContacts] =
    useState<Employee["ReferenceContacts"]>([]);



    // ==========================================
    // ADD EMPLOYEE
    // ==========================================

    const handleAdd = () => {

        setModalError(null);
        setFieldErrors({});

        setOriginalEmployee(undefined);
        setOriginalWorkExperiences([]);
        setOriginalReferenceContacts([]);

        setEditingEmployee(undefined);

        setShowModal(true);

    };

    

    // ==========================================
    // CLOSE MODAL
    // ==========================================
   
    const handleCloseModal = () => {

        setShowModal(false);

        setEditingEmployee(undefined);

        setOriginalEmployee(undefined);
        setOriginalWorkExperiences([]);
        setOriginalReferenceContacts([]);

        setModalError(null);
        setFieldErrors({});

    };

  

    // ==========================================
    // EDIT EMPLOYEE
    // ==========================================

    const handleEdit = async (employee: Employee) => {
    // const handleEdit = (employee: Employee) => {
    
        log("EDIT EMPLOYEE:", employee);

        try {

            setModalError(null);
            setFieldErrors({});

            // ==========================================
            // GET EMPLOYEE MASTER
            // ==========================================

            // Retrieve full employee including child records
            const fullEmployee = await getEmployee(
                employee.EmployeeID
            );


            // ==========================================
            // GET WORK EXPERIENCES
            // ==========================================
            const workExperiences =
                await getWorkExperiences(
                    employee.EmployeeID
                );

            // ==========================================
            // GET REFERENCE CONTACT 
            // ==========================================
            const referenceContacts =
                await getReferenceContacts(
                    employee.EmployeeID
                );


            // ==========================================
            // COMBINE EMPLOYEE + WORK EXPERIENCE + REFERENCE CONTACT 
            // ==========================================
            const employeeWithDetails: Employee = {
                ...fullEmployee,
                WorkExperiences: workExperiences,
                ReferenceContacts: referenceContacts
                    // fullEmployee.ReferenceContacts ?? []
            };

            // ==========================================
            // DEBUG
            // ==========================================
            log(
                "FULL EMPLOYEE:",
                employeeWithDetails
            );

            log(
                "FULL WORK EXPERIENCES:",
                employeeWithDetails.WorkExperiences
            );
            
            setOriginalEmployee(fullEmployee);

            setOriginalWorkExperiences(workExperiences);

            setOriginalReferenceContacts(referenceContacts);

            setEditingEmployee(employeeWithDetails);

            setShowModal(true);

        } catch (err) {

            console.error(
                "Failed to load employee details:",
                err
            );

            setModalError(
                "Unable to load employee details."
            );
        }

    };


    // ==========================================
    // SAVE START
    // ==========================================

    const handleSave = async (employee: Employee) => {

            // ==========================================
            // ADD OR EDIT
            // ==========================================

            const isEdit = !!employee.EmployeeID;

            const newFieldErrors: Partial<
                Record<keyof Employee, string>
            > = {};

            // ==========================================
            // REQUIRED FIELD VALIDATION
            // ==========================================

            if (!employee.CompanyID?.trim()) {

                newFieldErrors.CompanyID =
                    ERROR_MESSAGES.companyIdRequired;
            }

            if (!employee.Name?.trim()) {

                newFieldErrors.Name =
                    ERROR_MESSAGES.nameRequired;
            }


            // ==========================================
            // DUPLICATE COMPANY ID
            // ==========================================

            const duplicateCompany = employees.some(existingEmployee =>

                existingEmployee.CompanyID?.trim().toLowerCase() ===
                employee.CompanyID?.trim().toLowerCase()

                &&
                existingEmployee.EmployeeID !== employee.EmployeeID
            );

            if (
                employee.CompanyID?.trim() &&
                duplicateCompany
            ) {

                newFieldErrors.CompanyID =
                    ERROR_MESSAGES.duplicateCompanyId;
            }


            // ==========================================
            // STOP SAVE IF VALIDATION FAILED
            // ==========================================

            if (Object.keys(newFieldErrors).length > 0) {

                setFieldErrors(newFieldErrors);

                // Show first validation error in footer
                setModalError(
                    newFieldErrors.CompanyID ||
                    newFieldErrors.Name ||
                    null
                );

                return;
            }

    
            setSaving(true);        // 202609 05
            await new Promise(resolve => setTimeout(resolve, 2000));    // 202609 05

            try {

                setModalError(null);
                setFieldErrors({});

                // ==========================================
                // DEBUG - CHECK FORM DATA
                // ==========================================

                log(
                    "EMPLOYEE BEFORE SAVE:",
                    employee
                );

                log(
                    "CompanyID:",
                    employee.CompanyID
                );



                // SAVE VER 2 Start
                // ==========================================
                // EMPLOYEE ID
                // ==========================================

                let EmployeeID: string;


                // ==========================================
                // ADD EMPLOYEE
                // ==========================================

                if (!isEdit) {

                    log("ADD MODE");

                    // ==========================================
                    // CREATE EMPLOYEE
                    // ==========================================

                    const savedEmployee =
                        await saveEmployee(employee);

                    log(
                        "EMPLOYEE CREATED:",
                        savedEmployee
                    );

                    EmployeeID =
                        savedEmployee.EmployeeID ||
                        employee.EmployeeID;


                    if (!EmployeeID) {

                        throw new Error(
                            "EmployeeID was not returned after saving employee."
                        );

                    }

                }


                // ==========================================
                // EDIT EMPLOYEE
                // ==========================================

                else {

                    log("EDIT MODE");

                    EmployeeID =
                        employee.EmployeeID;


                    // ==========================================
                    // CHECK IF EMPLOYEE MASTER CHANGED
                    // ==========================================

                    const nameChanged =
                        String(originalEmployee?.Name ?? "") !==
                        String(employee.Name ?? "");

                    const emailChanged =
                        String(originalEmployee?.Email ?? "") !==
                        String(employee.Email ?? "");

                    const handPhoneChanged =
                        String(originalEmployee?.HandPhone ?? "") !==
                        String(employee.HandPhone ?? "");

                    const companyIDChanged =
                        String(originalEmployee?.CompanyID ?? "") !==
                        String(employee.CompanyID ?? "");

                    const startDateChanged =
                        normalizeDate(originalEmployee?.StartDate) !==
                        normalizeDate(employee.StartDate);

                    const endDateChanged =
                        normalizeDate(originalEmployee?.EndDate) !==
                        normalizeDate(employee.EndDate);

                    const statusChanged =
                        String(originalEmployee?.Status ?? "") !==
                        String(employee.Status ?? "");


                    log("Name changed:", nameChanged);
                    log("Email changed:", emailChanged);
                    log("HandPhone changed:", handPhoneChanged);
                    log("CompanyID changed:", companyIDChanged);
                    log("StartDate changed:", startDateChanged);
                    log("EndDate changed:", endDateChanged);
                    log("Status changed:", statusChanged);


                    const employeeChanged =
                        nameChanged ||
                        emailChanged ||
                        handPhoneChanged ||
                        companyIDChanged ||
                        startDateChanged ||
                        endDateChanged ||
                        statusChanged;


                    log(
                        "FINAL employeeChanged:",
                        employeeChanged
                    );

                    log("ORIGINAL EMPLOYEE:", originalEmployee);
                    log("CURRENT EMPLOYEE:", employee);
                    log("EMPLOYEE CHANGED:", employeeChanged);


                    // ==========================================
                    // UPDATE EMPLOYEE ONLY IF CHANGED
                    // ==========================================

                    if (employeeChanged) {

                        log(
                            "EMPLOYEE CHANGED → UPDATE EMPLOYEE"
                        );

                            log("========== EMPLOYEE MASTER UPDATE ==========");
                            log("EmployeeID:", EmployeeID);
                            log("employeeChanged:", employeeChanged);
                            log("Calling saveEmployee()");
                            log("============================================");


                        await saveEmployee(employee);

                    }

                    else {

                        log(
                            "EMPLOYEE UNCHANGED → SKIP EMPLOYEE UPDATE"
                        );
                    }

                }
                // SAVE VER 2 End


                // ==========================================
                // SAVE WORK EXPERIENCES
                // ==========================================
                    const workExperiences =
                    employee.WorkExperiences ?? [];

                    // ==========================================
                    // ADD MODE
                    // CREATE ALL WORK EXPERIENCES
                    // ==========================================
                    if (!isEdit) {

                        log("ADD MODE");

                        // New employee → all work experiences are new

                        for (const workExperience of workExperiences) {

                            log(
                                "CREATE WORK EXPERIENCE:",
                                workExperience
                            );

                            await createWorkExperience(
                                EmployeeID,
                                workExperience
                            );
                        }

                    }

                    // ==========================================
                    // EDIT MODE
                    // UPDATE / CREATE / DELETE WORK EXPERIENCES
                    // ==========================================
                    else {

                        log("EDIT MODE");

                        // ==========================================
                        // UPDATE EXISTING / CREATE NEW
                        // ==========================================

                        for (const workExperience of workExperiences) {

                            if (workExperience.WorkExperienceID) {

                                const originalWorkExperience =
                                    originalWorkExperiences.find(
                                        original =>
                                            original.WorkExperienceID ===
                                            workExperience.WorkExperienceID
                                    );


                                // ==========================================
                                // CHECK IF CHANGED
                                // ==========================================

                                if (
                                    originalWorkExperience &&
                                    (
                                        originalWorkExperience.DurationFrom !==
                                            workExperience.DurationFrom ||

                                        originalWorkExperience.DurationTo !==
                                            workExperience.DurationTo ||

                                        originalWorkExperience.Company !==
                                            workExperience.Company ||

                                        originalWorkExperience.Designation !==
                                            workExperience.Designation ||

                                        originalWorkExperience.LastGrossSalary !==
                                            workExperience.LastGrossSalary ||

                                        originalWorkExperience.ReasonForLeaving !==
                                            workExperience.ReasonForLeaving
                                    )
                                ) {

                                    log(
                                        "UPDATE CHANGED WORK EXPERIENCE:",
                                        workExperience
                                    );

                                    await updateWorkExperience(
                                        EmployeeID,
                                        workExperience.WorkExperienceID,
                                        workExperience
                                    );

                                } else {

                                    log(
                                        "WORK EXPERIENCE UNCHANGED:",
                                        workExperience.WorkExperienceID
                                    );
                                }

                            }

                            else {

                                // ==========================================
                                // NEW WORK EXPERIENCE
                                // ==========================================

                                log(
                                    "CREATE NEW WORK EXPERIENCE:",
                                    workExperience
                                );

                                await createWorkExperience(
                                    EmployeeID,
                                    workExperience
                                );
                            }
                        }


                        // ==========================================
                        // DELETE REMOVED WORK EXPERIENCES
                        // ==========================================

                        for (
                            const originalWorkExperience
                            of originalWorkExperiences
                        ) {

                            if (!originalWorkExperience.WorkExperienceID) {
                                continue;
                            }

                            const stillExists =
                                workExperiences.some(
                                    currentWorkExperience =>
                                        currentWorkExperience.WorkExperienceID ===
                                        originalWorkExperience.WorkExperienceID
                                );

                            if (!stillExists) {

                                log(
                                    "DELETE WORK EXPERIENCE:",
                                    originalWorkExperience
                                );

                                await deleteWorkExperience(
                                    EmployeeID,
                                    originalWorkExperience.WorkExperienceID
                                );
                            }
                        }
                    }



                    // ==========================================
                    // SAVE REFERENCE CONTACTS
                    // ==========================================

                    const referenceContacts =
                        employee.ReferenceContacts ?? [];


                    // ==========================================
                    // ADD MODE
                    // CREATE ALL REFERENCE CONTACTS
                    // ==========================================

                    if (!isEdit) {

                        log("ADD MODE - REFERENCE CONTACTS");

                        for (const referenceContact of referenceContacts) {

                            log(
                                "CREATE REFERENCE CONTACT:",
                                referenceContact
                            );

                            await createReferenceContact(
                                EmployeeID,
                                referenceContact
                            );
                        }
                    }


                    // ==========================================
                    // EDIT MODE
                    // UPDATE / CREATE / DELETE
                    // ==========================================

                    else {

                        log("EDIT MODE - REFERENCE CONTACTS");


                        // ==========================================
                        // UPDATE EXISTING / CREATE NEW
                        // ==========================================

                        for (const referenceContact of referenceContacts) {

                            // ==========================================
                            // EXISTING REFERENCE CONTACT
                            // ==========================================

                            if (referenceContact.ReferenceContactID) {

                                const originalReferenceContact =
                                    originalReferenceContacts.find(
                                        original =>
                                            original.ReferenceContactID ===
                                            referenceContact.ReferenceContactID
                                    );


                                // ==========================================
                                // CHECK IF CHANGED
                                // ==========================================

                                if (
                                    originalReferenceContact &&
                                    (
                                        originalReferenceContact.Name !==
                                            referenceContact.Name ||

                                        originalReferenceContact.Company !==
                                            referenceContact.Company ||

                                        originalReferenceContact.Position !==
                                            referenceContact.Position ||

                                        originalReferenceContact.ContactNumber !==
                                            referenceContact.ContactNumber ||

                                        originalReferenceContact.ContactEmail !==
                                            referenceContact.ContactEmail
                                    )
                                ) {

                                    log(
                                        "UPDATE CHANGED REFERENCE CONTACT:",
                                        referenceContact
                                    );

                                    await updateReferenceContact(
                                        EmployeeID,
                                        referenceContact.ReferenceContactID,
                                        referenceContact
                                    );

                                }

                                else {

                                    log(
                                        "REFERENCE CONTACT UNCHANGED:",
                                        referenceContact.ReferenceContactID
                                    );
                                }
                            }


                            // ==========================================
                            // NEW REFERENCE CONTACT
                            // ==========================================

                            else {

                                log(
                                    "CREATE NEW REFERENCE CONTACT:",
                                    referenceContact
                                );

                                await createReferenceContact(
                                    EmployeeID,
                                    referenceContact
                                );
                            }
                        }


                        // ==========================================
                        // DELETE REMOVED REFERENCE CONTACTS
                        // ==========================================

                        for (
                            const originalReferenceContact
                            of originalReferenceContacts
                        ) {

                            if (
                                !originalReferenceContact.ReferenceContactID
                            ) {
                                continue;
                            }


                            const stillExists =
                                referenceContacts.some(
                                    currentReferenceContact =>
                                        currentReferenceContact.ReferenceContactID ===
                                        originalReferenceContact.ReferenceContactID
                                );


                            if (!stillExists) {

                                log(
                                    "DELETE REFERENCE CONTACT:",
                                    originalReferenceContact
                                );

                                await deleteReferenceContact(
                                    EmployeeID,
                                    originalReferenceContact.ReferenceContactID
                                );
                            }
                        }
                    }


                    // ==========================================
                    // CLOSE MODAL
                    // ==========================================

                    setShowModal(false);
                    setEditingEmployee(undefined);

            } catch (err: any) {

                        console.error("Save employee error:", err);

                        const serverMessage =
                            err.response?.data?.error ||
                            err.response?.data?.message ||
                            err.message ||
                            "";

                        const text =
                            typeof serverMessage === "string"
                                ? serverMessage
                                : "";

                        const newFieldErrors: Partial<
                            Record<keyof Employee, string>
                        > = {};


                        // ==========================================
                        // COMPANY ID
                        // ==========================================

                        if (
                            text.includes("'CompanyID'") &&
                            text.toLowerCase().includes("null")
                        ) {

                            newFieldErrors.CompanyID =
                                ERROR_MESSAGES.companyIdRequired;

                            setModalError(
                                ERROR_MESSAGES.companyIdRequired
                            );
                        }


                        // ==========================================
                        // EMPLOYEE ID
                        // ==========================================

                        else if (
                            text.includes("'EmployeeID'") &&
                            text.toLowerCase().includes("null")
                        ) {

                            newFieldErrors.EmployeeID =
                                ERROR_MESSAGES.employeeIdRequired;

                            setModalError(
                                ERROR_MESSAGES.employeeIdRequired
                            );
                        }


                        // ==========================================
                        // DUPLICATE EMPLOYEE ID
                        // ==========================================

                        else if (
                            text.toLowerCase().includes("EmployeeID") &&
                            text.toLowerCase().includes("duplicate")
                        ) {

                            newFieldErrors.EmployeeID =
                                ERROR_MESSAGES.duplicateEmployeeId;

                            setModalError(
                                ERROR_MESSAGES.duplicateEmployeeId
                            );
                        }


                        // ==========================================
                        // DUPLICATE EMAIL
                        // ==========================================

                        else if (
                            text.toLowerCase().includes("Email") &&
                            text.toLowerCase().includes("duplicate")
                        ) {

                            newFieldErrors.Email =
                                ERROR_MESSAGES.duplicateEmail;

                            setModalError(
                                ERROR_MESSAGES.duplicateEmail
                            );
                        }


                        // ==========================================
                        // UNKNOWN ERROR
                        // ==========================================

                        else {

                            setModalError(
                                ERROR_MESSAGES.saveFailed
                            );
                        }

                        setFieldErrors(newFieldErrors);
            
            } finally {

                setSaving(false);   // 202609 05

            }


    };
    
    // ==========================================
    // SAVE END 
    // ==========================================
           


    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = (employee: Employee) => {

        setDeleteEmployeeTarget(employee);

    };


    // 202609 12
    // ==========================================
    // FILTERED EMPLOYEES FOR REPORT
    // ==========================================
    useEffect(() => {

        setFilteredEmployees(employees);

    }, [employees]);

    return (

        <div className="employee-container">

            {/* 202609 05 */}

            {saving && (
                <div className="saving-overlay">
                    <div className="saving-modal">
                        <div className="hourglass">⌛</div>
                        <div className="saving-text">
                            Saving in progress...
                        </div>
                    </div>
                </div>
            )}

            <div className="employee-title">               
                    <h2>Employee List</h2>

                    {loading && (
                        <span className="employee-loading">
                            Loading employees...
                        </span>
                    )}
            </div>


            {/* ================================
                ADD BUTTON
            ================================= */}

            {!loading && (
                <div
                    className="employee-toolbar"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >

                    <button
                        type="button"
                        className="btn-add-employee"
                        onClick={handleAdd}
                    >
                        + Add
                    </button>


                    <div style={{ marginTop: "19px" }}>
                        <EmployeeReport
                            employees={filteredEmployees}
                        />
                    </div>

                </div>
            )}


         


            {/* ================================
                AG GRID
            ================================= */}

            {loading ? (

                <div></div>

            ) : (

                <EmployeeTable
                    employees={employees}
                    onEdit={handleEdit}
                    onDelete={handleDelete}

                    // 202609 12
                    onFilteredEmployees={setFilteredEmployees}  
                />

            )}


            {/* ================================
                EMPLOYEE FORM MODAL
            ================================= */}

            {showModal && (

                // force the form to remount when Edit changes

                <EmployeeForm
                    key={editingEmployee?.EmployeeID ?? "new"}
                    initialEmployee={editingEmployee}
                    onSave={handleSave}
                    onCancel={handleCloseModal}
                    error={modalError}
                    fieldErrors={fieldErrors}
                    saving={saving}
                />

            )}


            {/* ================================
                    DELETE CONFIRMATION MODAL
                ================================= */}

                {deleteEmployeeTarget && (

                    <div className="delete-modal-overlay">

                        <div className="delete-modal">

                            <h3>Delete Employee</h3>
                            <p className="delete-confirm-message">                             
                                Name: &nbsp;
                                <span className="delete-employee-highlight">
                                    {deleteEmployeeTarget.Name}
                                    {" ("}
                                    {deleteEmployeeTarget.CompanyID}
                                    {")"}
                                </span>
                                  ?
                            </p>


                            <div className="delete-modal-buttons">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteEmployeeTarget(null)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={async () => {

                                        try {

                                            await deleteEmployee(
                                                deleteEmployeeTarget.EmployeeID
                                            );

                                            setDeleteEmployeeTarget(null);

                                        } catch (err: any) {
                                      
                                            console.error(
                                                "Delete employee error:",
                                                err
                                            );


                                            // VER 2

                                             // ==========================================
                                            // LINKED DATA - CANNOT DELETE
                                            // ==========================================

                                            if (err.response?.status === 409) {

                                                const linkedData =
                                                    err.response?.data?.linkedData;

                                                const items: string[] = [];

                                                if (linkedData?.workExperiences) {

                                                    items.push("Work Experiences");

                                                }

                                                if (linkedData?.referenceContacts) {

                                                    items.push("Reference Contacts");

                                                }

                                                setModalError(
                                                    `This record cannot be deleted because it has linked data.\n\n` +
                                                    `Please delete the following items first:\n` +
                                                    items.map(item => `• ${item}`).join("\n")
                                                );


                                                return;
                                            }


                                            // ==========================================
                                            // OTHER DELETE ERROR
                                            // ==========================================

                                            setDeleteEmployeeTarget(null);

                                            setModalError(
                                                "Unable to delete employee. Please try again."
                                            );

                                           
                                        }

                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* ================================
                    DELETE ERROR MODAL
                ================================= */}

                {modalError && deleteEmployeeTarget && (

                    <div className="delete-modal-overlay">

                        <div className="delete-modal">

                            <h3>💡 Cannot Delete Employee</h3>

                            <div className="delete-error-message">

                                <div>
                                    Name :{" "}
                                    <span className="delete-employee-blue">
                                        {deleteEmployeeTarget.Name}
                                        {" ("}
                                        {deleteEmployeeTarget.CompanyID}
                                        {")"}
                                    </span>
                                </div>

                                <br />

                                {modalError.split("\n").map(
                                    (line, index) => (
                                        <div key={index}>
                                            {line || "\u00A0"}
                                        </div>
                                    )
                                )}

                            </div>

                            <div className="delete-modal-buttons">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalError(null);
                                        setDeleteEmployeeTarget(null);
                                    }}
                                >
                                    OK
                                </button>

                            </div>

                        </div>

                    </div>

                )}
        </div>

    );
}


export default Employee;