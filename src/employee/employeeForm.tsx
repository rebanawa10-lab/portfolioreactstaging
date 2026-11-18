


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeForm.tsx

import { useForm, useFieldArray } from "react-hook-form";
import type { Employee } from "./employeeTypes";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { log } from "../config/debug" ;

interface EmployeeFormProps {
    initialEmployee?: Employee;
    onSave: (employee: Employee) => void | Promise<void>;
    onCancel: () => void;
    error?: string | null;
    fieldErrors?: Partial<Record<keyof Employee, string>>;
    saving: boolean;    // 202609 05 
}

function EmployeeForm({
    initialEmployee,
    onSave,
    onCancel,
    error,
    fieldErrors,
    saving  // 202609 05 
}: EmployeeFormProps) {

    // =========================
    // REACT HOOK FORM
    // =========================

    const {
        register,
        handleSubmit,
        control
    } = useForm<Employee>({
        values: initialEmployee
            ? {
                EmployeeID: initialEmployee.EmployeeID ?? "",
                Name: initialEmployee.Name ?? "",
                Email: initialEmployee.Email ?? "",
                HandPhone: initialEmployee.HandPhone ?? "",
                CompanyID: initialEmployee.CompanyID ?? "",

                StartDate: initialEmployee.StartDate
                    ? initialEmployee.StartDate.substring(0, 10)
                    : null,

                EndDate: initialEmployee.EndDate
                    ? initialEmployee.EndDate.substring(0, 10)
                    : null,

                Status: initialEmployee.Status ?? "",

                WorkExperiences:
                    initialEmployee.WorkExperiences ?? [],

                ReferenceContacts:
                    initialEmployee.ReferenceContacts ?? []
            }
            : {
                EmployeeID: "",
                Name: "",
                Email: "",
                HandPhone: "",
                CompanyID: "",
                StartDate: null,
                EndDate: null,
                Status: "",
                WorkExperiences: [],
                ReferenceContacts: []
            }
    });

    // =========================
    // WORK EXPERIENCE ARRAY
    // =========================
    const {
        fields: workExperienceFields,
        append: appendWorkExperience,
        remove: removeWorkExperience
    } = useFieldArray({
        control,
        name: "WorkExperiences"
    });


    // =========================
    // REFERENCE CONTACT ARRAY
    // =========================
    const {
        fields: referenceContactFields,
        append: appendReferenceContact,
        remove: removeReferenceContact
    } = useFieldArray({
        control,
        name: "ReferenceContacts"
    });

    // =========================
    // DEBUG
    // =========================

    log("Employee:", initialEmployee);

    log(
        "WorkExperiences:",
        initialEmployee?.WorkExperiences
    );

    // =========================
    // SUBMIT
    // =========================

    const onSubmit = (data: Employee) => {


        log("========== ADD/EDIT SUBMIT ==========");
        log("FULL DATA:", data);
        log("WORK EXPERIENCES:", data.WorkExperiences);
        log("REFERENCE CONTACTS:", data.ReferenceContacts);
        
        onSave(data);
    };

    return (
        <Dialog
            open={true}
            onClose={onCancel}
            fullWidth
            maxWidth="md"
        >

            {/* 202609 05  */}
            {saving && (
                <Box
                    sx={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 2,
                            padding: 4,
                            textAlign: "center",
                            boxShadow: 6
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 50,
                                animation: "hourglass 1.2s linear infinite",
                                "@keyframes hourglass": {
                                    "0%": {
                                        transform: "rotate(0deg)"
                                    },
                                    "100%": {
                                        transform: "rotate(360deg)"
                                    }
                                }
                            }}
                        >
                            ⌛
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            Saving in progress...
                        </Typography>
                    </Box>
                </Box>
            )}



            {/* =========================
                HEADER
            ========================= */}

            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0"
                }}
            >

                {initialEmployee
                        ? "Edit Employee"
                        : "Add Employee"}

                <Button
                    onClick={onCancel}
                    sx={{
                        minWidth: "auto",
                        fontSize: "24px",
                        color: "text.secondary"
                    }}
                >
                    ×
                </Button>

            </DialogTitle>


            {/* =========================
                FORM
            ========================= */}

            <form onSubmit={handleSubmit(onSubmit)}>

                <DialogContent>

                    {/* =========================
                        PERSONAL
                    ========================= */}

                    <Accordion defaultExpanded>

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                Personal
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>

                            <Grid
                                container
                                spacing={2}
                            >

                                {/* NAME */}

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <TextField
                                        fullWidth
                                        label="Name"
                                        {...register("Name")}
                                        error={!!fieldErrors?.Name}
                                        helperText={
                                            fieldErrors?.Name
                                        }
                                    />

                                </Grid>


                                {/* COMPANY ID */}

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <TextField
                                        fullWidth
                                        label="Company ID"
                                        {...register("CompanyID")}
                                        disabled={!!initialEmployee}
                                        error={!!fieldErrors?.CompanyID}
                                        helperText={
                                            fieldErrors?.CompanyID
                                        }
                                         sx={{
                                            "& .MuiInputBase-input": {
                                                color: "#1976d2",
                                                fontWeight: 700
                                            },

                                            "& .MuiInputBase-input.Mui-disabled": {
                                                color: "#1976d2",
                                                WebkitTextFillColor: "#1976d2",
                                                fontWeight: 700,
                                                opacity: 1
                                            }
                                        }}
                                    />

                                </Grid>


                                {/* EMAIL */}

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email"
                                        {...register("Email")}
                                        error={!!fieldErrors?.Email}
                                        helperText={
                                            fieldErrors?.Email
                                        }
                                    />

                                </Grid>


                                {/* HAND PHONE */}

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <TextField
                                        fullWidth
                                        label="Contact number"
                                        {...register("HandPhone")}
                                    />

                                </Grid>

                            </Grid>

                        </AccordionDetails>

                    </Accordion>


                    {/* =========================
                        EMPLOYMENT
                    ========================= */}

                    <Accordion defaultExpanded>

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                Employment
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>

                            <Grid
                                container
                                spacing={2}
                            >

                                {/* START DATE */}

                                <Grid size={{ xs: 12, sm: 4 }}>

                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Start Date"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true
                                            }
                                        }}
                                        {...register("StartDate")}
                                    />

                                </Grid>


                                {/* END DATE */}

                                {initialEmployee && (

                                    <Grid size={{ xs: 12, sm: 4 }}>

                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="End Date"
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: true
                                                }
                                            }}
                                            {...register("EndDate")}
                                        />

                                    </Grid>

                                )}


                                {/* STATUS */}

                                <Grid size={{ xs: 12, sm: 4 }}>

                                    <TextField
                                        fullWidth
                                        select
                                        label="Status"
                                        defaultValue={
                                            initialEmployee?.Status ?? ""
                                        }
                                        {...register("Status")}
                                    >

                                        <MenuItem value="">
                                            &nbsp;
                                        </MenuItem>

                                        <MenuItem value="Active">
                                            Active
                                        </MenuItem>

                                        <MenuItem value="Resign">
                                            Resign
                                        </MenuItem>

                                        <MenuItem value="Incoming">
                                            Incoming
                                        </MenuItem>

                                    </TextField>

                                </Grid>

                            </Grid>

                        </AccordionDetails>

                    </Accordion>


                    {/* =========================
                        WORK EXPERIENCE
                    ========================= */}

                    <Accordion>

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >

                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                Work Experience
                            </Typography>

                        </AccordionSummary>


                        <AccordionDetails>

                            {/* EXISTING RECORDS */}

                            {workExperienceFields.map((field, index) => (

                                <Box
                                    key={field.id}
                                    sx={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2
                                    }}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2
                                        }}
                                    >

                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                        >
                                            Work Experience {index + 1}
                                        </Typography>


                                        <Button
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                removeWorkExperience(index)
                                            }
                                        >
                                            Delete
                                        </Button>

                                    </Box>


                                    <Grid
                                        container
                                        spacing={2}
                                    >

                                        {/* COMPANY */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Company"
                                                {...register(
                                                    `WorkExperiences.${index}.Company`
                                                )}
                                            />

                                        </Grid>


                                        {/* DESIGNATION */}
                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Designation"
                                                {...register(
                                                    `WorkExperiences.${index}.Designation`
                                                )}
                                            />

                                        </Grid>


                                        {/* DURATION FROM */}
                                        <Grid size={{ xs: 12, sm: 4 }}>

                                            <TextField
                                                fullWidth
                                                label="From: YYYY-MM"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 10,
                                                    },
                                                }}
                                                {...register(
                                                    `WorkExperiences.${index}.DurationFrom`
                                                )}
                                            />                                          
                                        </Grid>


                                        {/* DURATION TO */}
                                        <Grid size={{ xs: 12, sm: 4 }}>

                                            <TextField
                                                fullWidth
                                                label="To: YYYY-MM"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 10,
                                                    },
                                                }}
                                                {...register(
                                                    `WorkExperiences.${index}.DurationTo`
                                                )}
                                            />                                        
                                        </Grid>


                                        {/* LAST GROSS SALARY */}
                                        <Grid size={{ xs: 12, sm: 4 }}>

                                            <TextField
                                                fullWidth
                                                label="Last Gross Salary"
                                                {...register(
                                                    `WorkExperiences.${index}.LastGrossSalary`
                                                )}
                                            />

                                        </Grid>


                                        {/* REASON FOR LEAVING */}
                                        <Grid size={{ xs: 12 }}>

                                            <TextField
                                                fullWidth
                                                label="Reason For Leaving"
                                                multiline
                                                rows={2}
                                                {...register(
                                                    `WorkExperiences.${index}.ReasonForLeaving`
                                                )}
                                            />

                                        </Grid>

                                    </Grid>

                                </Box>

                            ))}


                            {/* NO RECORDS */}

                            {workExperienceFields.length === 0 && (

                                <Typography
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    No work experience records.
                                </Typography>

                            )}


                            {/* ADD */}

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    appendWorkExperience({
                                        WorkExperienceID: undefined,
                                        EmployeeID: initialEmployee?.EmployeeID,
                                        DurationFrom: "",
                                        DurationTo: "",
                                        Company: "",
                                        Designation: "",
                                        LastGrossSalary: "",
                                        ReasonForLeaving: ""
                                    })
                                }
                            >
                                + Add Work Experience
                            </Button>

                        </AccordionDetails>

                    </Accordion>




                    {/* =========================
                        REFERENCE CONTACTS
                    ========================= */}

                    <Accordion>

                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >

                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                Reference Contacts
                            </Typography>

                        </AccordionSummary>


                        <AccordionDetails>

                            {/* =========================
                                EXISTING CONTACTS
                            ========================= */}

                            {referenceContactFields.map((field, index) => (

                                <Box
                                    key={field.id}
                                    sx={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2
                                    }}
                                >

                                    {/* HEADER */}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2
                                        }}
                                    >

                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                        >
                                            Reference Contact {index + 1}
                                        </Typography>


                                        <Button
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                removeReferenceContact(index)
                                            }
                                        >
                                            Delete
                                        </Button>

                                    </Box>


                                    {/* FIELDS */}

                                    <Grid
                                        container
                                        spacing={2}
                                    >

                                        {/* NAME */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Name"
                                                {...register(
                                                    `ReferenceContacts.${index}.Name`
                                                )}
                                            />

                                        </Grid>


                                        {/* COMPANY */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Company"
                                                {...register(
                                                    `ReferenceContacts.${index}.Company`
                                                )}
                                            />

                                        </Grid>


                                        {/* POSITION */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Position"
                                                {...register(
                                                    `ReferenceContacts.${index}.Position`
                                                )}
                                            />

                                        </Grid>


                                        {/* CONTACT NUMBER */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Contact Number"
                                                {...register(
                                                    `ReferenceContacts.${index}.ContactNumber`
                                                )}
                                            />

                                        </Grid>


                                        {/* EMAIL */}

                                        <Grid size={{ xs: 12 }}>

                                            <TextField
                                                fullWidth
                                                type="email"
                                                label="Contact Email"
                                                {...register(
                                                    `ReferenceContacts.${index}.ContactEmail`
                                                )}
                                            />

                                        </Grid>

                                    </Grid>

                                </Box>

                            ))}


                            {/* =========================
                                NO CONTACTS
                            ========================= */}

                            {referenceContactFields.length === 0 && (

                                <Typography
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    No reference contacts.
                                </Typography>

                            )}


                            {/* =========================
                                ADD CONTACT
                            ========================= */}

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    appendReferenceContact({
                                        ReferenceContactID: undefined,
                                        EmployeeID: initialEmployee?.EmployeeID,

                                        Name: "",
                                        Company: "",
                                        Position: "",
                                        ContactNumber: "",
                                        ContactEmail: ""
                                    })
                                }
                            >
                                + Add Reference Contact
                            </Button>

                        </AccordionDetails>

                    </Accordion>


                    {/* =========================
                        ERROR
                    ========================= */}

                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mt: 2,
                                display: "none"
                             }}
                        >
                            {error}
                        </Alert>

                    )}

                </DialogContent>


                {/* =========================
                    FOOTER
                ========================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: "1px solid #e0e0e0"
                    }}
                >

                    <Button
                        type="button"
                        variant="outlined"
                        onClick={onCancel}
                         // 202609 05 
                        disabled={saving}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        // 202609 05 
                        disabled={saving}   
                    >
                        Save
                    </Button>

                </DialogActions>

            </form>

        </Dialog>
    );
}

export default EmployeeForm;
