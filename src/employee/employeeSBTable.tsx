


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeSBTable.tsx

import { useMemo } from "react";

import { AgGridReact } from "ag-grid-react";

import {
    ModuleRegistry,
    AllCommunityModule,
    type ColDef
} from "ag-grid-community";


import type { employee } from "./employeeSBTypes";

ModuleRegistry.registerModules([AllCommunityModule]);

import { formatDate } from "../utils/gFunc";


interface EmployeeTableProps {
    employees: employee[];
    onEdit: (employee: employee) => void;
    onDelete: (employee: employee) => void;

    onFilteredRowsChange: (
        employees: employee[]
    ) => void;
}

export default function EmployeeTable({
    employees,
    onEdit,
    onDelete,
    onFilteredRowsChange
}: EmployeeTableProps) {

    const handleFilterChanged = (event: any) => {

        const filteredRows: employee[] = [];

        event.api.forEachNodeAfterFilterAndSort(
            (node: any) => {

                if (node.data) {
                    filteredRows.push(node.data);
                }

            }
        );

        onFilteredRowsChange(filteredRows);
    };

    const columnDefs = useMemo<ColDef<employee>[]>(() => [
        {
            field: "name",
            headerName: "Name",
            sortable: true,
            filter: true,
            width: 350,
            minWidth: 200
        },
        {
            field: "companyid",
            headerName: "Company ID",
            sortable: true,
            filter: true,
            width: 170,
            minWidth: 150,
        },
        {
            field: "email",
            headerName: "Email",
            sortable: true,
            filter: true,
            width: 300,
            minWidth: 250,
        },
        {
            field: "handphone",
            headerName: "Contact number",
            sortable: true,
            filter: true,
            width: 190,
            minWidth: 150,
            
        },      
        {
            field: "startdate",
            headerName: "Start Date",
            sortable: true,
            filter: "agDateColumnFilter",
            valueFormatter: (params) => formatDate(params.value),
            width: 170,
            minWidth: 120,
        },
        {
            field: "enddate",
            headerName: "End Date",
            sortable: true,
            filter: "agDateColumnFilter",
            valueFormatter: (params) => formatDate(params.value),
            width: 170,
            minWidth: 120,
        },
        {
            field: "status",
            headerName: "Status",
            sortable: true,
            filter: true,
            width: 170,
            minWidth: 170,
        },
        {
            headerName: "Actions",
            sortable: false,
            filter: false,
            cellRenderer: (params: any) => (
                <div>
                    <button
                        type="button"
                        onClick={() => onEdit(params.data)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"

                        onClick={() =>
                            onDelete(params.data)                        
                        }
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ], [onEdit, onDelete]);

    return (
        <div
            className="ag-theme-alpine"
            style={{
                width: "100%",
                height: "760px"
            }}
        >

            <AgGridReact<employee>
                
                rowData={employees}
                columnDefs={columnDefs}

                pagination={true}
                paginationPageSize={15}
                paginationPageSizeSelector={[10, 15, 20, 50, 100]}
                   
                defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true
                }}

                onFilterChanged={handleFilterChanged}

            />

        </div>
    );
}






