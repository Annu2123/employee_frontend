import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import api from '../api/axios';
import { Employee } from '../types';

const Attendance = () => {
    const queryClient = useQueryClient();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedEmployee, setSelectedEmployee] = useState('');

    // Form state for marking attendance
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('present');

    const { data: employees } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => (await api.get('/employees')).data
    });

    const { data: attendanceList } = useQuery({
        queryKey: ['attendance', currentMonth, selectedEmployee], // Refetch when month or employee changes
        queryFn: async () => {
            const month = currentMonth.getMonth() + 1;
            const year = currentMonth.getFullYear();
            const params: any = { month, year };
            if (selectedEmployee) params.employeeId = selectedEmployee;
            return (await api.get('/attendance', { params })).data;
        }
    });

    const markMutation = useMutation({
        mutationFn: (data: any) => api.post('/attendance', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
            alert('Attendance marked');
        }
    });

    const handleMark = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) {
            alert("Please select an employee");
            return;
        }
        markMutation.mutate({ employeeId: selectedEmployee, date: selectedDate, status });
    };

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getStatusParams = (date: Date) => {
        if (!attendanceList) return null;
        const record = attendanceList.find((att: any) => isSameDay(new Date(att.date), date) && (selectedEmployee ? att.employeeId._id === selectedEmployee : true));
        return record ? record.status : null;
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'present': return 'bg-green-200 text-green-800';
            case 'absent': return 'bg-red-200 text-red-800';
            case 'half-day': return 'bg-yellow-200 text-yellow-800';
            default: return 'bg-white';
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance Calendar</h1>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Control Panel (Left or Top) */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
                    <h2 className="text-xl font-semibold mb-4">Actions</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Select Employee to View/Mark</label>
                        <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select Employee</option>
                            {employees?.map((emp: Employee) => (
                                <option key={emp._id} value={emp._id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>

                    <form onSubmit={handleMark} className="space-y-4 border-t pt-4">
                        <h3 className="font-medium text-gray-700">Mark Attendance</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="half-day">Half Day</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Mark Status</button>
                    </form>
                </div>

                {/* Calendar Grid (Right) */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-gray-600 hover:text-black font-bold">&lt; Prev</button>
                        <h2 className="text-xl font-bold text-gray-800">{format(currentMonth, 'MMMM yyyy')}</h2>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-gray-600 hover:text-black font-bold">Next &gt;</button>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-gray-100 p-2 text-center text-sm font-semibold text-gray-700 uppercase">
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((day, idx) => {
                            const status = getStatusParams(day);
                            return (
                                <div
                                    key={day.toString()}
                                    className={`min-h-[80px] p-2 bg-white relative border-t border-l hover:bg-gray-50 transition-colors ${!isSameMonth(day, currentMonth) ? 'bg-gray-50 text-gray-400' : ''}`}
                                    onClick={() => setSelectedDate(format(day, 'yyyy-MM-dd'))}
                                >
                                    <span className="text-sm font-medium">{format(day, 'd')}</span>
                                    {status && (
                                        <div className={`mt-1 text-xs px-1 rounded ${getStatusColor(status)} text-center truncate`}>
                                            {status}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
