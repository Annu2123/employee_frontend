import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthLogin } from '../hooks/authHook';
import { AuthResponse } from '../types';
const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const { mutate, mutateAsync, data, isPending, isError, error } = useAuthLogin()
    const [isEmployee, setEmployee] = useState(false)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await mutateAsync({ email, password })
                console.log(res, "res")
                login(res.token, {
                    id: res._id,
                    name: res.name || 'User',
                    email: email,
                    role: res.role as 'owner' | 'super_admin'
                });
                navigate('/');
            } else {
                await api.post('/auth/register', {
                    name,
                    email,
                    password,
                    role: 'owner' // Defaulting to owner for registration for now as per requirement
                });
                setIsLogin(true); // Switch to login after registration
                alert('Registration successful! Please login.');
            }
        } catch (err: any) {
            // setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                    {isLogin ? 'Login' : 'Register Owner'}
                </h2>

                <div>
                    <label className="flex items-center">
                        <input type='checkbox' className='h-4 w-4 mr-3 border-gray-400 focus:ring-blue-500' checked={isEmployee} onChange={(e) => setEmployee(e.target.checked)} />
                        <span className="text-gray-400">Login As Employee</span>

                    </label>
                </div>
                {error && <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm">{error.message}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-gray-400 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-200"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
