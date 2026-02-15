import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import Attendance from './pages/Attendance';
import Salary from './pages/Salary';
import SuperDashboard from './components/superadmin/superDashboard';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {

  const { user } = useAuth()
  console.log(user, "user")
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>

          <Route path="superadmin" element={<SuperDashboard />} />
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="salary" element={<Salary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
