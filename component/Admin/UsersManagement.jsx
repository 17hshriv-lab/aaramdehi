import React, { useState, useEffect } from 'react';
import { IoMenu, IoClose, IoTrash, IoPencil, IoChevronBack, IoEye, IoCart, IoAdd } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getAdminUsersAPI, deleteUserAPI, updateUserRoleAPI } from '../../src/api/authAndAdminApi.js';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [editRole, setEditRole] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await getAdminUsersAPI();
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleEditRole = (user) => {
        setSelectedUser(user);
        setEditRole(user.role); 
        setShowModal(true);
        setShowDetails(false);
    };

    const handleUpdateRole = async () => {
        try {
            const response = await updateUserRoleAPI(selectedUser._id, { role: editRole });
            alert(response.message);
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleDelete = async (id, email) => {
        if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

        try {
            const response = await deleteUserAPI(id);
            alert(response.message);
            fetchUsers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setShowDetails(true);
        setShowModal(true);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div></div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* SIDEBAR */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden`}>
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-black text-red-500">Aaramdehi</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                        <IoChevronBack size={20} /> Dashboard
                    </button>
                    <button onClick={() => navigate('/admin/products')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                        <IoAdd size={20} /> Products
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                        <IoEye size={20} /> Users
                    </button>
                    <button onClick={() => navigate('/admin/orders')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                        <IoCart size={20} /> Orders
                    </button>
                </nav>
            </div>

            {/* MAIN */}
            <div className="flex-1 flex flex-col">
                {/* TOP BAR */}
                <div className="bg-white border-b p-6 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded transition-colors">
                        {sidebarOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
                    </button>
                    <h1 className="text-2xl font-black text-gray-900">User Management</h1>
                    <div className="text-sm text-gray-600">Total Users: <span className="font-bold text-red-500">{users.length}</span></div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Role</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Joined</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded text-sm font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => handleViewDetails(user)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors" title="View Details">
                                                <IoEye size={18} />
                                            </button>
                                            <button onClick={() => handleEditRole(user)} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors" title="Edit Role">
                                                <IoPencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(user._id, user.email)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors" title="Delete User">
                                                <IoTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {showDetails ? `${selectedUser.name} - Details` : `Edit Role - ${selectedUser.name}`}
                            </h2>
                            <button onClick={() => { setShowModal(false); setShowDetails(false); }} className="text-gray-500 hover:text-gray-700">
                                <IoClose size={24} />
                            </button>
                        </div>

                        {showDetails ? (
                            // DETAILS VIEW
                            <div className="p-6 space-y-4">
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedUser.name}</p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedUser.email}</p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600">Role</p>
                                    <p className="text-lg font-bold">
                                        <span className={`px-3 py-1 rounded text-sm font-bold ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {selectedUser.role}
                                        </span>
                                    </p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Account ID</p>
                                    <p className="text-xs font-mono text-gray-500">{selectedUser._id}</p>
                                </div>
                            </div>
                        ) : (
                            // EDIT VIEW
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">User Name</label>
                                    <input type="text" value={selectedUser.name} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-600" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Email</label>
                                    <input type="email" value={selectedUser.email} disabled className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-600" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Role</label>
                                    <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* FOOTER */}
                        <div className="p-6 border-t flex gap-2">
                            {showDetails ? (
                                <>
                                    <button onClick={() => { setShowDetails(false); handleEditRole(selectedUser); }} className="flex-1 bg-yellow-500 text-white py-2 rounded font-bold hover:bg-yellow-600 transition-colors">
                                        Edit Role
                                    </button>
                                    <button onClick={() => { setShowModal(false); setShowDetails(false); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400 transition-colors">
                                        Close
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleUpdateRole} className="flex-1 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600 transition-colors">
                                        Update Role
                                    </button>
                                    <button onClick={() => { setShowModal(false); setShowDetails(false); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400 transition-colors">
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
