import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [employeeCount, setEmployeeCount] = useState(0);
    const [attendanceCount, setAttendanceCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user?.role === 'owner') {
                    const empRes = await api.get('/employees');
                    setEmployeeCount(empRes.data.length);

                    // Fetch today's attendance
                    const today = new Date().toISOString().split('T')[0];
                    const attRes = await api.get(`/attendance?date=${today}`);
                    setAttendanceCount(attRes.data.length);
                }
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        };
        fetchStats();
    }, [user]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Total Employees</h2>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{employeeCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Present Today</h2>
                    <p className="text-4xl font-bold text-green-600 mt-2">{attendanceCount}</p>
                </div>
                {/* Add more widgets as needed */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 col-span-1 md:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">My Profile</h2>
                    <div className="text-gray-600">
                        <p><span className="font-medium">Name:</span> {user?.name}</p>
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                        <p><span className="font-medium">Role:</span> {user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
