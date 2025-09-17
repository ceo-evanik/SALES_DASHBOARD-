type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    contactNo: string;
    userType: string;
    salespersonId: string;
    department: string;
    supervisorId: string;
    supervisorName: string;
}
type RegisterFormErrors = {
    name?: string;
    email?: string;
    password?: string;
    contactNo?: string;
    salespersonId?: string;
    department?: string;
    supervisorId?: string;
    supervisorName?: string;
    userType?: string;
}
