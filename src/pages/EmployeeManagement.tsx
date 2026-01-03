import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Employee } from '../types';

const EmployeeManagement = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        designation: '',
        phone: '',
        salary: 0,
        joiningDate: new Date().toISOString().split('T')[0]
    });

    const { data: employees, isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => (await api.get('/employees')).data
    });

    const createMutation = useMutation({
        mutationFn: (newEmployee: any) => api.post('/employees', newEmployee),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            setIsModalOpen(false);
            resetForm();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/employees/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            setIsModalOpen(false);
            resetForm();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/employees/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
    });

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', designation: '', phone: '', salary: 0, joiningDate: new Date().toISOString().split('T')[0] });
        setEditingEmployee(null);
    };

    const handleEdit = (emp: Employee) => {
        setEditingEmployee(emp);
        setFormData({
            name: emp.name,
            email: emp.email,
            password: '', // Don't show password
            designation: emp.designation || '',
            phone: emp.phone || '',
            salary: emp.salary || 0,
            joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData };
        if (!payload.password) delete (payload as any).password; // Don't send empty password on edit

        if (editingEmployee) {
            updateMutation.mutate({ id: editingEmployee._id, data: payload }); // Use id mapped from _id in validataion or backend
        } else {
            createMutation.mutate(payload);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Add Employee
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees?.map((emp: any) => (
                            <tr key={emp._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{emp.designation}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit({ ...emp, id: emp._id })} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => deleteMutation.mutate(emp._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="w-full border p-2 rounded" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required disabled={!!editingEmployee} />
                            {!editingEmployee && <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />}
                            <input className="w-full border p-2 rounded" placeholder="Designation" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                            <input className="w-full border p-2 rounded" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            <input className="w-full border p-2 rounded" placeholder="Basic Salary" type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) })} />
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
