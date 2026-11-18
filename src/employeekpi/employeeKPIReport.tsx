


// file:   employeeKPIReport.tsx

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EmployeeKPIReport = () => {

    const generatePDF = () => {

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Employee KPI Report", 14, 20);

        autoTable(doc, {
            startY: 30,

            head: [[
                "Employee",
                "Year Target",
                "Invoice Total",
                "Achievement"
            ]],

            body: [
                ["John Smith", "400,000", "385,000", "96.25%"],
                ["Mary Wong", "500,000", "475,000", "95.00%"]
            ]
        });

        doc.save("EmployeeKPIReport.pdf");
    };

    return (
        <button onClick={generatePDF}>
            Export PDF
        </button>
    );
};

export default EmployeeKPIReport;