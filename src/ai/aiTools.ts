


// file: src/ai/aiTools.ts

import {
    getEmployeeSBKPIYearToYear,
    getEmployeesSBKPI,
    getEmployeeSBKPIYears
} from "../employeekpi/employeeSBKPIAPIservice";

// SUMMRY KPI TOOLS:
// getKPIForYear(year)
// getKPISummary(year)
// getKPIEmployeeList()
// getPortfolioInfo()


// ==========================================
// RAG KNOWLEDGE SEARCH TOOL
// ==========================================

export const searchKnowledge = async (
    query: string
) => {

    
    // NEW: 202611 17 AWS
    const API_BASE = (
        import.meta.env.VITE_NODEJS_API_CLOUD ||
        "https://18.138.83.209"
    ).replace(/\/+$/, "");

    // OLD: 202611 17 VERCEl
    // const API_BASE =
    //     import.meta.env.VITE_NODEJS_API_CLOUD ||
    //     "https://apin-ode-jsv-ercel.vercel.app";


    const response =
        await fetch(
            `${API_BASE}/api/ai/rag/search`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    query,
                    topK: 5
                })
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data?.error ||
            "RAG search failed."
        );
    }


    return data;
};




// ==========================================
// KPI TOOL
// ==========================================

export const getKPIForYear = async (
    year: number
) => {

    const kpiData =
        await getEmployeeSBKPIYearToYear();

    const result = kpiData.filter(
        (item) => Number(item.invyear) === year
    );

    return result;
};

// ==========================================
// KPI AVAILABLE YEARS TOOL
// ==========================================

export const getKPIYears = async () => {

    return await getEmployeeSBKPIYears();

};

// ==========================================
// KPI SUMMARY TOOL
// ==========================================

export const getKPISummary = async (
    year: number
) => {

    const formatAmount = (value: number): string => {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatPercentage = (value: number): string => {
        return `${value.toFixed(2)}%`;
    };

    const kpiData =
        await getEmployeeSBKPIYearToYear();

    const result = kpiData.filter(
        (item) => Number(item.invyear) === year
    );

    const totalInvoice = result.reduce(
        (total, item) =>
            total + Number(item.invtotal || 0),
        0
    );

    const totalTarget = result.reduce(
        (total, item) =>
            total + Number(item.yeartarget || 0),
        0
    );

    const achievement =
        totalTarget > 0
            ? (totalInvoice / totalTarget) * 100
            : 0;

    return {

        year,
        employeeCount: result.length,

        totalInvoice,
        totalInvoiceFormatted: formatAmount(totalInvoice),

        totalTarget,
        totalTargetFormatted: formatAmount(totalTarget),

        achievement,
        achievementFormatted: formatPercentage(achievement),

        employees: result.map((item) => {
            const invtotal = Number(item.invtotal || 0);
            const yeartarget = Number(item.yeartarget || 0);

            return {
                name: item.name,
                invyear: Number(item.invyear),

                invtotal,
                invtotalFormatted: formatAmount(invtotal),

                yeartarget,
                yeartargetFormatted: formatAmount(yeartarget)
            };
        })


        
    };
};


// ==========================================
// KPI EMPLOYEE TOOL
// ==========================================

export const getKPIEmployeeList = async () => {

    return await getEmployeesSBKPI();

};

// -- EOF