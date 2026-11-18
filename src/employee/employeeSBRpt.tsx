



// file: employeeSBRpt.tsx

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { employee } from "./employeeSBTypes";

import PrintIcon from "@mui/icons-material/Print";


interface EmployeeReportProps {

    employees: employee[];

}


const EmployeeSBReport = ({
    employees
}: EmployeeReportProps) => {


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (
        value?: string | Date | null
    ) => {

        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // GENERATE EMPLOYEE REPORT
    // =====================================================

    const generateReport = () => {

        const doc =
            new jsPDF(
                "landscape",
                "mm",
                "a4"
            );


        // =====================================================
        // TITLE
        // =====================================================

        doc.setFontSize(18);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Employee Report",
            14,
            15
        );


        // =====================================================
        // REPORT INFORMATION
        // =====================================================

        doc.setFontSize(10);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            `Total Employees: ${employees.length}`,
            14,
            23
        );


        // =====================================================
        // EMPLOYEE TABLE
        // =====================================================

        autoTable(
            doc,
            {

                startY: 30,

                head: [[
                    "Name",
                    "Company ID",
                    "Email",
                    "Contact number",
                    "Start Date",
                    "End Date",
                    "Status"
                ]],


                body: employees.map(
                    (employee) => {

                        return [

                            employee.name ?? "",

                            employee.companyid ?? "",

                            employee.email ?? "",

                            employee.handphone ?? "",

                            formatDate(
                                employee.startdate
                            ),

                            formatDate(
                                employee.enddate
                            ),

                            employee.status ?? ""

                        ];

                    }
                ),


                theme: "grid",


                styles: {

                    fontSize: 8,

                    cellPadding: 3

                },


                headStyles: {

                    fontStyle: "bold"

                },


                columnStyles: {

                    // Name
                    0: {
                        cellWidth: 65,
                        halign: "left"
                    },

                    // Company ID
                    1: {
                        cellWidth: 35,
                        halign: "left"
                    },

                    // Email
                    2: {
                        cellWidth: 45,
                        halign: "left"
                    },

                    // Contact
                    3: {
                        cellWidth: 30,
                        halign: "left"
                    },

                    // Start Date
                    4: {
                        cellWidth: 25,
                        halign: "left"
                    },

                    // End Date
                    5: {
                        cellWidth: 25,
                        halign: "left"
                    },

                    // Status
                    6: {
                        cellWidth: 25,
                        halign: "left"
                    }

                },


                didParseCell: (data) => {

                    data.cell.styles.halign =
                        "left";

                }

            }
        );


        // =====================================================
        // FOOTER
        // =====================================================

        const pageCount =
            doc.getNumberOfPages();


        for (
            let page = 1;
            page <= pageCount;
            page++
        ) {

            doc.setPage(page);

            doc.setFontSize(8);

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.text(
                `Employee Report - Page ${page} of ${pageCount}`,
                14,
                200
            );

        }


        // =====================================================
        // SAVE PDF
        // =====================================================

        doc.save(
            "EmployeeReport.pdf"
        );

    };


    // =====================================================
    // BUTTON
    // =====================================================

    return (

        <button
            type="button"
            onClick={generateReport}
            title="Print Employee Report"
            style={{
                backgroundColor: "#7B1FA2",
                color: "white",
                border: "none",
                padding: "3px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                height: "35px",
                fontSize: 15,
                fontWeight: "normal",
                fontFamily: "Arial",
                boxShadow:
                    "0 3px 6px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                justifyContent: "center"
            }}
        >

            <PrintIcon
                sx={{
                    color: "white"
                }}
            />

            Generate Report

        </button>

    );

};


export default EmployeeSBReport;