


// file:   employeeRpt.tsx

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Employee } from "./employeeTypes";

import PrintIcon from "@mui/icons-material/Print";


interface EmployeeReportProps {

    employees: Employee[];

}


const EmployeeReport = ({
    employees
}: EmployeeReportProps) => {


    // =====================================================
    // GENERATE EMPLOYEE REPORT
    // =====================================================

    const generateReport = () => {

        const doc =
            new jsPDF("landscape", "mm", "a4");


        // =====================================================
        // TITLE
        // =====================================================

        doc.setFontSize(18);

        doc.setFont("helvetica", "bold");

        doc.text(
            "Employee Report",
            14,
            15
        );


        // =====================================================
        // REPORT INFORMATION
        // =====================================================

        doc.setFontSize(10);

        doc.setFont("helvetica", "normal");

        doc.text(
            `Total Employees: ${employees.length}`,
            14,
            23
        );


        // =====================================================
        // EMPLOYEE TABLE
        // =====================================================

        autoTable(doc, {

            startY: 30,

            head: [[
                // "Employee ID",
                "Name",
                "Company ID",
                "Email",
                "Contact number",            
                "Start Date",
                "End Date",
                "Status"
            ]],

            body: employees.map((employee) => {

                const startDate =
                    employee.StartDate
                        ? new Date(employee.StartDate)
                            .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            })
                        : "";


                const endDate =
                    employee.EndDate
                        ? new Date(employee.EndDate)
                            .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            })
                        : "";


                return [

                    // employee.EmployeeID ?? "",

                    employee.Name ?? "",

                    employee.CompanyID ?? "",

                    employee.Email ?? "",

                    employee.HandPhone ?? "",

                    
                    startDate,

                    endDate,

                    employee.Status ?? ""

                ];

            }),


            theme: "grid",


            styles: {

                fontSize: 8,

                cellPadding: 3

            },


            headStyles: {

                fontStyle: "bold"

            },


            columnStyles: {

                0: {
                    cellWidth: 65,
                    halign: "left"
                },

                // CompanyID
                1: {
                    cellWidth: 35,
                    halign: "left"
                },

                2: {
                    cellWidth: 45,
                    halign: "left"
                },

                3: {
                    cellWidth: 30,
                    halign: "left"
                },

                4: {
                    cellWidth: 25,
                    halign: "left"
                },

                5: {
                    cellWidth: 25,
                    halign: "left"
                },

                6: {
                    cellWidth: 25,
                    halign: "left"
                },

                7: {
                    cellWidth: 25,
                    halign: "left"
                }

            },


            didParseCell: (data) => {

                data.cell.styles.halign = "left";

            }

        });


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

            doc.setFont("helvetica", "normal");

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
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
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


export default EmployeeReport;

