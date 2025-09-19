'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';


export default function RegisterSalespersonPage() {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        contactNo: '',
        userType: 'user',
        salespersonId: '',
        department: '',
        supervisorId: '',
        supervisorName: ''
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

    const validateForm = (): boolean => {
        const newErrors: RegisterFormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!formData.contactNo.trim()) newErrors.contactNo = 'Contact number is required';
        else if (!/^[0-9]{10}$/.test(formData.contactNo)) newErrors.contactNo = 'Contact number must be at least 10 digits';

        if (!formData.salespersonId.trim()) newErrors.salespersonId = 'Salesperson ID is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.supervisorId.trim()) newErrors.supervisorId = 'Supervisor ID is required';
        if (!formData.supervisorName.trim()) newErrors.supervisorName = 'Supervisor name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof RegisterFormErrors, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmitStatus({ success: false, message: 'Please fix the errors in the form.' });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch('/api/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : "",
                },

                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({ success: true, message: 'Salesperson registered successfully!' });
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    contactNo: '',
                    userType: 'user',
                    salespersonId: '',
                    department: '',
                    supervisorId: '',
                    supervisorName: ''
                });
            } else {
                setSubmitStatus({ success: false, message: data.message || 'Registration failed.' });
            }
        } catch (error) {
            setSubmitStatus({ success: false, message: 'An error occurred. Please try again.' });
            console.log('An error occurred. Please try again.', error)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className=" py-10">
            <div className="max-w-2xl mx-auto">
                <div>
                    <div className='pb-8'>
                        <h1 className="text-2xl font-bold text-center">
                            Register Salesperson and Support
                        </h1>
                        <p className="text-center">
                            Fill in the details below to register a new salesperson and support
                        </p>
                    </div>
                    <div>
                        {submitStatus && (
                            <Alert variant={submitStatus.success ? "default" : "destructive"} className="mb-6">
                                {submitStatus.success ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertTitle>
                                    {submitStatus.success ? 'Success' : 'Error'}
                                </AlertTitle>
                                <AlertDescription>
                                    {submitStatus.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactNo">Contact Number *</Label>
                                    <Input
                                        id="contactNo"
                                        type="tel"
                                        placeholder="Enter contact number"
                                        value={formData.contactNo}
                                        onChange={(e) => handleInputChange('contactNo', e.target.value)}
                                        className={errors.contactNo ? 'border-red-500' : ''}
                                    />
                                    {errors.contactNo && (
                                        <p className="text-sm text-red-500">{errors.contactNo}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="salespersonId">Salesperson ID *</Label>
                                    <Input
                                        id="salespersonId"
                                        type="text"
                                        placeholder="Enter salesperson ID"
                                        value={formData.salespersonId}
                                        onChange={(e) => handleInputChange('salespersonId', e.target.value)}
                                        className={errors.salespersonId ? 'border-red-500' : ''}
                                    />
                                    {errors.salespersonId && (
                                        <p className="text-sm text-red-500">{errors.salespersonId}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department *</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => handleInputChange('department', value)}
                                    >
                                        <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sales">Sales</SelectItem>
                                            <SelectItem value="support">Support</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.department && (
                                        <p className="text-sm text-red-500">{errors.department}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="supervisorId">Supervisor ID *</Label>
                                    <Input
                                        id="supervisorId"
                                        type="text"
                                        placeholder="Enter supervisor ID"
                                        value={formData.supervisorId}
                                        onChange={(e) => handleInputChange('supervisorId', e.target.value)}
                                        className={errors.supervisorId ? 'border-red-500' : ''}
                                    />
                                    {errors.supervisorId && (
                                        <p className="text-sm text-red-500">{errors.supervisorId}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supervisorName">Supervisor Name *</Label>
                                    <Input
                                        id="supervisorName"
                                        type="text"
                                        placeholder="Enter supervisor name"
                                        value={formData.supervisorName}
                                        onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                                        className={errors.supervisorName ? 'border-red-500' : ''}
                                    />
                                    {errors.supervisorName && (
                                        <p className="text-sm text-red-500">{errors.supervisorName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="userType">User Type</Label>
                                <Select
                                    value={formData.userType}
                                    onValueChange={(value) => handleInputChange('userType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">
                                    {`Select "Sales" for salesperson registration`}
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : 'Register Salesperson'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}