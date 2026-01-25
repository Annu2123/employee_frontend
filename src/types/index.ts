export interface User {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'super_admin';
}

export interface Employee {
    _id: string;
    name: string;
    email: string;
    role: 'owner' | 'employee';
    designation?: string;
    phone?: string;
    salary?: number;
    joiningDate?: string;
    isVerified?: boolean;
}

export interface Attendance {
    _id: string;
    employeeId: Employee | string;
    date: string;
    status: string;
}

export interface Salary {
    employeeId: string;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
}

export interface SalaryAdvance {
    _id: string;
    employeeId: string;
    amount: number;
    date: string;
    reason: string;
}
export interface AuthResponse {
    token: string;
    role: string;
    name: string;
    _id: string;
}
export interface LoginCredetial {
    email: string;
    password: string;
}
