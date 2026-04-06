import React, { useState, useEffect } from 'react';
import { IoMenu, IoClose, IoEye, IoPencil, IoChevronBack, IoCart, IoAdd } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getAdminOrdersAPI, updateOrderStatusAPI } from '../../api/authAndAdminApi.js';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [editStatus, setEditStatus] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        try {
            const response = await getAdminOrdersAPI();
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
        setShowModal(true);
    };

    const handleEditStatus = (order) => {
        setSelectedOrder(order);
        setEditStatus(order.status);
        setShowDetails(false);
        setShowModal(true);
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await updateOrderStatusAPI(selectedOrder._id, { status: editStatus });
            alert(response.message);
            setShowModal(false);
            fetchOrders();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-600';
            case 'confirmed':
                return 'bg-blue-100 text-blue-600';
            case 'shipped':
                return 'bg-purple-100 text-purple-600';
            case 'delivered':
                return 'bg-green-100 text-green-600';
            case 'cancelled':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
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
                    <button onClick={() => navigate('/admin/users')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
                        <IoEye size={20} /> Users
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
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
                    <h1 className="text-2xl font-black text-gray-900">Order Management</h1>
                    <div className="text-sm text-gray-600">Total Orders: <span className="font-bold text-red-500">{orders.length}</span></div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Order ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Customer</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Amount</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-xs text-red-500 font-bold">{order._id.substring(0, 8)}...</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">{order.customerName}</p>
                                            <p className="text-xs text-gray-600">{order.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-red-500 font-bold">₹{order.totalAmount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded text-sm font-bold ${getStatusBadgeColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => handleViewDetails(order)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors" title="View Details">
                                                <IoEye size={18} />
                                            </button>
                                            <button onClick={() => handleEditStatus(order)} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors" title="Edit Status">
                                                <IoPencil size={18} />
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
                    <div className="bg-white rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {showDetails ? `Order Details` : `Update Status`}
                            </h2>
                            <button onClick={() => { setShowModal(false); setShowDetails(false); }} className="text-gray-500 hover:text-gray-700">
                                <IoClose size={24} />
                            </button>
                        </div>

                        {showDetails ? (
                            // DETAILS VIEW
                            <div className="p-6 space-y-4">
                                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                                    <p className="text-xs text-red-600 font-bold">ORDER ID</p>
                                    <p className="text-lg font-mono text-red-500">{selectedOrder._id}</p>
                                </div>

                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600 font-bold">CUSTOMER NAME</p>
                                    <p className="text-lg text-gray-900">{selectedOrder.customerName}</p>
                                </div>

                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600 font-bold">EMAIL</p>
                                    <p className="text-lg text-gray-900">{selectedOrder.email}</p>
                                </div>

                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600 font-bold">PHONE</p>
                                    <p className="text-lg text-gray-900">{selectedOrder.phone}</p>
                                </div>

                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600 font-bold">ADDRESS</p>
                                    <p className="text-lg text-gray-900">{selectedOrder.address}</p>
                                </div>

                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600 font-bold">TOTAL AMOUNT</p>
                                    <p className="text-2xl font-bold text-red-500">₹{selectedOrder.totalAmount}</p>
                                </div>

                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600 font-bold">STATUS</p>
                                    <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${getStatusBadgeColor(selectedOrder.status)}`}>
                                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                    </span>
                                </div>

                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-600 font-bold">ORDER DATE</p>
                                    <p className="text-lg text-gray-900">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 font-bold mb-2">ITEMS</p>
                                    <div className="space-y-2">
                                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="bg-gray-50 p-3 rounded">
                                                <p className="font-bold text-gray-900">{item.name}</p>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>₹{item.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // EDIT VIEW
                            <div className="p-6 space-y-4">
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="text-sm text-gray-600 font-bold">Current Status</p>
                                    <p className="text-lg font-bold text-gray-900 capitalize">{selectedOrder.status}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Update Status To</label>
                                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200">
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                    <p className="text-xs text-blue-600">
                                        ℹ Changing status from <strong>{selectedOrder.status}</strong> to <strong>{editStatus}</strong>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* FOOTER */}
                        <div className="p-6 border-t flex gap-2">
                            {showDetails ? (
                                <>
                                    <button onClick={() => { setShowDetails(false); handleEditStatus(selectedOrder); }} className="flex-1 bg-yellow-500 text-white py-2 rounded font-bold hover:bg-yellow-600 transition-colors">
                                        Update Status
                                    </button>
                                    <button onClick={() => { setShowModal(false); setShowDetails(false); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400 transition-colors">
                                        Close
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleUpdateStatus} className="flex-1 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600 transition-colors">
                                        Update Status
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

export default AdminOrders;
