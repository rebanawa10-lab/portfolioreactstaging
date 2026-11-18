


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeTable.tsx


import { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";

import {
    ModuleRegistry,
    AllCommunityModule,
    type ColDef
} from "ag-grid-community";


import type { Employee } from "./employeeTypes";

ModuleRegistry.registerModules([AllCommunityModule]);

import { formatDate } from "../utils/gFunc";


interface EmployeeTableProps {
    employees: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
    onFilteredEmployees: (employees: Employee[]) => void;
}

export default function EmployeeTable({
    employees,
    onEdit,
    onDelete,
    onFilteredEmployees
}: EmployeeTableProps) {

    const handleFilterChanged = useCallback(
        (params: any) => {

            const filteredRows: Employee[] = [];

            params.api.forEachNodeAfterFilterAndSort((node: any) => {

                if (node.data) {
                    filteredRows.push(node.data);
                }

            });

            onFilteredEmployees(filteredRows);

        },
        [onFilteredEmployees]
    );


    const columnDefs = useMemo<ColDef<Employee>[]>(() => [
        {
            field: "Name",
            headerName: "Name",
            sortable: true,
            filter: true,
            width: 300
        },
        {
            field: "CompanyID",
            headerName: "Company ID",
            sortable: true,
            filter: true
        },
        {
            field: "Email",
            headerName: "Email",
            sortable: true,
            filter: true,
            width: 250
        },
        {
            field: "HandPhone",
            headerName: "Contact number",
            sortable: true,
            filter: true
            
        },      
        {
            field: "StartDate",
            headerName: "Start Date",
            sortable: true,
            filter: "agDateColumnFilter",
            valueFormatter: (params) => formatDate(params.value)
        },
        {
            field: "EndDate",
            headerName: "End Date",
            sortable: true,
            filter: "agDateColumnFilter",
            valueFormatter: (params) => formatDate(params.value)
        },
        {
            field: "Status",
            headerName: "Status",
            sortable: true,
            filter: true
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
                            // onDelete(params.data.EmployeeID)

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

            <AgGridReact<Employee>
                
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






