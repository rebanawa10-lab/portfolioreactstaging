


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeSBForm.tsx

import { useForm, useFieldArray } from "react-hook-form";
import type { employee } from "./employeeSBTypes";

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
    initialEmployee?: employee;
    onSave: (employee: employee) => void | Promise<void>;
    onCancel: () => void;
    error?: string | null;
    fieldErrors?: Partial<Record<keyof employee, string>>;
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
    } = useForm<employee>({
        values: initialEmployee
            ? {
                employeeid: initialEmployee.employeeid ?? "",
                name: initialEmployee.name ?? "",
                email: initialEmployee.email ?? "",
                handphone: initialEmployee.handphone ?? "",
                companyid: initialEmployee.companyid ?? "",

                startdate: initialEmployee.startdate
                    ? initialEmployee.startdate.substring(0, 10)
                    : null,

                enddate: initialEmployee.enddate
                    ? initialEmployee.enddate.substring(0, 10)
                    : null,

                status: initialEmployee.status ?? "",

                workexperiences:
                    initialEmployee.workexperiences ?? [],

                referencecontacts:
                    initialEmployee.referencecontacts ?? []
            }
            : {
                employeeid: "",
                name: "",
                email: "",
                handphone: "",
                companyid: "",
                startdate: null,
                enddate: null,
                status: "",
                workexperiences: [],
                referencecontacts: []
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
        name: "workexperiences"
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
        name: "referencecontacts"
    });

    // =========================
    // DEBUG
    // =========================

    log("Employee:", initialEmployee);

    log(
        "workexperiences:",
        initialEmployee?.workexperiences
    );

    // =========================
    // SUBMIT
    // =========================

    const onSubmit = (data: employee) => {


        log("========== ADD/EDIT SUBMIT ==========");
        log("FULL DATA:", data);
        log("WORK EXPERIENCES:", data.workexperiences);
        log("REFERENCE CONTACTS:", data.referencecontacts);
        
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
                                        slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                        }}
                                        {...register("name")}
                                        error={!!fieldErrors?.name}
                                        helperText={
                                            fieldErrors?.name
                                        }
                                    />

                                </Grid>


                                {/* COMPANY ID */}

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <TextField
                                        fullWidth
                                        label="Company ID"
                                        slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                        }}
                                        {...register("companyid")}
                                        disabled={!!initialEmployee}
                                        error={!!fieldErrors?.companyid}
                                        helperText={
                                            fieldErrors?.companyid
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
                                        slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                        }}
                                        {...register("email")}
                                        error={!!fieldErrors?.email}
                                        helperText={
                                            fieldErrors?.email
                                        }
                                    />

                                </Grid>


                                {/* HAND PHONE */}

                                <Grid size={{ xs: 12, sm: 6 }}>

                                    <TextField
                                        fullWidth
                                        label="Contact number"
                                        slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                        }}
                                        {...register("handphone")}
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
                                        {...register("startdate")}
                                    />

                                </Grid>


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
                                            {...register("enddate")}
                                        />

                                    </Grid>

                                )}


                                {/* status */}

                                <Grid size={{ xs: 12, sm: 4 }}>

                                    <TextField
                                        fullWidth
                                        select
                                        label="Status"
                                        defaultValue={
                                            initialEmployee?.status ?? ""
                                        }
                                        {...register("status")}
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
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                                }}
                                                {...register(
                                                    `workexperiences.${index}.company`
                                                )}
                                            />

                                        </Grid>


                                        {/* DESIGNATION */}
                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Designation"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 100,
                                                    },
                                                }}
                                                {...register(
                                                    `workexperiences.${index}.designation`
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
                                                    `workexperiences.${index}.durationfrom`
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
                                                    `workexperiences.${index}.durationto`
                                                )}
                                            />                                        
                                        </Grid>


                                        {/* LAST GROSS SALARY */}
                                        <Grid size={{ xs: 12, sm: 4 }}>

                                            <TextField
                                                fullWidth
                                                label="Last Gross Salary"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 100,
                                                    },
                                                }}
                                                {...register(
                                                    `workexperiences.${index}.lastgrosssalary`
                                                )}
                                            />

                                        </Grid>


                                        {/* REASON FOR LEAVING */}
                                        <Grid size={{ xs: 12 }}>

                                            <TextField
                                                fullWidth
                                                label="Reason For Leaving"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                                }}
                                                multiline
                                                rows={2}
                                                {...register(
                                                    `workexperiences.${index}.reasonforleaving`
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
                                        workexperienceid: undefined,
                                        employeeid: initialEmployee?.employeeid,
                                        durationfrom: "",
                                        durationto: "",
                                        company: "",
                                        designation: "",
                                        lastgrosssalary: "",
                                        reasonforleaving: ""
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
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                                }}

                                                {...register(
                                                    `referencecontacts.${index}.name`
                                                )}
                                            />

                                        </Grid>


                                        {/* COMPANY */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Company"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 200,
                                                    },
                                                }}
                                                {...register(
                                                    `referencecontacts.${index}.company`
                                                )}
                                            />

                                        </Grid>


                                        {/* POSITION */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Position"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 100,
                                                    },
                                                }}
                                                {...register(
                                                    `referencecontacts.${index}.position`
                                                )}
                                            />

                                        </Grid>


                                        {/* CONTACT NUMBER */}

                                        <Grid size={{ xs: 12, sm: 6 }}>

                                            <TextField
                                                fullWidth
                                                label="Contact Number"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 100,
                                                    },
                                                }}
                                                {...register(
                                                    `referencecontacts.${index}.contactnumber`
                                                )}
                                            />

                                        </Grid>


                                        {/* EMAIL */}

                                        <Grid size={{ xs: 12 }}>

                                            <TextField
                                                fullWidth
                                                type="email"
                                                slotProps={{
                                                    htmlInput: {
                                                        maxLength: 100,
                                                    },
                                                }}
                                                label="Contact Email"
                                                {...register(
                                                    `referencecontacts.${index}.contactemail`
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
                                        referencecontactid: undefined,
                                        employeeid: initialEmployee?.employeeid,

                                        name: "",
                                        company: "",
                                        position: "",
                                        contactnumber: "",
                                        contactemail: ""
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
                         // 202609 05 
                        disabled={saving}
                        onClick={onCancel}
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
