


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeTypes.ts

export interface WorkExperience { 
    WorkExperienceID?: string; 
    EmployeeID?: string; 
    DurationFrom: string | null; 
    DurationTo: string | null; 
    Company: string; 
    Designation: string; 
    LastGrossSalary: string; 
    ReasonForLeaving: string; 
    SysDateCreate?: string; 
    SysDateLastUpd?: string | null; 
}


export interface ReferenceContact { 
    ReferenceContactID?: string; 
    EmployeeID?: string; 
    Name: string; 
    Company: string; 
    Position: string; 
    ContactNumber: string; 
    ContactEmail: string; 
    SysDateCreate?: string; 
    SysDateLastUpd?: string | null; 
}


export interface Employee {
    EmployeeID: string;

    Name: string;
    Email: string;
    HandPhone: string;
    CompanyID: string;
    StartDate: string | null;
    EndDate: string | null;
    Status: string;

    SysDateCreate?: string;
    SysDateLastUpd?: string | null;

    // Child records
    WorkExperiences: WorkExperience[];
    ReferenceContacts: ReferenceContact[];
}

export interface EmployeeField {
    name: keyof Employee;
    label: string;
    type: string;
    options?: {
        value: string;
        label: string;
    }[];
}







