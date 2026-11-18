


// file:    src/ai/aiToolsInvoice.ts


import {
    getEmployeeSBInvoices
} from "../employeekpi/employeeSBInvoiceAPIservice";

import {
    getEmployeesSBKPI
} from "../employeekpi/employeeSBKPIAPIservice";


// ============================================================
// Helpers
// ============================================================

const toNumber = (value: unknown): number => {
    return Number(value || 0);
};


const formatAmount = (value: number): string => {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


// ============================================================
// Invoice Summary
// ============================================================

export const getInvoiceSummary = async () => {

    const invoices =
        await getEmployeeSBInvoices();

    const totalInvoice =
        invoices.reduce(
            (total, item) =>
                total + toNumber(item.localvalue),
            0
        );

    const clients =
        new Set(
            invoices
                .map(item => item.client)
                .filter(Boolean)
        );

    const employees =
        new Set(
            invoices
                .map(item => item.employeeid)
                .filter(Boolean)
        );

    return {
        invoiceCount: invoices.length,

        invoiceCountFormatted:
            invoices.length.toLocaleString("en-US"),

        totalInvoice,

        totalInvoiceFormatted:
            formatAmount(totalInvoice),

        clientCount:
            clients.size,

        employeeCount:
            employees.size
    };
};


// ============================================================
// Invoices by Year
// ============================================================

export const getInvoicesByYear = async (
    year: number
) => {

    const invoices =
        await getEmployeeSBInvoices(
            undefined,
            year
        );

    const totalInvoice =
        invoices.reduce(
            (total, item) =>
                total + toNumber(item.localvalue),
            0
        );

    return {
        year,

        invoiceCount:
            invoices.length,

        invoiceCountFormatted:
            invoices.length.toLocaleString("en-US"),

        totalInvoice,

        totalInvoiceFormatted:
            formatAmount(totalInvoice),

        invoices
    };
};


// ============================================================
// Invoices by Employee
// ============================================================

export const getInvoicesByEmployee = async (
    employeeid: string,
    year?: number
) => {

    const invoices =
        await getEmployeeSBInvoices(
            employeeid,
            year ?? "ALL"
        );

    const totalInvoice =
        invoices.reduce(
            (total, item) =>
                total + toNumber(item.localvalue),
            0
        );

    return {
        employeeid,

        year:
            year ?? "ALL",

        invoiceCount:
            invoices.length,

        totalInvoice,

        totalInvoiceFormatted:
            formatAmount(totalInvoice),

        invoices
    };
};


// ============================================================
// Invoices by Client
// ============================================================

export const getInvoicesByClient = async (
    client: string,
    year?: number
) => {

    const invoices =
        await getEmployeeSBInvoices(
            undefined,
            year ?? "ALL"
        );

    const searchClient =
        client.toLowerCase().trim();

    const result =
        invoices.filter(item =>
            (item.client || "")
                .toLowerCase()
                .includes(searchClient)
        );

    const totalInvoice =
        result.reduce(
            (total, item) =>
                total + toNumber(item.localvalue),
            0
        );

    return {
        client,

        year:
            year ?? "ALL",

        invoiceCount:
            result.length,

        totalInvoice,

        totalInvoiceFormatted:
            formatAmount(totalInvoice),

        invoices: result
    };
};


// ============================================================
// Top Clients
// ============================================================

export const getTopClients = async (
    year?: number,
    limit: number = 10
) => {

    const invoices =
        await getEmployeeSBInvoices(
            undefined,
            year ?? "ALL"
        );

    const clientMap =
        new Map<
            string,
            {
                client: string;
                invoiceCount: number;
                totalInvoice: number;
            }
        >();


    for (const invoice of invoices) {

        const client =
            invoice.client?.trim();

        if (!client) {
            continue;
        }

        const existing =
            clientMap.get(client);

        if (existing) {

            existing.invoiceCount++;

            existing.totalInvoice +=
                toNumber(invoice.localvalue);

        } else {

            clientMap.set(client, {
                client,

                invoiceCount: 1,

                totalInvoice:
                    toNumber(invoice.localvalue)
            });
        }
    }


    return Array.from(
        clientMap.values()
    )
        .sort(
            (a, b) =>
                b.totalInvoice -
                a.totalInvoice
        )
        .slice(0, limit)
        .map(item => ({
            ...item,

            totalInvoiceFormatted:
                formatAmount(
                    item.totalInvoice
                )
        }));
};


export const getBottomClients = async (
    year?: number,
    limit: number = 10
) => {

    const invoices =
        await getEmployeeSBInvoices(
            undefined,
            year ?? "ALL"
        );

    const clientMap =
        new Map<
            string,
            {
                client: string;
                invoiceCount: number;
                totalInvoice: number;
            }
        >();

    for (const invoice of invoices) {

        const client =
            invoice.client?.trim();

        if (!client) {
            continue;
        }

        const existing =
            clientMap.get(client);

        if (existing) {

            existing.invoiceCount++;

            existing.totalInvoice +=
                toNumber(invoice.localvalue);

        } else {

            clientMap.set(client, {
                client,
                invoiceCount: 1,
                totalInvoice:
                    toNumber(invoice.localvalue)
            });
        }
    }

    return Array.from(
        clientMap.values()
    )
        .sort(
            (a, b) =>
                a.totalInvoice -
                b.totalInvoice
        )
        .slice(0, limit)
        .map(item => ({
            ...item,
            totalInvoiceFormatted:
                formatAmount(
                    item.totalInvoice
                )
        }));
};

// ============================================================
// Top Employees by Invoice Value
// ============================================================

export const getTopEmployeesByInvoice =
    async (
        year?: number,
        limit: number = 10
    ) => {

        // Get invoices
        const invoices =
            await getEmployeeSBInvoices(
                undefined,
                year ?? "ALL"
            );

        // Get employee master list
        const employees =
            await getEmployeesSBKPI();

        // employeeid -> employee name
        const employeeNameMap =
            new Map<string, string>();

        for (const employee of employees) {

            if (
                employee.employeeid &&
                employee.name
            ) {
                employeeNameMap.set(
                    String(employee.employeeid),
                    employee.name
                );
            }
        }

        // Aggregate invoices by employee
        const employeeInvoiceMap =
            new Map<
                string,
                {
                    employeeid: string;
                    name: string;
                    invoiceCount: number;
                    totalInvoice: number;
                }
            >();

        for (const invoice of invoices) {

            const employeeid =
                invoice.employeeid;

            if (!employeeid) continue;

            const employeeIdString =
                String(employeeid);

            const employeeName =
                employeeNameMap.get(
                    employeeIdString
                ) || employeeIdString;

            const existing =
                employeeInvoiceMap.get(
                    employeeIdString
                );

            if (existing) {

                existing.invoiceCount++;

                existing.totalInvoice +=
                    toNumber(
                        invoice.localvalue
                    );

            } else {

                employeeInvoiceMap.set(
                    employeeIdString,
                    {
                        employeeid:
                            employeeIdString,

                        name:
                            employeeName,

                        invoiceCount:
                            1,

                        totalInvoice:
                            toNumber(
                                invoice.localvalue
                            )
                    }
                );
            }
        }

        return Array
            .from(employeeInvoiceMap.values())

            // TOP BY INVOICE COUNT
            .sort(
                (a, b) =>
                    b.invoiceCount -
                    a.invoiceCount
            )

            .slice(0, limit)

            .map(item => ({
                ...item,

                totalInvoiceFormatted:
                    formatAmount(
                        item.totalInvoice
                    )
            }));
    };


// ============================================================
// Clients handled by Employee
// ============================================================

export const getEmployeeClients =
    async (
        employeeid: string,
        year?: number
    ) => {

        const invoices =
            await getEmployeeSBInvoices(
                employeeid,
                year ?? "ALL"
            );

        const clientMap =
            new Map<
                string,
                {
                    client: string;
                    invoiceCount: number;
                    totalInvoice: number;
                }
            >();


        for (const invoice of invoices) {

            const client =
                invoice.client?.trim();

            if (!client) {
                continue;
            }

            const existing =
                clientMap.get(client);

            if (existing) {

                existing.invoiceCount++;

                existing.totalInvoice +=
                    toNumber(invoice.localvalue);

            } else {

                clientMap.set(client, {
                    client,

                    invoiceCount: 1,

                    totalInvoice:
                        toNumber(invoice.localvalue)
                });
            }
        }


        return Array.from(
            clientMap.values()
        )
            .sort(
                (a, b) =>
                    b.totalInvoice -
                    a.totalInvoice
            )
            .map(item => ({
                ...item,

                totalInvoiceFormatted:
                    formatAmount(
                        item.totalInvoice
                    )
            }));
    };


// ============================================================
// Client Invoices
// ============================================================

export const getClientInvoices =
    async (
        client: string,
        year?: number
    ) => {

        return await getInvoicesByClient(
            client,
            year
        );
    };


// ============================================================
// Monthly Invoice Summary
// ============================================================

export const getMonthlyInvoiceSummary =
    async (
        year: number
    ) => {

        const invoices =
            await getEmployeeSBInvoices(
                undefined,
                year
            );

        const monthMap =
            new Map<
                number,
                {
                    month: number;
                    invoiceCount: number;
                    totalInvoice: number;
                }
            >();


        for (const invoice of invoices) {

            if (!invoice.invdate) {
                continue;
            }

            const date =
                new Date(invoice.invdate);

            const month =
                date.getMonth() + 1;

            const existing =
                monthMap.get(month);

            if (existing) {

                existing.invoiceCount++;

                existing.totalInvoice +=
                    toNumber(invoice.localvalue);

            } else {

                monthMap.set(month, {
                    month,

                    invoiceCount: 1,

                    totalInvoice:
                        toNumber(invoice.localvalue)
                });
            }
        }


        return Array.from(
            monthMap.values()
        )
            .sort(
                (a, b) =>
                    a.month - b.month
            )
            .map(item => ({
                ...item,

                totalInvoiceFormatted:
                    formatAmount(
                        item.totalInvoice
                    )
            }));
    };


    // -- EOF