


//              202609 09 Modal, show message: Data loading on initial load.
//              202609 22 Chart 2

// file:       employeeSBKPIDashboard.tsx

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

// 202609 22 Monthly KPI
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,   
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// 202609 22 Monthly KPI
import type { ChartData, ChartOptions } from "chart.js";

import { Bar, Chart } from "react-chartjs-2";


import ChartDataLabels from "chartjs-plugin-datalabels";

import {
    getEmployeeSBKPIYearToYear,
    getEmployeeSBKPIYearMonth,
    getEmployeesSBKPI
} from "./employeeSBKPIAPIservice";

import type {
    EmployeeSBKPIYearToYear,
    KPIEmployee
} from "./employeeSBKPIYearToYearTypes";

import type {
    EmployeeSBKPIYearMonth
} from "./employeeSBKPIYearMonthTypes";


import {
    DataGrid,
    type GridColDef
} from "@mui/x-data-grid";


import {
    getEmployeeSBInvoices
} from "./employeeSBInvoiceAPIservice";


import type {
    EmployeeSBInvoice
} from "./employeeSBInvoiceTypes";


import EmployeeSBKPIDashboardRpt
    from "./employeeSBKPIDashboardRpt";


import { log } from "../config/debug";


// 202609 22 Monthly KPI
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);


