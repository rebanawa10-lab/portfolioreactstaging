


// file: employeeSBKPIYearToYearTypes.ts

export interface EmployeeSBKPIYearToYear {
    employeeid: string;
    name: string;
    invyear: number;
    invtotal: number;
    yeartarget: number;
}

export interface KPIEmployee {
    employeeid: string;
    name: string;
}

// 202609 22 Monthly KPI
export interface EmployeeSBKPIYearToYear {

    employeeid: string;
    name: string;

    invyear: number;

    yeartarget: number;
    invtotal: number;

    monthtarget01: number | null;
    month01: number | null;

    monthtarget02: number | null;
    month02: number | null;

    monthtarget03: number | null;
    month03: number | null;

    monthtarget04: number | null;
    month04: number | null;

    monthtarget05: number | null;
    month05: number | null;

    monthtarget06: number | null;
    month06: number | null;

    monthtarget07: number | null;
    month07: number | null;

    monthtarget08: number | null;
    month08: number | null;

    monthtarget09: number | null;
    month09: number | null;

    monthtarget10: number | null;
    month10: number | null;

    monthtarget11: number | null;
    month11: number | null;

    monthtarget12: number | null;
    month12: number | null;
}

