import React, { useState, useEffect } from 'react';
import { IoMenu, IoClose, IoChevronDown, IoLogOut, IoHome, IoCart, IoPeople, IoAnalytics, IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI } from '../../api/authAndAdminApi.js';

const Dashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchStats();
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await getAdminStatsAPI();
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* SIDEBAR */}
            <div className={`${
                sidebarOpen ? 'w-64' : 'w-0'
            } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-black text-red-500">Aaramdehi</h1>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                        <IoHome size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button onClick={() => navigate('/admin/products')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                        <IoCart size={20} />
                        <span>Products</span>
                    </button>
                    <button onClick={() => navigate('/admin/orders')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                        <IoAnalytics size={20} />
                        <span>Orders</span>
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                        <IoPeople size={20} />
                        <span>Users</span>
                    </button>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500 hover:text-white transition-colors">
                        <IoLogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* TOP BAR */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {sidebarOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{localStorage.getItem('userEmail')}</span>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="avatar" className="w-10 h-10 rounded-full" />
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-auto p-6">
                    {/* HEADER */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome back to admin panel</p>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Products */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Products</p>
                                    <p className="text-3xl font-black text-gray-900 mt-2">{stats?.totalProducts || 0}</p>
                                </div>
                                <IoCart size={40} className="text-red-500 opacity-20" />
                            </div>
                        </div>

                        {/* Total Stock */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Stock</p>
                                    <p className="text-3xl font-black text-gray-900 mt-2">{stats?.totalStock || 0}</p>
                                </div>
                                <IoAnalytics size={40} className="text-blue-500 opacity-20" />
                            </div>
                        </div>

                        {/* Average Price */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Avg Price</p>
                                    <p className="text-3xl font-black text-gray-900 mt-2">₹{Math.round(stats?.avgPrice || 0)}</p>
                                </div>
                                <IoAnalytics size={40} className="text-green-500 opacity-20" />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Categories</p>
                                    <p className="text-3xl font-black text-gray-900 mt-2">{stats?.totalByCategory?.length || 0}</p>
                                </div>
                                <IoSettings size={40} className="text-purple-500 opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* PRODUCTS BY CATEGORY */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Products by Category</h2>
                        <div className="space-y-2">
                            {stats?.totalByCategory?.map((category, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span className="text-gray-700 font-medium">{category._id}</span>
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                                        {category.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
