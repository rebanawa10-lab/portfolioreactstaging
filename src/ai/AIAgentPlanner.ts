


// file: src/ai/AIAgentPlanner.ts

import type {
    AgentPlan
} from "./AIAgentTypes";

import { createCPFPlan } from "./AIAgentPlannerCPF";


// ============================================================
// CREATE AGENT PLAN
// ============================================================

export const createAgentPlan = (
    question: string
): AgentPlan => {

    const lowerQuestion =
        question.toLowerCase().trim();

    // ========================================================
    // AZURE CPF SQL KNOWLEDGE BASE
    // ========================================================

    const cpfPlan =
        createCPFPlan(lowerQuestion);

    if (cpfPlan) {
        return cpfPlan;
    }


    // ========================================================
    // EXTRACT YEAR
    // ========================================================

    const yearMatch =
        question.match(/\b(20\d{2})\b/);

    const year =
        yearMatch
            ? Number(yearMatch[1])
            : undefined;


    // ========================================================
    // EXTRACT LIMIT
    // ========================================================

    const limitMatch =
        question.match(
            /\b(?:top|first)\s+(\d+)\b/i
        );

    const limit =
        limitMatch
            ? Number(limitMatch[1])
            : undefined;


    // ========================================================
    // GENERAL FLAGS
    // ========================================================

    const hasKPI =
        lowerQuestion.includes("kpi") ||
        lowerQuestion.includes("achievement") ||
        lowerQuestion.includes("target") ||
        lowerQuestion.includes("performance") ||
        lowerQuestion.includes("performed");


    const hasInvoice =
        lowerQuestion.includes("invoice") ||
        lowerQuestion.includes("invoices") ||
        lowerQuestion.includes("billing") ||
        lowerQuestion.includes("revenue");


    const asksInvoiceCount =
        lowerQuestion.includes("how many invoices") ||
        lowerQuestion.includes("invoice count") ||
        lowerQuestion.includes("number of invoices") ||
        lowerQuestion.includes("count of invoices");


            
    // ========================================================
    // GENERAL INVOICE COUNT
    //
    // Example:
    //
    // kpi 2025 how many invoices
    // how many invoices in 2025
    //
    // These are NOT employee-specific.
    // ========================================================

    if (
        hasInvoice &&
        asksInvoiceCount &&
        year &&
        !lowerQuestion.includes("employee") &&
        !lowerQuestion.includes("employees")
    ) {

        return {

            goal:
                `Find invoice count for ${year}`,

            intent:
                "invoice_by_year",

            parameters: {
                year
            },

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getInvoicesByYear",

                    parameters: {
                        year
                    },

                    description:
                        `Retrieve invoices for ${year}`
                }
            ]
        };
    }



    // ========================================================
    // COMBINED KPI + EMPLOYEE + INVOICE COUNT
    //
    // Example:
    //
    // Dave kpi 2025 how many invoices
    //
    // ========================================================

    if (
        hasKPI &&
        hasInvoice &&
        asksInvoiceCount
    ) {

        let employeeName =
            question
                .replace(/\b20\d{2}\b/g, "")
                .replace(/\bkpi\b/gi, "")
                .replace(
                    /\bhow many invoices?\b/gi,
                    ""
                )
                .replace(
                    /\binvoice count\b/gi,
                    ""
                )
                .replace(
                    /\bnumber of invoices?\b/gi,
                    ""
                )
                .replace(
                    /\bcount of invoices?\b/gi,
                    ""
                )
                .replace(/[?.,!]/g, "")
                .trim();


        return {

            goal:
                `Find the KPI and invoice count for ${employeeName}`,

            intent:
                "employee_kpi_invoice_count",

            parameters: {
                year,
                employeeName
            },

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getKPIEmployeeList",

                    parameters: {},

                    description:
                        "Find the employee and resolve the employee ID"
                },

                {
                    id:
                        "step2",

                    tool:
                        "getKPISummary",

                    parameters: {
                        year
                    },

                    description:
                        "Retrieve KPI data for the requested year"
                },

                {
                    id:
                        "step3",

                    tool:
                        "getInvoicesByEmployee",

                    parameters: {
                        year,
                        employeeName
                    },

                    description:
                        "Retrieve invoices for the employee"
                }
            ]
        };
    }


    // ========================================================
    // TOP CLIENTS
    //
    // Examples:
    //
    // top client
    // top clients
    // top 3 clients
    // top 10 clients for 2025
    // highest client
    // best client
    // kpi top client 2025
    //
    // ========================================================


    const asksTopClient =
    /\btop\s+(?:\d+\s+)?clients?\b/i.test(question) ||
    /\bhighest\s+(?:\d+\s+)?clients?\b/i.test(question) ||
    /\bbest\s+(?:\d+\s+)?clients?\b/i.test(question);

    const asksWorstClient =
    /\bworst\s+(?:\d+\s+)?clients?\b/i.test(question) ||
    /\blowest\s+(?:\d+\s+)?clients?\b/i.test(question);


    if (asksTopClient || asksWorstClient) {

        const requestedLimit = limit ?? 10;

        return {
            goal: asksWorstClient
                ? "Find worst clients by invoice total"
                : "Find top clients by invoice total",

            intent: "invoice_top_clients",

            parameters: {
                year,
                limit: requestedLimit
            },

            steps: [
                {
                    id: "step1",

                    tool: asksWorstClient
                        ? "getBottomClients"
                        : "getTopClients",

                    parameters: {
                        year,
                        limit: requestedLimit
                    },

                    description: asksWorstClient
                        ? "Find clients with the lowest invoice totals"
                        : "Find clients with the highest invoice totals"
                }
            ]
        };
    }



    // ========================================================
    // SPECIFIC CLIENT INVOICE QUESTION
    //
    // Examples:
    //
    // Goodwin total invoices
    // Goodwin invoice total
    // Goodwin invoices 2025
    // How many invoices did Goodwin have?
    //
    // ========================================================

    const clientInvoiceQuestion =
        lowerQuestion.includes("total invoices") ||
        lowerQuestion.includes("total invoice") ||
        lowerQuestion.includes("invoice total") ||
        lowerQuestion.includes("how many invoices") ||
        lowerQuestion.includes("invoice count") ||
        lowerQuestion.includes("invoices for");


    if (
        clientInvoiceQuestion &&
        !hasKPI &&
        !asksTopClient &&
        !asksWorstClient
    ) {


        let client =
            question
                .replace(/\b20\d{2}\b/g, "")
                .replace(
                    /\bhow many invoices?\b/gi,
                    ""
                )
                .replace(
                    /\btotal invoices?\b/gi,
                    ""
                )
                .replace(
                    /\binvoice total\b/gi,
                    ""
                )
                .replace(
                    /\binvoice count\b/gi,
                    ""
                )
                .replace(
                    /\binvoices for\b/gi,
                    ""
                )
                .replace(
                    /\bhow much\b/gi,
                    ""
                )
                .replace(
                    /\bdid\b/gi,
                    ""
                )
                .replace(
                    /\bdoes\b/gi,
                    ""
                )
                .replace(
                    /\bhave\b/gi,
                    ""
                )
                .replace(
                    /\bhas\b/gi,
                    ""
                )
                .replace(
                    /\bthe\b/gi,
                    ""
                )
                .replace(
                    /\bin\b/gi,
                    ""
                )
                .replace(
                    /\bfor\b/gi,
                    ""
                )
                .replace(/[?.,!]/g, "")
                .replace(/\s+/g, " ")
                .trim();


        if (client) {

            return {

                goal:
                    `Find invoice information for ${client}`,

                intent:
                    "invoice_by_client",

                parameters: {
                    year,
                    client
                },

                steps: [

                    {
                        id:
                            "step1",

                        tool:
                            "getInvoicesByClient",

                        parameters: {
                            year,
                            client
                        },

                        description:
                            `Retrieve invoices for client ${client}`
                    }
                ]
            };
        }
    }


    // ========================================================
    // TOP EMPLOYEES BY INVOICE
    // ========================================================

    const asksTopInvoiceEmployee =
        (
            lowerQuestion.includes("top") ||
            lowerQuestion.includes("highest") ||
            lowerQuestion.includes("best")
        ) &&
        (
            lowerQuestion.includes("employee") ||
            lowerQuestion.includes("employees")
        );


    if (
        hasInvoice &&
        asksTopInvoiceEmployee
    ) {

        return {

            goal:
                "Find employees with the highest invoice values",

            intent:
                "invoice_top_employees",

            parameters: {
                year,
                limit:
                    limit ?? 10
            },

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getTopEmployeesByInvoice",

                    parameters: {
                        year,
                        limit:
                            limit ?? 10
                    },

                    description:
                        "Find employees with the highest invoice values"
                }
            ]
        };
    }


    // ========================================================
    // MONTHLY INVOICES
    // ========================================================

    const isMonthlyQuestion =
        lowerQuestion.includes("monthly") ||
        lowerQuestion.includes("month by month") ||
        lowerQuestion.includes("by month");


    if (
        hasInvoice &&
        isMonthlyQuestion &&
        year
    ) {

        return {

            goal:
                `Analyze monthly invoice totals for ${year}`,

            intent:
                "invoice_monthly",

            parameters: {
                year
            },

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getMonthlyInvoiceSummary",

                    parameters: {
                        year
                    },

                    description:
                        `Get monthly invoice totals for ${year}`
                }
            ]
        };
    }


    // ========================================================
    // INVOICE BY YEAR
    // ========================================================

    if (
        hasInvoice &&
        year
    ) {

        return {

            goal:
                `Retrieve invoice information for ${year}`,

            intent:
                "invoice_by_year",

            parameters: {
                year
            },

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getInvoicesByYear",

                    parameters: {
                        year
                    },

                    description:
                        `Retrieve invoices for ${year}`
                }
            ]
        };
    }


    // ========================================================
    // GENERAL INVOICE
    // ========================================================

    if (hasInvoice) {

        return {

            goal:
                "Find invoice information",

            intent:
                "invoice_summary",

            parameters: {},

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getInvoiceSummary",

                    parameters: {},

                    description:
                        "Retrieve invoice summary"
                }
            ]
        };
    }


    // ========================================================
    // KPI YEARS
    // ========================================================

    const isKPIYearsQuestion =
        lowerQuestion.includes("how many years") ||
        lowerQuestion.includes("what years") ||
        lowerQuestion.includes("which years") ||
        lowerQuestion.includes("available years");


    if (
        hasKPI &&
        isKPIYearsQuestion
    ) {

        return {

            goal:
                "Find the available KPI years",

            intent:
                "kpi_years",

            parameters: {},

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getKPIYears",

                    parameters: {},

                    description:
                        "Retrieve available KPI years"
                }
            ]
        };
    }


    // ========================================================
    // KPI SUMMARY
    // ========================================================

    if (
        hasKPI &&
        year
    ) {

        return {

            goal:
                `Retrieve and analyze KPI data for ${year}`,

            intent:
                "kpi_summary",

            parameters: {
                year
            },

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getKPISummary",

                    parameters: {
                        year
                    },

                    description:
                        `Retrieve KPI data for ${year}`
                }
            ]
        };
    }


    if (hasKPI) {

        return {

            goal:
                "Find KPI information",

            intent:
                "kpi_summary",

            parameters: {},

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getKPIYears",

                    parameters: {},

                    description:
                        "Retrieve available KPI years"
                }
            ]
        };
    }


    // ========================================================
    // EMPLOYEE LIST
    // ========================================================

    const isEmployeeListQuestion =
        (
            lowerQuestion.includes("employee") ||
            lowerQuestion.includes("employees")
        ) &&
        (
            lowerQuestion.includes("list") ||
            lowerQuestion.includes("all") ||
            lowerQuestion.includes("who")
        );


    if (isEmployeeListQuestion) {

        return {

            goal:
                "Retrieve the employee list",

            intent:
                "kpi_employee_list",

            parameters: {},

            steps: [

                {
                    id:
                        "step1",

                    tool:
                        "getKPIEmployeeList",

                    parameters: {},

                    description:
                        "Retrieve the employee list"
                }
            ]
        };
    }



    // ========================================================
    // RAG / PORTFOLIO KNOWLEDGE
    // ========================================================

        const isRAGQuestion =
            lowerQuestion.includes("portfolio") ||
            lowerQuestion.includes("project") ||
            lowerQuestion.includes("projects") ||
            lowerQuestion.includes("technology") ||
            lowerQuestion.includes("technologies") ||
            lowerQuestion.includes("technology stack") ||
            lowerQuestion.includes("skill") ||
            lowerQuestion.includes("skills") ||
            lowerQuestion.includes("experience") ||
            lowerQuestion.includes("background") ||
            lowerQuestion.includes("developer") ||
            lowerQuestion.includes("engineer") ||
            lowerQuestion.includes("who is raul") ||
            lowerQuestion.includes("raul") ||
            lowerQuestion.includes("database") ||
            lowerQuestion.includes("about raul");


        if (isRAGQuestion) {

            return {

                goal:
                    "Retrieve relevant portfolio knowledge",

                intent:
                    "rag_search",

                parameters: {},

                steps: [

                    {
                        id:
                            "step1",

                        tool:
                            "searchKnowledge",

                        parameters: {},

                        description:
                            "Search the portfolio knowledge base"
                    }

                ]
            };
        }


    // ========================================================
    // UNKNOWN
    // ========================================================

    return {

        goal:
            "Understand and answer the user's question",

        intent:
            "unknown",

        parameters: {},

        steps: []
    };
};

