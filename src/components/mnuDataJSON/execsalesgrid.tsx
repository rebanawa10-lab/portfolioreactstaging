// file:   src/components/mnuDataJSON/execsalesgrid.tsx 

// Fetches data
// Owns rows
// Renders DataGrid
// Passes rows to Print component
// Customize Pagination

import { useEffect, useState } from "react";  
import type { GridColDef } from "@mui/x-data-grid"; 
import { Box, } from "@mui/material";  //  Pagination
import PrintData from "./execsalesgridprint";
import { DataGrid, useGridApiRef, gridFilteredSortedRowIdsSelector } from "@mui/x-data-grid";


import {
  useGridApiContext,
  useGridSelector,
  gridPaginationModelSelector,
  gridPageCountSelector,
  gridPageSizeSelector,
} from "@mui/x-data-grid";
import { Pagination, IconButton, Select, MenuItem   } from "@mui/material";  //  Pagination
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

import { getSalesman } from "../../api/salesPrintListAPI";

import TooltipWrapper from "../../components/customTooltipWrapper"; //  "../components/customTooltipWrapper";    

export type User = {
    userid: number;
    username: string;
    country: string;
    countrydesc: string;
    hired: string;   // JSON date should be string, not Date
    active:  number;
    sales: number;
};

export default function UserGrid() {
  const [rows, setRows] = useState<User[]>([]);

  const apiRef = useGridApiRef();
  const [filteredRows, setFilteredRows] = useState<User[]>([]);

      useEffect(() => {
        getSalesman()
            .then((data) => {
            setRows(data);
            setFilteredRows(data);
            })
            .catch((err) => console.error("API error:", err));
    }, []);

   
  const columns: GridColDef<User>[] = [
    { field: "userid", headerName: "User ID", width: 120 },
    { field: "username", headerName: "User Name", width: 250 },
    { field: "country", headerName: "Country", width: 70 },
    { field: "countrydesc", headerName: "Country Desc", width: 200 },
    { field: "hired",
                headerName: "Hired",
                width: 120,
                valueFormatter: (value) => {
                    if (!value) return "";
                    const date = new Date(value as string);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0"); // months 0-11
                    const day = String(date.getDate()).padStart(2, "0");
                    return `${year}-${month}-${day}`;
                },
    },
    { field: "active",
                headerName: "Active",
                width: 100,
                valueFormatter: (value) =>
                    value === 1 ? "Yes" : "No",
    },
    { field: "sales",
                headerName: "Sales",
                width: 130,
                type: "number",         
                valueFormatter: (value) =>
                    value != null ? Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "",
    },
  ];

 
function CustomPagination() {
    const apiRef = useGridApiContext();

    const paginationModel = useGridSelector(
        apiRef,
        gridPaginationModelSelector
    );

    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const pageSize = useGridSelector(apiRef, gridPageSizeSelector);

    return (

        <Box
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            px: 2,
            fontFamily: "Arial",
            fontSize: "12px"
        }}
        >
            {/* Rows per page selector */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Rows per page:
                <Select
                size="small"
                value={pageSize}
                onChange={(e) =>
                    apiRef.current.setPageSize(Number(e.target.value))
                }

                // Font. dropdown value START
                sx={{
                    fontFamily: "Arial",
                    fontSize: "12px",

                    "& .MuiSelect-select": {
                    fontFamily: "Arial",
                    fontSize: "12px",
                    paddingTop: "4px",
                    paddingBottom: "4px",
                    },

                    "& .MuiSvgIcon-root": {
                    fontSize: "16px",   // dropdown arrow size
                    }
                }}

                MenuProps={{
                    PaperProps: {
                    sx: {
                        fontFamily: "Arial",
                        fontSize: "12px",
                    },
                    },
                }}
                // Font. dropdown value END

                >
                {[5, 10, 25, 50, 100].map((size) => (
                    <MenuItem key={size} value={size}

                    // Font. dropdown list START
                    sx={{
                        fontFamily: "Arial",
                        fontSize: "12px"
                    }}
                    // Font. dropdown list END
                    >
                    {size}
                    </MenuItem>
                ))}
                </Select>
            </Box>

            {/* Pagination controls */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",   
                    gap: 1,
                    fontFamily: "Arial",
                    fontSize: "12px",
                    // width: "100%",            
                }}
            >
                {/* << Start */}
                    <IconButton
                        onClick={() => apiRef.current.setPage(0)}
                        disabled={paginationModel.page === 0}
                        sx={{
                        fontFamily: "Arial",
                        fontSize: "12px",
                        padding: "4px"
                        }}
                    >
                        <FirstPageIcon />
                    </IconButton>

                {/* Page Numbers */}
                {/* Prefix with _, _event This tells TypeScript “I intentionally don’t use this parameter”: */}
                    <Pagination
                        color="primary"
                        count={pageCount}
                        page={paginationModel.page + 1}
                        onChange={(_event, value) =>    
                        apiRef.current.setPage(value - 1)
                        }

                        sx={{
                        "& .MuiPaginationItem-root": {
                            fontFamily: "Arial",
                            fontSize: "12px",
                            minWidth: "28px",
                            height: "28px"
                        }
                        }}

                    />

                {/* End >> */}
                    <IconButton
                        onClick={() => apiRef.current.setPage(pageCount - 1)}
                        disabled={paginationModel.page === pageCount - 1}
                    >
                        <LastPageIcon />
                    </IconButton>
            </Box>

        </Box>
    );

}


  return (
    <div>
        <div>
            <h2>Print Data List</h2>    

            <TooltipWrapper
                title={
                <>                  
                    - This module print/export the data to PDF.<br />                   
                    - Click the Row header to sort or filter the data.<br />             
                </>
                }
                maxWidth={500}
            >
                <span className="my-cell">
                &nbsp;&nbsp;&nbsp;*&nbsp;&nbsp; Overview
                </span>
            </TooltipWrapper>

            <br></br><br></br>  

             
            <PrintData rows={filteredRows} />       
        </div>

        {/* <Box  sx={{ height: 450, width: "1050px" ,}} className="printable"> */}
        {/* DataGrid */}
        <Box sx={{ width: "1050px" }}>

            <DataGrid
                apiRef={apiRef}
                rows={rows}
                columns={columns}
                getRowId={(row) => row.userid}   // 🔥 VERY IMPORTANT
                // Track filter/sort changes
                onFilterModelChange={() => {
                    setTimeout(() => {
                        const filteredIds = gridFilteredSortedRowIdsSelector(apiRef);

                        const filtered = filteredIds.map(
                            (id) => rows.find((r) => r.userid === id)!
                        );

                        setFilteredRows(filtered);
                    },0 );      // ensures Grid finishes updating, Then we read the correct filtered rows
                }}
                onSortModelChange={() => {
                    setTimeout(() => {
                        const filteredIds = gridFilteredSortedRowIdsSelector(apiRef);
                        const filtered = filteredIds.map((id) => rows.find((r) => r.userid === id)!);
                        setFilteredRows(filtered);
                    }, 0);
                }}

                pageSizeOptions={[5, 10, 25, 50, 100]}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                    },
                }}

                columnHeaderHeight={35}   // 🔥 header height
                rowHeight={30}            // 🔥 data row height

                sx={{
                    fontFamily: "Arial",
                    fontSize: "12px",       // rows font size
                }}
                pagination
                autoHeight

                slots={{
                    pagination: CustomPagination,
                }}
                                   
            />
        
        </Box>
    </div>
  );
}

