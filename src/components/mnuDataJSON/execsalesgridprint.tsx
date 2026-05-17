// file: execsalesgridprint.tsx

// ONLY prints
// Receives rows as prop
// No fetch
// No DataGrid
// No duplicate state

import { renderToString } from "react-dom/server";
import PrintTable from "./execsalesgridtable";
import type { User } from "./execsalesgrid";


import PrintIcon from "@mui/icons-material/Print";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";


type Props = {
  rows: User[];
};

export default function ExecSalesPrintTrigger({ rows }: Props) {
  
  const handlePrint = () => {
    if (rows.length === 0) return;

    // Render PrintTable to HTML string
    const htmlContent = renderToString(<PrintTable rows={rows} />);

    // Open print window
    const printWindow = window.open("", "", "width=900,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Executive sales report</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: Arial; font-size: 12px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr { page-break-inside: avoid; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div>
      <Tooltip title="Print">
        <span>
          <IconButton
            onClick={handlePrint}
            disabled={rows.length === 0}
            sx={{
              color: "#fff",
              backgroundColor: "#1976d2",
              borderRadius: "4px",
              height: "30px",
              width: "30px",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            <PrintIcon />
          </IconButton>
        </span>
      </Tooltip>
      <br></br><br></br>

      {/* <button
        onClick={handlePrint}
        disabled={rows.length === 0}
        style={{ marginBottom: "10px", padding: "6px 12px", 
                backgroundColor: "#1976d2",   // blue
                color: "#ffffff",             // white text
                border: "none",
                borderRadius: "4px",
                height: "25px", 
                fontFamily: "Arial",
                fontSize: "14px",
                cursor: rows.length === 0 ? "not-allowed" : "pointer",

                display: "inline-flex",
                alignItems: "center",   // vertically centers text
                justifyContent: "center", // horizontally centers text

                boxShadow: "0 2px 6px rgba(0,0,0,0.5)"             
         }}
      >
        Print
      </button> */}
 
    </div>
  );
}
