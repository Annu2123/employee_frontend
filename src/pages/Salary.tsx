import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Employee } from '../types';

const Salary = () => {
    const queryClient = useQueryClient();
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState(0);
    const [reason, setReason] = useState('');

    // Fetch all employees to select
    const { data: employees } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => (await api.get('/employees')).data
    });

    // Fetch salary details for selected employee
    const { data: salaryData } = useQuery({
        queryKey: ['salary', selectedEmployee],
        queryFn: async () => (await api.get(`/salary/${selectedEmployee}`)).data,
        enabled: !!selectedEmployee
    });

    // Fetch advances for selected employee
    const { data: advances } = useQuery({
        queryKey: ['advances', selectedEmployee],
        queryFn: async () => (await api.get(`/salary/advance/${selectedEmployee}`)).data,
        enabled: !!selectedEmployee
    });

    const salaryMutation = useMutation({
        mutationFn: (data: any) => api.post('/salary', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['salary'] });
            alert('Salary structure updated');
        }
    });

    const advanceMutation = useMutation({
        mutationFn: (data: any) => api.post('/salary/advance', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['advances'] });
            setAdvanceAmount(0);
            setReason('');
            alert('Advance added');
        }
    });

    const handleUpdateSalary = (e: React.FormEvent) => {
        e.preventDefault();
        // Assuming form inputs are bound to state or FormData (simplified for brevity)
        // Ideally we iterate form data.
        // For this demo, let's assume we use the inputs below.
        const form = e.target as HTMLFormElement;
        const basic = parseFloat((form.elements.namedItem('basicSalary') as HTMLInputElement).value);
        const allow = parseFloat((form.elements.namedItem('allowances') as HTMLInputElement).value);
        const deduct = parseFloat((form.elements.namedItem('deductions') as HTMLInputElement).value);

        salaryMutation.mutate({
            employeeId: selectedEmployee,
            basicSalary: basic,
            allowances: allow,
            deductions: deduct
        });
    };

    const handleAddAdvance = (e: React.FormEvent) => {
        e.preventDefault();
        advanceMutation.mutate({ employeeId: selectedEmployee, amount: advanceAmount, reason });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Salary Management</h1>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="mt-1 block max-w-sm w-full border border-gray-300 rounded-md p-2">
                    <option value="">Select Employee</option>
                    {employees?.map((emp: any) => (
                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                </select>
            </div>

            {selectedEmployee && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Salary Structure */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Salary Structure</h2>
                        <form onSubmit={handleUpdateSalary} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600">Basic Salary</label>
                                <input name="basicSalary" type="number" defaultValue={salaryData?.basicSalary || 0} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Allowances</label>
                                <input name="allowances" type="number" defaultValue={salaryData?.allowances || 0} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Deductions</label>
                                <input name="deductions" type="number" defaultValue={salaryData?.deductions || 0} className="w-full border rounded p-2" />
                            </div>
                            <div className="pt-2 border-t">
                                <p className="font-bold">Net Salary: {salaryData?.netSalary || 0}</p>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Update Structure</button>
                        </form>
                    </div>

                    {/* Advance Salary */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Manage Advance</h2>
                        <form onSubmit={handleAddAdvance} className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm text-gray-600">Amount</label>
                                <input type="number" value={advanceAmount} onChange={e => setAdvanceAmount(parseFloat(e.target.value))} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Reason</label>
                                <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full border rounded p-2" />
                            </div>
                            <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">Add Advance</button>
                        </form>

                        <h3 className="font-semibold text-gray-700 mb-2">Advance History</h3>
                        <ul className="space-y-2 max-h-48 overflow-y-auto">
                            {advances?.map((adv: any) => (
                                <li key={adv._id} className="border-b pb-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{adv.amount}</span>
                                        <span className="text-gray-500">{new Date(adv.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600">{adv.reason}</p>
                                </li>
                            ))}
                            {advances?.length === 0 && <p className="text-gray-500 text-sm">No advances.</p>}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Salary;
