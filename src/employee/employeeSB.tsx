


// file:    C:\Repos\PortfolioStaging\React\src\employee\EmployeeSB.tsx

import { useEffect, useState } from "react";

import EmployeeForm from "./employeeSBForm";

import EmployeeTable from "./employeeSBTable";

import type { employee } from "./employeeSBTypes";

import { useEmployee } from "./employeeSBHook";

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

} from "./employeeSBAPIservice";


import "./employee.css";


import { normalizeDate } from "../utils/gFunc";


import { log } from "../config/debug" ;


import EmployeeSBReport from "./employeeSBRpt";


const API_BASE = import.meta.env.VITE_NODEJS_API_CLOUD;

// const SSE_BASE = import.meta.env.VITE_NODEJS_API_SSE;




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
        deleteEmployee,
        loadEmployees
    } = useEmployee();

    const [filteredEmployees, setFilteredEmployees] =
    useState<employee[]>([]);

    const [showModal, setShowModal] =
        useState(false);

     // 202609 05 
    const [saving, setSaving] =
    useState(false);

    const [editingEmployee, setEditingEmployee] =
        useState<employee | undefined>(undefined);

    const [modalError, setModalError] =
        useState<string | null>(null);

    const [fieldErrors, setFieldErrors] =
    useState<Partial<Record<keyof employee, string>>>({});

    const [deleteEmployeeTarget, setDeleteEmployeeTarget] =
    useState<employee | null>(null);



    // ==========================================
    // REALTIME NOTIFICATIONS
    // ==========================================

    interface EmployeeNotification {
        id: number;
        event: string;
        employee?: employee;
        timestamp: string;
    }

    const [notifications, setNotifications] =
        useState<EmployeeNotification[]>([]);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [originalEmployee, setOriginalEmployee] =
    useState<employee | undefined>(undefined);

    const [originalWorkExperiences, setOriginalWorkExperiences] =
    useState<employee["workexperiences"]>([]);


    const [originalReferenceContacts, setOriginalReferenceContacts] =
    useState<employee["referencecontacts"]>([]);



    // ==========================================
    // REALTIME NOTIFICATIONS
    // REDIS PUB/SUB → SSE
    // ==========================================


    // ==========================================
    // EMPLOYEE SSE
    // ==========================================

    useEffect(() => {

                const sseUrl =
                    `${API_BASE}/api/employee/events`;

                log("=================================");
                log("🔥 SSE EFFECT STARTED");
                log("🔥 SSE URL:", sseUrl);

            
                // EventSource connects to the SSE endpoint
                const eventSource =
                    new EventSource(sseUrl);

                log(
                    "🔥 EventSource CREATED:",
                    eventSource
                );

                log(
                    "🔥 Initial readyState:",
                    eventSource.readyState
                );

                // ==========================================
                // CONNECTION OPEN
                // ==========================================

                eventSource.onopen = () => {

                    log(
                        "🔥🔥🔥 EMPLOYEE SSE CONNECTED 🔥🔥🔥"
                    );

                    log(
                        "🔥 readyState:",
                        eventSource.readyState
                    );

                };


                // ==========================================
                // INITIAL CONNECTED EVENT
                // ==========================================

                eventSource.addEventListener(
                    "connected",
                    (event) => {


                        log(
                            "🔥🔥🔥 CONNECTED EVENT RECEIVED 🔥🔥🔥"
                        );

                        log(
                            "CONNECTED EVENT:",
                            event
                        );

                        log(
                            "CONNECTED DATA:",
                            event.data
                        );

                    }
                );


                // ==========================================
                // EMPLOYEE EVENTS
                // ==========================================

                const handleEmployeeEvent =
                    (event: MessageEvent) => {

                        log(
                            "🔔🔔🔔 EMPLOYEE SSE EVENT RECEIVED 🔔🔔🔔"
                        );

                        log(
                            "EVENT TYPE:",
                            event.type
                        );

                        log(
                            "EVENT DATA:",
                            event.data
                        );

                    try {

                        const data = JSON.parse(event.data);

                            log(
                                "🔔 PARSED EMPLOYEE EVENT:",
                                data
                            );


                        setNotifications(
                                previous => [
                                    ...previous,
                                    {
                                        id: Date.now(),
                                        event: data.event,
                                        employee: data.employee,
                                        timestamp:
                                            data.timestamp
                                    }
                                ]
                            );

                            loadEmployees();

                    } catch (err) {

                        console.error(
                            "❌ Failed to process employee SSE event:",
                            err
                        );

                    }
                };


                // ==========================================
                // REGISTER EVENTS
                // ==========================================

                eventSource.addEventListener(
                    "EMPLOYEE_CREATED",
                    handleEmployeeEvent
                );


                eventSource.addEventListener(
                    "EMPLOYEE_UPDATED",
                    handleEmployeeEvent
                );


                eventSource.addEventListener(
                    "EMPLOYEE_DELETED",
                    handleEmployeeEvent
                );


                // =====================================================
                // DEFAULT SSE MESSAGE
                // =====================================================

                eventSource.onmessage = (event) => {

                    log(
                        "🔥 DEFAULT SSE MESSAGE:",
                        event
                    );

                    log(
                        "🔥 DEFAULT SSE DATA:",
                        event.data
                    );

                };


                // ==========================================
                // SSE ERROR
                // ==========================================

                eventSource.onerror = (error) => {

                    console.error(
                        "🔥🔥🔥 EMPLOYEE SSE ERROR 🔥🔥🔥",
                        error
                    );

                    console.error(
                        "SSE readyState:",
                        eventSource.readyState
                    );

                };


                // ==========================================
                // CLEANUP
                // ==========================================

                return () => {

                    log(
                        "🔥 Closing Employee SSE connection"
                    );

                    eventSource.close();

                };


    }, [loadEmployees]);

    // SSE END *****


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

    const handleEdit = async (employee: employee) => {
    
        log("EDIT EMPLOYEE:", employee);

        try {

            setModalError(null);
            setFieldErrors({});

            // ==========================================
            // GET EMPLOYEE MASTER
            // ==========================================

            // Retrieve full employee including child records
            const fullEmployee = await getEmployee(
                employee.employeeid
            );


            // ==========================================
            // GET WORK EXPERIENCES
            // ==========================================
            const workexperiences =
                await getWorkExperiences(
                    employee.employeeid
                );

            // ==========================================
            // GET REFERENCE CONTACT 
            // ==========================================
            const referencecontacts =
                await getReferenceContacts(
                    employee.employeeid
                );


            // ==========================================
            // COMBINE EMPLOYEE + WORK EXPERIENCE + REFERENCE CONTACT 
            // ==========================================
            const employeeWithDetails: employee = {
                ...fullEmployee,
                workexperiences: workexperiences,
                referencecontacts: referencecontacts
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
                employeeWithDetails.workexperiences
            );
            
            setOriginalEmployee(fullEmployee);

            setOriginalWorkExperiences(workexperiences);

            setOriginalReferenceContacts(referencecontacts);

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

    const handleSave = async (employee: employee) => {

            // ==========================================
            // ADD OR EDIT
            // ==========================================

            const isEdit = !!employee.employeeid;

            const newFieldErrors: Partial<
                Record<keyof employee, string>
            > = {};

            // ==========================================
            // REQUIRED FIELD VALIDATION
            // ==========================================

            if (!employee.companyid?.trim()) {

                newFieldErrors.companyid =
                    ERROR_MESSAGES.companyIdRequired;
            }

            if (!employee.name?.trim()) {

                newFieldErrors.name =
                    ERROR_MESSAGES.nameRequired;
            }


            // ==========================================
            // DUPLICATE COMPANY ID
            // ==========================================

            const duplicateCompany = employees.some(existingEmployee =>

                existingEmployee.companyid?.trim().toLowerCase() ===
                employee.companyid?.trim().toLowerCase()

                &&
                existingEmployee.employeeid !== employee.employeeid
            );

            if (
                employee.companyid?.trim() &&
                duplicateCompany
            ) {

                newFieldErrors.companyid =
                    ERROR_MESSAGES.duplicateCompanyId;
            }


            // ==========================================
            // STOP SAVE IF VALIDATION FAILED
            // ==========================================

            if (Object.keys(newFieldErrors).length > 0) {

                setFieldErrors(newFieldErrors);

                // Show first validation error in footer
                setModalError(
                    newFieldErrors.companyid ||
                    newFieldErrors.name ||
                    null
                );

                return;
            }

            setSaving(true);        // 202609 05
            // await new Promise(resolve => setTimeout(resolve, 2000));    // 202609 05


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
                    employee.companyid
                );



                // SAVE VER 2 Start

                // ==========================================
                // EMPLOYEE ID
                // ==========================================

                let employeeid: string;


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

                    employeeid =
                        savedEmployee.employeeid ||
                        employee.employeeid;


                    if (!employeeid) {

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

                    employeeid =
                        employee.employeeid;


                    // ==========================================
                    // CHECK IF EMPLOYEE MASTER CHANGED
                    // ==========================================

                    const nameChanged =
                        String(originalEmployee?.name ?? "") !==
                        String(employee.name ?? "");

                    const emailChanged =
                        String(originalEmployee?.email ?? "") !==
                        String(employee.email ?? "");

                    const handPhoneChanged =
                        String(originalEmployee?.handphone ?? "") !==
                        String(employee.handphone ?? "");

                    const companyIDChanged =
                        String(originalEmployee?.companyid ?? "") !==
                        String(employee.companyid ?? "");

                    const startDateChanged =
                        normalizeDate(originalEmployee?.startdate) !==
                        normalizeDate(employee.startdate);

                    const endDateChanged =
                        normalizeDate(originalEmployee?.enddate) !==
                        normalizeDate(employee.enddate);

                    const statusChanged =
                        String(originalEmployee?.status ?? "") !==
                        String(employee.status ?? "");


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
                            log("employeeid:", employeeid);
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
                    employee.workexperiences ?? [];

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
                                employeeid,
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

                            if (workExperience.workexperienceid) {

                                const originalWorkExperience =
                                    originalWorkExperiences.find(
                                        original =>
                                            original.workexperienceid ===
                                            workExperience.workexperienceid
                                    );


                                // ==========================================
                                // CHECK IF CHANGED
                                // ==========================================

                                if (
                                    originalWorkExperience &&
                                    (
                                        originalWorkExperience.durationfrom !==
                                            workExperience.durationfrom ||

                                        originalWorkExperience.durationto !==
                                            workExperience.durationto ||

                                        originalWorkExperience.company !==
                                            workExperience.company ||

                                        originalWorkExperience.designation !==
                                            workExperience.designation ||

                                        originalWorkExperience.lastgrosssalary !==
                                            workExperience.lastgrosssalary ||

                                        originalWorkExperience.reasonforleaving !==
                                            workExperience.reasonforleaving
                                    )
                                ) {

                                    log(
                                        "UPDATE CHANGED WORK EXPERIENCE:",
                                        workExperience
                                    );

                                    await updateWorkExperience(
                                        employeeid,
                                        workExperience.workexperienceid,
                                        workExperience
                                    );

                                } else {

                                    log(
                                        "WORK EXPERIENCE UNCHANGED:",
                                        workExperience.workexperienceid
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
                                    employeeid,
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

                            if (!originalWorkExperience.workexperienceid) {
                                continue;
                            }

                            const stillExists =
                                workExperiences.some(
                                    currentWorkExperience =>
                                        currentWorkExperience.workexperienceid ===
                                        originalWorkExperience.workexperienceid
                                );

                            if (!stillExists) {

                                log(
                                    "DELETE WORK EXPERIENCE:",
                                    originalWorkExperience
                                );

                                await deleteWorkExperience(
                                    employeeid,
                                    originalWorkExperience.workexperienceid
                                );
                            }
                        }
                    }



                    // ==========================================
                    // SAVE REFERENCE CONTACTS
                    // ==========================================

                    const referenceContacts =
                        employee.referencecontacts ?? [];


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
                                employeeid,
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

                            if (referenceContact.referencecontactid) {

                                const originalReferenceContact =
                                    originalReferenceContacts.find(
                                        original =>
                                            original.referencecontactid ===
                                            referenceContact.referencecontactid
                                    );


                                // ==========================================
                                // CHECK IF CHANGED
                                // ==========================================

                                if (
                                    originalReferenceContact &&
                                    (
                                        originalReferenceContact.name !==
                                            referenceContact.name ||

                                        originalReferenceContact.company !==
                                            referenceContact.company ||

                                        originalReferenceContact.position !==
                                            referenceContact.position ||

                                        originalReferenceContact.contactnumber !==
                                            referenceContact.contactnumber ||

                                        originalReferenceContact.contactemail !==
                                            referenceContact.contactemail
                                    )
                                ) {

                                    log(
                                        "UPDATE CHANGED REFERENCE CONTACT:",
                                        referenceContact
                                    );

                                    await updateReferenceContact(
                                        employeeid,
                                        referenceContact.referencecontactid,
                                        referenceContact
                                    );

                                }

                                else {

                                    log(
                                        "REFERENCE CONTACT UNCHANGED:",
                                        referenceContact.referencecontactid
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
                                    employeeid,
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
                                !originalReferenceContact.referencecontactid
                            ) {
                                continue;
                            }


                            const stillExists =
                                referenceContacts.some(
                                    currentReferenceContact =>
                                        currentReferenceContact.referencecontactid ===
                                        originalReferenceContact.referencecontactid
                                );


                            if (!stillExists) {

                                log(
                                    "DELETE REFERENCE CONTACT:",
                                    originalReferenceContact
                                );

                                await deleteReferenceContact(
                                    employeeid,
                                    originalReferenceContact.referencecontactid
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
                            Record<keyof employee, string>
                        > = {};


                        // ==========================================
                        // COMPANY ID
                        // ==========================================

                        if (
                            text.includes("'companyid'") &&
                            text.toLowerCase().includes("null")
                        ) {

                            newFieldErrors.companyid =
                                ERROR_MESSAGES.companyIdRequired;

                            setModalError(
                                ERROR_MESSAGES.companyIdRequired
                            );
                        }


                        // ==========================================
                        // EMPLOYEE ID
                        // ==========================================

                        else if (
                            text.includes("'employeeid'") &&
                            text.toLowerCase().includes("null")
                        ) {

                            newFieldErrors.employeeid =
                                ERROR_MESSAGES.employeeIdRequired;

                            setModalError(
                                ERROR_MESSAGES.employeeIdRequired
                            );
                        }


                        // ==========================================
                        // DUPLICATE EMPLOYEE ID
                        // ==========================================

                        else if (
                            text.toLowerCase().includes("employeeid") &&
                            text.toLowerCase().includes("duplicate")
                        ) {

                            newFieldErrors.employeeid =
                                ERROR_MESSAGES.duplicateEmployeeId;

                            setModalError(
                                ERROR_MESSAGES.duplicateEmployeeId
                            );
                        }


                        // ==========================================
                        // DUPLICATE EMAIL
                        // ==========================================

                        else if (
                            text.toLowerCase().includes("email") &&
                            text.toLowerCase().includes("duplicate")
                        ) {

                            newFieldErrors.email =
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

    const handleDelete = (employee: employee) => {

        setDeleteEmployeeTarget(employee);

    };


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
                        gap: "8px"
                    }}
                >

                    {/* ==========================================
                        REALTIME NOTIFICATION BELL
                        BELL START
                    ========================================== */}

                    <div
                        className="employee-notification-container"
                        style={{
                            position: "relative"
                        }}
                    >

                        <button
                            type="button"
                            className="employee-notification-button"
                            onClick={() =>
                                setShowNotifications(
                                    previous => !previous
                                )
                            }
                        >

                            🔔

                            {notifications.length > 0 && (

                                <span className="employee-notification-badge">
                                    {notifications.length}
                                </span>

                            )}

                        </button>


                        {showNotifications && (

                            <div className="employee-notification-panel">

                                <div className="employee-notification-header">

                                    <strong>
                                        Employee Changes
                                    </strong>

                                    {notifications.length > 0 && (

                                        <button
                                            type="button"
                                            onClick={() => {

                                                setNotifications([]);

                                                setShowNotifications(false);

                                            }}
                                        >
                                            Clear
                                        </button>

                                    )}

                                </div>


                                {notifications.length === 0 ? (

                                    <div className="employee-notification-empty">

                                        No new notifications.

                                    </div>

                                ) : (

                                    notifications
                                        .slice()
                                        .reverse()
                                        .map(notification => (

                                            <div
                                                key={notification.id}
                                                className="employee-notification-item"
                                            >

                                                <strong>

                                                    {notification.event ===
                                                        "EMPLOYEE_CREATED"
                                                        ? "Employee Created"
                                                        : notification.event ===
                                                            "EMPLOYEE_UPDATED"
                                                            ? "Employee Updated"
                                                            : "Employee Deleted"
                                                    }

                                                </strong>


                                                {notification.employee && (

                                                    <div>

                                                        {notification.employee.name}

                                                        {" ("}

                                                        {notification.employee.companyid}

                                                        {")"}

                                                    </div>

                                                )}


                                                <small>

                                                    {new Date(
                                                        notification.timestamp
                                                    ).toLocaleTimeString()}

                                                </small>

                                            </div>

                                        ))

                                )}

                            </div>

                        )}

                    </div>

                    {/* BELL END */}

                    <button
                        type="button"
                        className="btn-add-employee"
                        onClick={handleAdd}
                    >
                        + Add
                    </button>


                    <div style={{ marginTop: "19px" }}>
                        <EmployeeSBReport
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
                    onFilteredRowsChange={setFilteredEmployees}
                />

            )}


            {/* ================================
                EMPLOYEE FORM MODAL
            ================================= */}

            {showModal && (

                // force the form to remount when Edit changes

                <EmployeeForm
                    key={editingEmployee?.employeeid ?? "new"}
                    initialEmployee={editingEmployee}
                    onSave={handleSave}
                    onCancel={handleCloseModal}
                    error={modalError}
                    fieldErrors={fieldErrors}
                    // 202609 05
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
                                    {deleteEmployeeTarget.name}
                                    {" ("}
                                    {deleteEmployeeTarget.companyid}
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
                                                deleteEmployeeTarget.employeeid
                                            );

                                            setDeleteEmployeeTarget(null);

                                        } catch (err: any) {
                                      
                                            console.error(
                                                "Delete employee error:",
                                                err
                                            );


                                             // ==========================================
                                            // LINKED DATA - CANNOT DELETE
                                            // ==========================================

                                            if (err.response?.status === 409) {

                                                const linkedData =
                                                    err.response?.data?.linkedData;

                                                const items: string[] = [];

                                                if (linkedData?.workExperiences === true) {

                                                    items.push("Work Experiences");

                                                }

                                                if (linkedData?.referenceContacts === true) {

                                                    items.push("Reference Contacts");

                                                }

                                                
                                                if (items.length > 0) {

                                                    setModalError(
                                                        `This record cannot be deleted because it has linked data.\n\n` +
                                                        `Please delete the following items first:\n` +
                                                        items.map(item => `• ${item}`).join("\n")
                                                    );

                                                } else {

                                                    setModalError(
                                                        "This employee cannot be deleted because it has linked data..." 
                                                    );

                                                }

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
                                        {deleteEmployeeTarget.name}
                                        {" ("}
                                        {deleteEmployeeTarget.companyid}
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