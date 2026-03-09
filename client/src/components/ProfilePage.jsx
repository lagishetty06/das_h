import React, { useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import authService from '../api/authService';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- Reusable SVG Icons for showing/hiding password ---
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);
// --- End Icons ---

const ProfilePage = () => {
    const { user, token } = useAuth();
    const { tasks, completedTasks, trashTasks } = useTasks();

    const [name, setName] = useState(user?.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const stats = useMemo(() => {
        const totalCompleted = completedTasks.length;
        const totalPending = tasks.length;
        const totalCreated = totalPending + totalCompleted + trashTasks.length;
        return { totalCreated, totalCompleted, totalPending };
    }, [tasks, completedTasks, trashTasks]);

    const chartData = {
        labels: ['Pending', 'Completed'],
        datasets: [{
            data: [stats.totalPending, stats.totalCompleted],
            backgroundColor: ['rgba(255, 159, 64, 0.7)', 'rgba(75, 192, 192, 0.7)'],
            borderColor: ['rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
            borderWidth: 1,
        }],
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await authService.updateProfile({ name, phoneNumber }, token);
            toast.success('Profile updated successfully!');
        } catch {
            toast.error('Failed to update profile.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error('Passwords do not match.');
        if (password.length < 6) return toast.error('Password must be at least 6 characters long.');
        try {
            await authService.updateProfile({ password }, token);
            toast.success('Password changed successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch {
            toast.error('Failed to change password.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Email (cannot be changed)</label>
                                <input type="email" value={user?.email || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" readOnly />
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Save Changes</button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900">Update Password</button>
                        </form>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Your Productivity Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <p className="text-3xl font-bold text-blue-800">{stats.totalCreated}</p>
                            <p className="text-sm text-blue-700">Total Tasks Created</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <p className="text-3xl font-bold text-green-800">{stats.totalCompleted}</p>
                            <p className="text-sm text-green-700">Tasks Completed</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <p className="text-3xl font-bold text-yellow-800">{stats.totalPending}</p>
                            <p className="text-sm text-yellow-700">Tasks Pending</p>
                        </div>
                    </div>
                    <div className="mt-8 mx-auto" style={{ maxWidth: '300px' }}>
                        {(stats.totalPending > 0 || stats.totalCompleted > 0) ? (
                            <Pie data={chartData} />
                        ) : (
                            <p className="text-center text-gray-500">No task data yet to display chart.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;