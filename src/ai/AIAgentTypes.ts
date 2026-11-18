


// file: src/ai/AIAgentTypes.ts

// ============================================================
// AGENT INTENTS
// ============================================================

export type AgentIntent =

    // KPI
    | "kpi_summary"
    | "kpi_years"
    | "kpi_employee_list"
    | "kpi_best_employee"
    | "kpi_worst_employee"

    // Invoice
    | "invoice_summary"
    | "invoice_by_year"
    | "invoice_by_employee"
    | "invoice_by_client"
    | "invoice_top_clients"
    | "invoice_top_employees"
    | "employee_clients"
    | "client_invoices"
    | "invoice_monthly"

    // Combined
    | "employee_kpi_invoice_count"

    // Portfolio
    | "portfolio"

    // RAG
    | "rag_search"

    // Azure CPF SQL Knowledge Base
    | "azure_cpf_knowledge_base"


    // Unknown
    | "unknown";

   


// ============================================================
// AGENT TOOLS
// ============================================================

export type AgentTool =

    // KPI
    | "getKPISummary"
    | "getKPIYears"
    | "getKPIEmployeeList"

    // Invoice
    | "getInvoiceSummary"
    | "getInvoicesByYear"
    | "getInvoicesByEmployee"
    | "getInvoicesByClient"
    | "getTopClients"
    | "getBottomClients"
    | "getTopEmployeesByInvoice"
    | "getEmployeeClients"
    | "getClientInvoices"
    | "getMonthlyInvoiceSummary"


     // Portfolio RAG
    | "searchKnowledge"


     // Azure CPF SQL Knowledge Base
    | "searchAzureCPFKnowledge"

   
    // None
    | "none";




// ============================================================
// AGENT PARAMETERS
// ============================================================

export interface AgentParameters {
    year?: number;
    employeeId?: string;
    employeeName?: string;
    client?: string;
    limit?: number;
}


// ============================================================
// AGENT STEP
// ============================================================

export interface AgentStep {
    id: string;
    tool: AgentTool;
    parameters: AgentParameters;
    description: string;
}


// ============================================================
// AGENT PLAN
// ============================================================

export interface AgentPlan {
    goal: string;
    intent: AgentIntent;
    parameters: AgentParameters;
    steps: AgentStep[];
}