const EmployeeKPIDashboard: React.FC = () => {

    const [data, setData] = useState<EmployeeSBKPIYearToYear[]>([]);

    const [monthlyKPIData, setMonthlyKPIData] = useState<EmployeeSBKPIYearMonth[]>([]);
    
    const [loading, setLoading] = useState(true);

    const [employees, setEmployees] = useState<KPIEmployee[]>([]);
   
    const [employeesLoading, setEmployeesLoading] = useState(true);

    const [allInvoices, setAllInvoices] =
    useState<EmployeeSBInvoice[]>([]);

    const [invoices, setInvoices] =
        useState<EmployeeSBInvoice[]>([]);

            
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
        }, 2000);

        return () => clearTimeout(timer);

    }, []);


    useEffect(() => {

        const loadEmployees = async () => {

            try {

                setEmployeesLoading(true);

                const result =
                    await getEmployeesSBKPI();

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

                // ----------------------------------------
                // Year-to-Year KPI
                // ----------------------------------------

                try {

                    const yearToYearResult =
                        await getEmployeeSBKPIYearToYear();

                    log(
                        "KPI DATA:",
                        yearToYearResult
                    );

                    setData(yearToYearResult);

                } catch (error) {

                    console.error(
                        "Error loading Year-to-Year KPI data:",
                        error
                    );

                    setData([]);
                }


                // ----------------------------------------
                // Year-Month KPI
                // ----------------------------------------

                try {

                    const yearMonthResult =
                        await getEmployeeSBKPIYearMonth();

                    log(
                        "KPI YEAR MONTH DATA:",
                        yearMonthResult
                    );

                    setMonthlyKPIData(yearMonthResult);

                } catch (error) {

                    console.error(
                        "Error loading Year-Month KPI data:",
                        error
                    );

                    setMonthlyKPIData([]);
                }

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
                    const result =
                        await getEmployeeSBInvoices();

                    log(
                        "ALL SUPABASE INVOICE DATA:",
                        result
                    );

                    setAllInvoices(result);

                    // Initially show ALL invoices
                    setInvoices(result);

                } catch (error) {

                    console.error(
                        "Error loading Supabase invoices:",
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


    // 202609 22
    // ----------------------------------------
    // Monthly KPI Filter
    // ----------------------------------------

    const filteredMonthlyKPIData = useMemo(() => {

        return monthlyKPIData.filter(item => {

            const employeeMatch =
                selectedEmployee === "ALL" ||
                String(item.employeeid) === selectedEmployee;

            const yearMatch =
                selectedYear === "ALL" ||
                item.year === selectedYear;

            return employeeMatch && yearMatch;

        });

    }, [
        monthlyKPIData,
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
                      backgroundColor: "#31ee2b",

                    borderColor: "#31ee2b",

                    

                },

                // RIGHT AXIS
                {
                    label: "Invoices Total",

                    backgroundColor: "#a8ccf5",

                    borderColor: "#a8ccf5",

                    data: filteredData.map(
                        item => item.invtotal
                    ),

                    borderWidth: 1,

                    yAxisID: "y1",

                },

            ],

        };

    }, [filteredData]);

    // 202609 22 
    // ----------------------------------------
    // Monthly KPI Chart
    // MonthTarget = Line
    // Month = Bar
    // Follows Employee / Year filters
    // ----------------------------------------

   const monthlyChartData = useMemo<
    ChartData<"bar" | "line", number[], string>
    >(() => {

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];

        const monthTargetFields = [
            "monthtarget01",
            "monthtarget02",
            "monthtarget03",
            "monthtarget04",
            "monthtarget05",
            "monthtarget06",
            "monthtarget07",
            "monthtarget08",
            "monthtarget09",
            "monthtarget10",
            "monthtarget11",
            "monthtarget12"
        ] as const;

        const monthFields = [
            "month01",
            "month02",
            "month03",
            "month04",
            "month05",
            "month06",
            "month07",
            "month08",
            "month09",
            "month10",
            "month11",
            "month12"
        ] as const;


        // ----------------------------------------
        // Sum monthly targets
        // ----------------------------------------

        const monthTargets =
            monthTargetFields.map(field => {

                return filteredMonthlyKPIData.reduce(
                    (sum, item) =>
                        sum + Number(item[field] ?? 0),
                    0
                );

            });


        // ----------------------------------------
        // Sum monthly actual KPI
        // ----------------------------------------

        const monthValues =
            monthFields.map(field => {

                return filteredMonthlyKPIData.reduce(
                    (sum, item) =>
                        sum + Number(item[field] ?? 0),
                    0
                );

            });


        return {

            labels: months,

            datasets: [

                // ==================================
                // MONTHLY ACTUAL
                // BAR
                // ==================================

                {
                    type: "bar" as const,

                    label: "Monthly Invoices Total",

                    data: monthValues,

                    backgroundColor: "#a8ccf5",

                    borderColor: "#a8ccf5",

                    borderWidth: 1,

                    yAxisID: "y",

                    order: 2,
                },

                // ==================================
                // MONTHLY TARGET
                // LINE
                // ==================================

                {
                    type: "line" as const,

                    label: "Monthly Target",

                    data: monthTargets,

                    borderWidth: 2,

                    backgroundColor: "#23d81d",

                    borderColor: "#23d81d",

                    tension: 0.3,

                    pointRadius: 4,

                    pointHoverRadius: 6,

                    yAxisID: "y",

                    order: 1,
                }

            ]

        };

    }, [filteredMonthlyKPIData]);


    // ----------------------------------------
    // Chart options 
    // ----------------------------------------

    // ver2 
    const chartOptions: ChartOptions<"bar"> = {

        responsive: true,
        maintainAspectRatio: false,

        layout: {
            padding: {
                top: 0,
                bottom: 0
            }
        },

        plugins: {

            datalabels: {

                labels: {

                    // Amount inside each bar
                    value: {

                        display: true,

                        anchor: "center",
                        align: "center",

                        font: {
                            size: 10,
                            family: "Arial",                         
                        },

                        formatter: (value) => {

                            const numberValue = Number(value) || 0;

                            if (numberValue >= 1000000) {
                                return `${(numberValue / 1000000).toFixed(1)}M`;
                            }

                            if (numberValue >= 1000) {
                                return `${Math.floor(numberValue / 1000)}K`;
                            }

                            return `${numberValue}`;
                        }
                    },

                    // Achievement percentage above blue bar
                    achievement: {

                        display: (context) =>
                            context.dataset.label === "Invoices Total",

                        anchor: "end",
                        align: "top",
                        offset: 0,

                        font: {
                            size: 10,
                            family: "Arial",                        
                        },

                        formatter: (value, context) => {

                            const invoiceTotal =
                                Number(value) || 0;

                            const target =
                                Number(
                                    context.chart.data.datasets[0].data[
                                        context.dataIndex
                                    ]
                                ) || 0;

                            const achievement =
                                target > 0
                                    ? (invoiceTotal / target) * 100
                                    : 0;

                            return `${achievement.toFixed(0)}%`;
                        }
                    }
                }
            },

           legend: {
                position: "bottom",
                labels: {
                    padding: 10,
                    font: {
                        family: "Arial",
                        size: 10
                    }
                }
                
            },

            title: {
                display: true,
                text: "Employee KPI - YearTarget vs Invoices Total",
                font: {
                    family: "Arial",
                    size: 12,
                    weight: "bold"
                },

                padding: {
                    top: 0,
                    bottom: 20
                }

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
                        size: 10
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
                    font: {
                        family: "Arial",
                        size: 10,                    
                    },

                },

                ticks: {
                    font: {
                            family: "Arial",
                            size: 10
                    },

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
                    font: {
                        family: "Arial",
                        size: 10
                    }
                },

                grid: {
                    drawOnChartArea: false,
                },

                ticks: {
                    font: {
                            family: "Arial",
                            size: 10
                    },

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



    // 202609 22 Start 
    // ----------------------------------------
    // Monthly Chart Options
    // ----------------------------------------

    const monthlyChartOptions: ChartOptions<"bar" | "line"> = {

        responsive: true,

        maintainAspectRatio: false,

        layout: {
            padding: {
                top: 0,
                bottom: 0
            }
        },

        plugins: {

            legend: {
                position: "bottom",
                labels: {
                    padding: 10,
                    font: {
                        family: "Arial",
                        size: 10
                    }
                }
                
            },

            title: {
                display: true,
                text: "Employee KPI - Monthly Target vs KPI",
                font: {
                    family: "Arial",
                    size: 12,
                    weight: "bold"
                },

                padding: {
                    top: 0,
                    bottom: 20
                }
            
            },

            datalabels: {

                anchor: "end",

                align: "top",

                offset: 3,

                font: {
                    size: 10,
                    family: "Arial"
                },

                formatter: (value) => {

                    const numberValue = Number(value) || 0;

                    if (numberValue === 0) {
                        return "";
                    }

                    if (numberValue >= 1000000) {
                        return `${(numberValue / 1000000).toFixed(1)}M`;
                    }

                    if (numberValue >= 1000) {
                        return `${Math.round(numberValue / 1000)}K`;
                    }

                    return numberValue.toLocaleString(
                        undefined,
                        {
                            maximumFractionDigits: 0
                        }
                    );
                }

            },

            tooltip: {
                
                callbacks: {

                    label: function (context: any) {

                        const value =
                            Number(context.raw ?? 0);

                        return `${context.dataset.label}: ${value.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}`;

                    }

                }

            }

        },

        scales: {

            x: {

                ticks: {

                    font: {
                        family: "Arial",
                        size: 10
                    }

                }

            },

            y: {

                beginAtZero: true,
                //  max: 90000,
                title: {
                    display: true,
                    text: "Invoices Total",
                    font: {
                        family: "Arial",
                        size: 10,                       
                    },
                },

                ticks: {

                    font: {
                            family: "Arial",
                            size: 10
                        },
                                
                    // stepSize: 15000,
          
                    callback: (value) => {

                        const num =
                            Number(value);

                        if (num >= 1000000) {
                            return `${num / 1000000}M`;
                        }

                        if (num >= 1000) {
                            return `${Math.floor(num / 1000)}K`;
                        }

                        return num;

                    }

                }

            }

        }

    };

    // 202609 22 End
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
            }
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
        
                                {/* Employee / Year / Print */}

                               <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        mb: 3,
                                        alignItems: "center"
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

                                    <EmployeeSBKPIDashboardRpt
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
                                        mb: 1
                                    }}
                                >
                                    {/* Total Year Target */}
                                    <Card
                                        sx={{
                                            width: "245px",
                                            height: "48px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                textAlign: "center",
                                                p: 0,
                                                "&:last-child": {
                                                    pb: 0
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "12px",
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                Year Target
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                {totalYearTarget.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </Typography>
                                        </CardContent>
                                    </Card>

             
                                    {/* Total Invoice */}
                                    <Card
                                        sx={{
                                            width: "245px",
                                            height: "48px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                textAlign: "center",
                                                p: 0,
                                                "&:last-child": {
                                                    pb: 0
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "12px",
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                Invoice Total
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                {totalInvTotal.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                               
                                    {/* Achievement */}
                                    <Card
                                        sx={{
                                            width: "244px",
                                            height: "48px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                textAlign: "center",
                                                p: 0,
                                                "&:last-child": {
                                                    pb: 0
                                                }
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "12px",
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                Achievement
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                {achievement.toFixed(2)}%
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                </Box>
        
        
                                {/* YEARL KPI CHART 1 */}
                                <Card
                                    sx={{
                                        width: "750px"
                                    }}
                                >
                                    <CardContent
                                        
                                        sx={{
                                            height: "309px"
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
        

                                        
                                {/* ========================================== */}
                                {/* MONTHLY KPI CHART 2   202609 22 */}
                                {/* ========================================== */}

                                <Card
                                    sx={{
                                        width: "750px",
                                        mt: 2
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            height: "309px"
                                        }}
                                    >

                                        {loading ? (

                                            <Typography
                                                sx={{
                                                    fontFamily: "Arial",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                Loading monthly KPI data...
                                            </Typography>

                                        ) : (

                                            <Chart
                                                type="bar"
                                                data={monthlyChartData}
                                                options={monthlyChartOptions}
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
};

export default EmployeeKPIDashboard;
