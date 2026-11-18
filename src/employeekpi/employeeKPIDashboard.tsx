

//              202609 09 Modal, show message: Data loading on initial load.

// file:        employeeKPIDashboard.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Modal, // 202609 09 
} from "@mui/material";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import type { ChartOptions } from "chart.js";

import { Bar } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels";


import {
    getEmployeeKPIYearToYear,
    getKPIEmployees
} from "./employeeKPIAPIservice";

import type {
    EmployeeKPIYearToYear,
    KPIEmployee
} from "./employeeKPIYearToYearTypes";



import {
    DataGrid,
    type GridColDef
} from "@mui/x-data-grid";


import {
    getEmployeeInvoices
} from "../employee/employeeInvoiceAPIservice";


import type {
    EmployeeInvoice
} from "../employee/employeeInvoiceTypes";


import EmployeeKPIReport from "./employeeKPIDashboardRpt";

import { log } from "../config/debug" ;

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const EmployeeKPIDashboard: React.FC = () => {

    const [data, setData] = useState<EmployeeKPIYearToYear[]>([]);
    
    const [loading, setLoading] = useState(true);

    const [employees, setEmployees] = useState<KPIEmployee[]>([]);
   
    const [employeesLoading, setEmployeesLoading] = useState(true);

    const [allInvoices, setAllInvoices] =
    useState<EmployeeInvoice[]>([]);

    const [invoices, setInvoices] =
        useState<EmployeeInvoice[]>([]);

    // 202609 09 
    const [invoiceLoading, setInvoiceLoading] =
        useState(true);
        
    // 202609 09 
    const [initialLoading, setInitialLoading] = 
        useState(true);

    // 202609 09 
    const pageLoading =
        initialLoading ||
        loading ||
        employeesLoading ||
        invoiceLoading;
 
    const totalInvoiceValue = invoices.reduce(
    (sum, invoice) =>
        sum + Number(invoice.localvalue || 0),
        0
    );

    const [selectedEmployee, setSelectedEmployee] =
        useState<string>("ALL");

    const [selectedYear, setSelectedYear] =
        useState<number | "ALL">("ALL");


        
    // 202609 09 
    // ==========================================
    // TEST INITIAL LOADING DELAY
    // ==========================================
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 1000);   // 2000
        return () => clearTimeout(timer);
    }, []);



    useEffect(() => {

        const loadEmployees = async () => {

            try {

                setEmployeesLoading(true);

                const result =
                    await getKPIEmployees();

                log(
                    "KPI Employees:",
                    result
                );

                setEmployees(result);

            } catch (error) {

                console.error(
                    "Error loading KPI employees:",
                    error
                );

            } finally {

                setEmployeesLoading(false);
            }
        };

        loadEmployees();

    }, []);


    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                const result =
                    await getEmployeeKPIYearToYear();

                log(
                    "KPI DATA:",
                    result
                );

                setData(result);

            } catch (error) {

                console.error(
                    "Error loading KPI data:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, []);


    useEffect(() => {

            const loadInvoices = async () => {

            try {

                
                setInvoiceLoading(true);    

                // Load ALL employees + ALL years
                const result = await getEmployeeInvoices();

                log("ALL INVOICE DATA:", result);

                setAllInvoices(result);

                // Initially show ALL invoices
                setInvoices(result);
            

            } catch (error) {

                console.error(
                    "Error loading invoices:",
                    error
                );

            
                setAllInvoices([]);
                setInvoices([]);

            } finally {

                setInvoiceLoading(false);
            }
        };

        loadInvoices();

    }, []);


    useEffect(() => {
        const filteredInvoices =
            allInvoices.filter(invoice => {

                const employeeMatch =
                    selectedEmployee === "ALL" ||
                    invoice.employeeid === selectedEmployee;

                const yearMatch =
                    selectedYear === "ALL" ||
                    (
                        invoice.invdate !== null &&
                        new Date(invoice.invdate).getFullYear() === selectedYear
                    );

                return employeeMatch && yearMatch;
            });

        setInvoices(filteredInvoices);

    }, [
        allInvoices,
        selectedEmployee,
        selectedYear
    ]);



    // ----------------------------------------
    // Years
    // ----------------------------------------

    const years = useMemo(() => {

        return Array.from(
            new Set(data.map(item => item.invyear))
        ).sort();

    }, [data]);


    // ----------------------------------------
    // Filter
    // ----------------------------------------

    const filteredData = useMemo(() => {

        return data.filter(item => {

            const employeeMatch =
                selectedEmployee === "ALL" ||
                item.employeeid === selectedEmployee;

            const yearMatch =
                selectedYear === "ALL" ||
                item.invyear === selectedYear;

            return employeeMatch && yearMatch;

        });

    }, [
        data,
        selectedEmployee,
        selectedYear
    ]);


    // ----------------------------------------
    // Chart, Name (Year )
    // ----------------------------------------
  
    const chartData = useMemo(() => {

        const labels = filteredData.map(
        item => [
        item.name,
        "(" + item.invyear + ")"
        ]
        );

        return {

            labels,

            datasets: [

                // LEFT AXIS
                {
                    label: "YearTarget",

                    data: filteredData.map(
                        item => item.yeartarget
                    ),

                    borderWidth: 1,

                    yAxisID: "y",
                },

                // RIGHT AXIS
                {
                    label: "Invoices Total",

                    data: filteredData.map(
                        item => item.invtotal
                    ),

                    borderWidth: 1,

                    yAxisID: "y1",
                },

            ],

        };

    }, [filteredData]);



    // ----------------------------------------
    // Chart options , xxx
    // ----------------------------------------

    // ver2 
    const chartOptions: ChartOptions<"bar"> = {

        responsive: true,
        maintainAspectRatio: false,

        layout: {
            padding: {
                bottom: 3
            }
        },

        plugins: {

            datalabels: {
                anchor: "end",
                align: "start",
                offset: 5,

                font: {
                    size: 12,
                    family: "Arial"
                },

                formatter: (value, context) => {

                    const invoiceTotal = Number(value) || 0;

                    // Year Target dataset
                    const target =
                        Number(
                            context.chart.data.datasets[0].data[
                                context.dataIndex
                            ]
                        ) || 0;

                    // Format Invoice Total
                    let invoiceText;

                    if (invoiceTotal >= 1000000) {
                        invoiceText =
                            `${(invoiceTotal / 1000000).toFixed(1)}M`;
                    } else if (invoiceTotal >= 1000) {
                        invoiceText =
                            `${Math.floor(invoiceTotal / 1000)}K`;
                    } else {
                        invoiceText = `${invoiceTotal}`;
                    }

                    // Calculate achievement
                    const achievement =
                        target > 0
                            ? (invoiceTotal / target) * 100
                            : 0;

                
                    if (context.dataset.label === "Invoices Total") {
                        return [
                            invoiceText,
                            " ",
                            `${achievement.toFixed(0)}%`
                        ];
                    }

                    // Year Target bar
                    return invoiceText;
                }

            },

           
            legend: {
                position: "top" as const,
            },

            title: {
                display: true,
                text: "Employee KPI - YearTarget vs Invoices Total",
            },

            tooltip: {

                callbacks: {

                    label: function (context: any) {

                        const value =
                            context.raw ?? 0;

                        return `${context.dataset.label}: ${value.toLocaleString()}`;

                    },

                },

            },

        },

        scales: {
            x: {
                ticks: {
                    align: "center",
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 3,
                    font: {
                        family: "Arial",
                        size: 12
                    }
                }
            },

            // LEFT SIDE
            y: {
                type: "linear" as const,
                position: "left" as const,
                beginAtZero: true,
                min: 0,
                max: 480000,
                title: {
                    display: true,
                    text: "Year Target",
                },

                ticks: {
                    stepSize: 40000,
                    callback: (value) => {
                        const num = Number(value);

                        if (num >= 1000000) {
                            return `${num / 1000000}M`;
                        }


                        if (num >= 1000) {
                            return `${Math.floor(num / 1000)}K`;
                        }

                        return num;
                    },
                },


            },

            // RIGHT SIDE
            y1: {
                type: "linear" as const,
                position: "right" as const,
                beginAtZero: true,
                min: 0,
                max: 480000,
                title: {
                    display: true,
                    text: "Invoices Total",
                },

                grid: {
                    drawOnChartArea: false,
                },

                ticks: {
                    stepSize: 40000,
                    callback: (value) => {
                        const num = Number(value);

                        
                        if (num >= 1000000) {
                            return `${num / 1000000}M`;
                        }

                        if (num >= 1000) {
                            return `${Math.floor(num / 1000)}K`;
                        }

                        return num;
                    },
                },

              
            },
        }

    };



    // ----------------------------------------
    // Summary
    // ----------------------------------------

    const totalInvTotal = filteredData.reduce(
        (sum, item) =>
            sum + Number(item.invtotal || 0),
        0
    );

    const totalYearTarget = filteredData.reduce(
        (sum, item) =>
            sum + Number(item.yeartarget || 0),
        0
    );

    const achievement =
        totalYearTarget === 0
            ? 0
            : (totalInvTotal / totalYearTarget) * 100;



    
    const invoiceColumns: GridColDef[] = [

        {
            field: "invdate",
            headerName: "Invoice Date",
            width: 130,

            valueFormatter: (value) => {

                if (!value) {
                    return "";
                }

                return new Date(value).toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );
            }
        },

        {
            field: "invno",
            headerName: "Invoice No",
            width: 140
        },

        {
            field: "client",
            headerName: "Client",
            width: 250
        },

        {
            field: "localvalue",
            headerName: "Invoice Total",
            width: 150,

            type: "number",

            align: "right",

            headerAlign: "right",

            valueFormatter: (value) => {

                if (value == null) {
                    return "";
                }

                return Number(value).toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );
            }
        },

        // {
        //     field: "itemtransno",
        //     headerName: "Item Trans No",
        //     width: 140
        // },

        // {
        //     field: "acctdebtorno",
        //     headerName: "Debtor No",
        //     width: 120
        // }
    ];



    const topClients = useMemo(() => {

        const clientTotals = new Map<string, number>();

        invoices.forEach(invoice => {

            const client =
                invoice.client?.trim() || "Unknown Client";

            const value =
                Number(invoice.localvalue || 0);

            clientTotals.set(
                client,
                (clientTotals.get(client) || 0) + value
            );
        });

        return Array.from(clientTotals.entries())
            .map(([client, total]) => ({
                client,
                total
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 3);

    }, [invoices]);

    // ----------------------------------------
    // Render
    // ----------------------------------------

    return (

        <Box sx={{ p: 3 }}>

            {/* 202609 09  */}
            <Modal
                open={pageLoading}
                aria-labelledby="data-loading-modal"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 300,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        id="data-loading-modal"
                        sx={{
                            fontFamily: "Arial",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                    >
                        Data loading...
                    </Typography>
                </Box>
            </Modal>


            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: "bold",
                    fontSize: "18px",
                    fontFamily: "Arial"
                }}
            >
                Employee KPI
            </Typography>

            {/* START ========== ==========  */}   
            {/* Filters */}


                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "flex-start"
                    }}
                >
                    {/* ========================================== */}
                    {/* LEFT PANEL */}
                    {/* ========================================== */}

                    <Box
                        sx={{
                            width: "750px"
                        }}
                    >

                        {/* Employee / Year */}

              
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 3
                            }}
                        >
                            {/* Employee */}
                            <FormControl sx={{ minWidth: 250 }}>
                                <InputLabel>Employee</InputLabel>

                                <Select
                                    value={selectedEmployee}
                                    label="Employee"
                                    disabled={employeesLoading}
                                    onChange={(event) =>
                                        setSelectedEmployee(event.target.value)
                                    }
                                    sx={{
                                        fontFamily: "Arial",
                                        fontSize: "14px"
                                    }}
                                >

                                    <MenuItem value="ALL">
                                        All Employees
                                    </MenuItem>


                                    {/* <MenuItem value="ALL">
                                        {employeesLoading
                                            ? "Loading employees..."
                                            : "All Employees"
                                        }
                                    </MenuItem> */}

                                    {!employeesLoading &&
                                        employees.map((employee) => (
                                            <MenuItem
                                                key={employee.employeeid}
                                                value={employee.employeeid}
                                            >
                                                {employee.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>


                            {/* Year */}
                            <FormControl sx={{ minWidth: 180 }}>
                                <InputLabel>Year</InputLabel>

                                <Select
                                    value={selectedYear}
                                    label="Year"
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        setSelectedYear(
                                            value === "ALL"
                                                ? "ALL"
                                                : Number(value)
                                        );
                                    }}
                                    sx={{
                                        fontFamily: "Arial",
                                        fontSize: "14px"
                                    }}
                                >
                                    <MenuItem value="ALL">
                                        All Years
                                    </MenuItem>

                                    {years.map((year) => (
                                        <MenuItem
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>


                            {/* PDF Report */}
                            <EmployeeKPIReport
                                kpiData={data}
                                invoices={allInvoices}
                                selectedEmployee={selectedEmployee}
                                selectedYear={selectedYear}
                            />



                        </Box>


                        {/* Summary Cards */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                mb: 3
                            }}
                        >
                            {/* Total Year Target */}
                            <Card
                                sx={{
                                    width: "240px",
                                    height: "80px"
                                }}
                            >
                                <CardContent
                                    sx={{
                                        textAlign: "center",
                                        p: 1
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "Arial",
                                            fontSize: "12px",
                                            // fontWeight: "bold"
                                        }}
                                    >
                                        Year Target
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontFamily: "Arial",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            mt: 1
                                        }}
                                    >
                                        {totalYearTarget.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}

                                        {/* {totalYearTarget.toLocaleString()} */}
                                    </Typography>
                                </CardContent>
                            </Card>


                            {/* Total Invoice */}
                            <Card
                                sx={{
                                    width: "240px",
                                    height: "80px"
                                }}
                            >
                                <CardContent
                                    sx={{
                                        textAlign: "center",
                                        p: 1
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "Arial",
                                            fontSize: "12px",
                                            // fontWeight: "bold"
                                        }}
                                    >
                                        Invoice Total
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontFamily: "Arial",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            mt: 1
                                        }}
                                    >
                                        {totalInvTotal.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>


                            {/* Achievement */}
                            <Card
                                sx={{
                                    width: "240px",
                                    height: "80px"
                                }}
                            >
                                <CardContent
                                    sx={{
                                        textAlign: "center",
                                        p: 1
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontFamily: "Arial",
                                            fontSize: "12px",
                                            // fontWeight: "bold"
                                        }}
                                    >
                                        Achievement
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontFamily: "Arial",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            mt: 1
                                        }}
                                    >
                                        {achievement.toFixed(2)}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>


                        {/* KPI CHART */}
                        <Card
                            sx={{
                                width: "750px"
                            }}
                        >
                            <CardContent
                                sx={{
                                    height: "625px"
                                }}
                            >
                                {loading ? (
                                    <Typography
                                        sx={{
                                            fontFamily: "Arial",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Loading KPI data...
                                    </Typography>
                                ) : (
                                    <Bar
                                        data={chartData}
                                        options={chartOptions}
                                    />
                                )}
                            </CardContent>
                        </Card>


                    </Box>


                    {/* ========================================== */}
                    {/* RIGHT PANEL 
                    Top 3 Clients
                    */} 
                    {/* ========================================== */}


                    <Box
                        sx={{
                            width: "850px"
                        }}
                    >         

                        
                                <Box
                                    sx={{
                                        height: "178px",
                                        mb: 2,
                                        px: 1
                                    }}
                                >

                                    {invoices.length > 0 && (
                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    mb: 1
                                                }}
                                            >
                                                Top 3 Clients
                                            </Typography>
                                    )}
                                        
                                    

                                    {topClients.map((item, index) => (
                                        <Box
                                            key={item.client}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "500px",
                                                mb: 0.5
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                {index + 1}. {item.client}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "14px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {item.total.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </Typography>
                                        </Box>
                                    ))}

                                </Box> 
                         

                        {/* ========================================== */}
                        {/* INVOICE CARD */}
                        {/* ========================================== */}

                        <Card
                            sx={{
                                width: "850px",
                                 mt: "-13px"
                                // height: "620px"
                            }}
                        >

                            <CardContent
                                sx={{
                                    p: "3px",
                                    "&:last-child": {
                                        pb: "2px"
                                    }
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontFamily: "Arial",
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        mb: 1
                                    }}
                                >
                                    {invoices.length === 0
                                        ? "Invoices"
                                        : `Invoices (${invoices.length}) — Total: ${totalInvoiceValue.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}`
                                    }
                                </Typography>


                                {/* EXISTING DATAGRID */}

                                
                                {invoices.length > 0 ? (
                                        <Box
                                            sx={{
                                                height: 630,
                                                width: "100%"
                                            }}
                                        >
                                            <DataGrid
                                                rows={invoices}
                                                columns={invoiceColumns}
                                                loading={invoiceLoading}

                                                getRowId={(row) =>
                                                    `${row.employeeid}-${row.itemtransno}`
                                                }

                                                pageSizeOptions={[
                                                    10,
                                                    15,
                                                    25,
                                                    50,
                                                    100
                                                ]}

                                                initialState={{
                                                    pagination: {
                                                        paginationModel: {
                                                            pageSize: 10,
                                                            page: 0
                                                        }
                                                    }
                                                }}

                                                disableRowSelectionOnClick

                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "14px",

                                                    "& .MuiDataGrid-columnHeaderTitle": {
                                                        fontWeight: "bold",
                                                        fontFamily: "Arial",
                                                        fontSize: "14px"
                                                    },

                                                    "& .MuiDataGrid-cell": {
                                                        fontFamily: "Arial",
                                                        fontSize: "14px"
                                                    }
                                                }}
                                            />
                                        </Box>


                                ) : (

                                        // ==============================
                                        // NO INVOICE MESSAGE
                                        // ==============================

                                        <Box
                                            sx={{
                                                height: 630,
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "14px",
                                                    color: "gray",
                                                    textAlign: "center"
                                                }}
                                            >
                                                Select Employee and Year to load invoices
                                            </Typography>
                                        </Box>

                                )}


                            </CardContent>

                        </Card>

                    </Box>

                </Box>

            

        </Box>

    );
    // return END
};

export default EmployeeKPIDashboard;
