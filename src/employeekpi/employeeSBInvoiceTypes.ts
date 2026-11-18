


// file:   employeeSBInvoiceTypes.ts

export interface EmployeeSBInvoice {
    employeeid: string;
    invdate: string | null;
    invno: string | null;
    localvalue: number | null;
    itemtransno: number | null;
    acctdebtorno: number | null;
    client: string | null;
    sysdatecreate?: string | null;
    sysdatelastupd?: string | null;
}

