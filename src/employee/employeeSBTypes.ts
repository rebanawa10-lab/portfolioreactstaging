


// file:    C:\Repos\PortfolioStaging\React\src\employee\employeeSBTypes.ts

export interface workexperience { 
    workexperienceid?: string; 
    employeeid?: string; 
    durationfrom: string | null; 
    durationto: string | null; 
    company: string; 
    designation: string; 
    lastgrosssalary: string; 
    reasonforleaving: string; 
    sysdatecreate?: string; 
    sysdatelastupd?: string | null; 
}


export interface referencecontact { 
    referencecontactid?: string; 
    employeeid?: string; 
    name: string; 
    company: string; 
    position: string; 
    contactnumber: string; 
    contactemail: string; 
    sysdatecreate?: string; 
    sysdatelastupd?: string | null; 
}


export interface employee {
    employeeid: string;

    name: string;
    email: string;
    handphone: string;
    companyid: string;
    startdate: string | null;
    enddate: string | null;
    status: string;

    sysdatecreate?: string;
    sysdatelastupd?: string | null;

    // Child records
    workexperiences: workexperience[];
    referencecontacts: referencecontact[];
}

export interface EmployeeField {
    name: keyof employee;
    label: string;
    type: string;
    options?: {
        value: string;
        label: string;
    }[];
}






