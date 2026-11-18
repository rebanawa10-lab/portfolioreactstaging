


// file:        employeeKPIDashboardRpt.tsx

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type {
    EmployeeKPIYearToYear,
} from "./employeeKPIYearToYearTypes";

import type {
    EmployeeInvoice
} from "../employee/employeeInvoiceTypes";

import PrintIcon from "@mui/icons-material/Print";


interface EmployeeKPIReportProps {

    kpiData: EmployeeKPIYearToYear[];

    invoices: EmployeeInvoice[];

    selectedEmployee: string;

    selectedYear: number | "ALL";
}


const EmployeeKPIReport = ({
    kpiData,
    invoices,
    selectedEmployee,
    selectedYear,
}: EmployeeKPIReportProps) => {


    const generateReport = () => {

        const doc = new jsPDF("landscape", "mm", "a4");


        // =====================================================
        // FILTER KPI DATA
        // =====================================================

        const filteredKPI = kpiData.filter((item) => {

            const employeeMatch =
                selectedEmployee === "ALL" ||
                item.employeeid === selectedEmployee;

            const yearMatch =
                selectedYear === "ALL" ||
                item.invyear === selectedYear;

            return employeeMatch && yearMatch;
        });


        // =====================================================
        // FILTER INVOICES
        // =====================================================

        const filteredInvoices = invoices.filter((invoice) => {

            const employeeMatch =
                selectedEmployee === "ALL" ||
                invoice.employeeid === selectedEmployee;

            if (!employeeMatch) {
                return false;
            }

            if (selectedYear === "ALL") {
                return true;
            }

            if (!invoice.invdate) {
                return false;
            }

            const invoiceYear =
                new Date(invoice.invdate).getFullYear();

            return invoiceYear === selectedYear;
        });


        // =====================================================
        // TITLE
        // =====================================================

        doc.setFontSize(18);

        doc.text(
            "Employee KPI Report",
            14,
            15
        );


        // =====================================================
        // FILTER INFORMATION
        // =====================================================

        doc.setFontSize(10);

        // ==========================================
        // EMPLOYEE
        // ==========================================

        const selectedEmployeeName =
            selectedEmployee === "ALL"
                ? "All Employees"
                : kpiData.find(
                    employee =>
                        employee.employeeid === selectedEmployee
                )?.name ?? selectedEmployee;

        // Label
        doc.setFont("helvetica", "normal");

        doc.text(
            "Employee",
            14,
            23
        );

        doc.text(":", 32, 23);

        // Value
        doc.setFont("helvetica", "bold");

        doc.text(
            selectedEmployeeName,
            35,
            23
        );


        // ==========================================
        // YEAR
        // ==========================================

        const selectedYearText =
            selectedYear === "ALL"
                ? "All Years"
                : String(selectedYear);

        // Label
        doc.setFont("helvetica", "normal");

        doc.text(
            "Year",
            14,
            29
        );

        doc.text(":", 32, 29);

        // Value
        doc.setFont("helvetica", "bold");

        doc.text(
            selectedYearText,
            35,
            29
        );


        // =====================================================
        // KPI SUMMARY
        // =====================================================

        let yPosition = 38;


        if (filteredKPI.length > 0) {

            autoTable(doc, {

                startY: yPosition,

                head: [[
                    "Employee",
                    "Year",
                    "Year Target",
                    "Invoice Total",
                    "Achievement"
                ]],

                body: filteredKPI.map((item) => {

                    const target =
                        Number(item.yeartarget) || 0;

                    const invoiceTotal =
                        Number(item.invtotal) || 0;

                    const achievement =
                        target > 0
                            ? (invoiceTotal / target) * 100
                            : 0;


                    return [
                        item.name,
                        item.invyear,
                        target.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        ),
                        invoiceTotal.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        ),
                        `${achievement.toFixed(2)}%`
                    ];
                }),

                theme: "grid",

                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },

                headStyles: {
                    fontStyle: "bold"
                },

                // =====================================================
                // ALIGNMENT
                // =====================================================


                columnStyles: {
                    0: {
                        cellWidth: 75,
                        halign: "left"
                    },
                    1: {
                        cellWidth: 25,
                        halign: "right"
                    },
                    2: {
                        cellWidth: 35,
                        halign: "right"
                    },
                    3: {
                        cellWidth: 35,
                        halign: "right"
                    },
                    4: {
                        cellWidth: 35,
                        halign: "right"
                    }
                },



                 didParseCell: (data) => {

                    // Employee column = left
                    if (data.column.index === 0) {
                        data.cell.styles.halign = "left";
                    }

                    // Year, Year Target, Invoice Total,
                    // Achievement = right
                    else {
                        data.cell.styles.halign = "right";
                    }
                }



            });
        }

        // =====================================================
        // GET KPI TABLE FINAL Y POSITION
        // =====================================================

        const finalY =
            (doc as any).lastAutoTable?.finalY ?? 45;
                
        // =====================================================
        // TOP 3 CLIENTS
        // =====================================================

        const clientTotals: Record<string, number> = {};

        filteredInvoices.forEach((invoice) => {

            const client =
                invoice.client?.trim() || "Unknown";

            const amount =
                Number(invoice.localvalue) || 0;

            clientTotals[client] =
                (clientTotals[client] || 0) + amount;
        });


        const top3Clients =
            Object.entries(clientTotals)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);


                
        // =====================================================
        // TOP 3 CLIENTS TABLE
        // =====================================================

        let top3FinalY = finalY;

        if (top3Clients.length > 0) {

            const top3HeadingY = finalY + 12;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);

            doc.text(
                "Top 3 Clients",
                14,
                top3HeadingY
            );


            autoTable(doc, {

                startY: top3HeadingY + 5,

                head: [[
                    "Client",
                    "Invoice Total"
                ]],

                body: top3Clients.map(
                    ([client, total]) => [
                        client,
                        total.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                    ]
                ),

                theme: "grid",

                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },

                headStyles: {
                    fontStyle: "bold"
                },

                columnStyles: {
                    0: {
                        cellWidth: 120
                    },
                    1: {
                        cellWidth: 35,
                        halign: "right"
                    }
                },

                didParseCell: (data) => {

                    // Employee column = left
                    if (data.column.index === 0) {
                        data.cell.styles.halign = "left";
                    }

                  
                    // Invoice Total = right
                    else {
                        data.cell.styles.halign = "right";
                    }
                }



            });


            // IMPORTANT:
            // Get the actual bottom of the Top 3 table

            top3FinalY =
                (doc as any).lastAutoTable?.finalY ??
                top3HeadingY + 20;
        }

                
        // =====================================================
        // INVOICE TOTAL
        // =====================================================

        const invoiceGrandTotal =
            filteredInvoices.reduce(
                (total, invoice) =>
                    total +
                    (Number(invoice.localvalue) || 0),
                0
            );

                    
        // =====================================================
        // INVOICES HEADER
        // =====================================================

        // Put Invoices BELOW the Top 3 table

        const invoiceHeaderY =
            top3FinalY + 10;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);

        doc.text(
            `Invoices (${filteredInvoices.length}) — Total: ${invoiceGrandTotal.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`,
            14,
            invoiceHeaderY
        );


        // =====================================================
        // INVOICE TABLE
        // =====================================================

        autoTable(doc, {
       
            startY: invoiceHeaderY + 6,
            // startY: top3FinalY + 6,

            head: [[
                "Invoice Date",
                "Invoice No",
                "Client",
                "Invoice Total"
            ]],

            body: filteredInvoices.map((invoice) => {

                const invoiceDate =
                    invoice.invdate
                        ? new Date(invoice.invdate)
                            .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            })
                        : "";

                return [
                    invoiceDate,
                    invoice.invno ?? "",
                    invoice.client ?? "",
                    (Number(invoice.localvalue) || 0)
                        .toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                ];
            }),

            theme: "grid",

            styles: {
                fontSize: 9,
                cellPadding: 3
            },

            headStyles: {
                fontStyle: "bold"
            },

            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 40 },
                2: { cellWidth: 120 },
                3: {
                    cellWidth: 35,
                    halign: "right"
                }
            },

            didParseCell: (data) => {

                    // Employee column = left
                   if (
                        data.column.index === 0 ||
                        data.column.index === 1 ||
                        data.column.index === 2
                    )  {
                        data.cell.styles.halign = "left";
                    }

                 
                    // Invoice Total = right
                    else {
                        data.cell.styles.halign = "right";
                    }
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

            doc.text(
                `Employee KPI Report - Page ${page} of ${pageCount}`,
                14,
                200
            );
        }


        // =====================================================
        // SAVE PDF
        // =====================================================

        doc.save(
            `EmployeeKPIReport_${
                selectedEmployee === "ALL"
                    ? "AllEmployees"
                    : selectedEmployee
            }_${
                selectedYear === "ALL"
                    ? "AllYears"
                    : selectedYear
            }.pdf`
        );
    };


    return (

        <button
            type="button"
            onClick={generateReport}
            style={{
                backgroundColor: "#7B1FA2",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                height: "50px",
                fontSize: 15,
                fontWeight: "normal",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
            }}
        >
            <PrintIcon
                sx={{                 
                    color: "white"
                }}
            />

            Generate KPI Report
        </button>

    );
};


export default EmployeeKPIReport;

