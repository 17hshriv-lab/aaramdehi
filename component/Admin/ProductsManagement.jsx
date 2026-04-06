import React, { useState, useEffect } from 'react';
import { IoMenu, IoClose, IoAdd, IoTrash, IoPencil, IoChevronBack, IoEye, IoCart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getAdminProductsAPI, createProductAPI, updateProductAPI, deleteProductAPI } from '../../src/api/authAndAdminApi.js';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [image, setImage] = useState(null);
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPercentage: '',
        category: 'Cushions',
        stock: ''
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [token]);

    const fetchProducts = async () => {
        try {
            const response = await getAdminProductsAPI();
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category) {
            alert('Please fill all required fields');
            return;
        }

        if (!editingId && !image) {
            alert('Please select an image');
            return;
        }

        try {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('description', formData.description);
            fd.append('price', formData.price);
            fd.append('discountPercentage', formData.discountPercentage);
            fd.append('category', formData.category);
            fd.append('stock', formData.stock);

            if (image) {
                fd.append('image', image);
            }

            let response;
            if (editingId) {
                response = await updateProductAPI(editingId, fd);
            } else {
                response = await createProductAPI(fd);
            }

            alert(response.message);
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            category: product.category,
            stock: product.stock
        });
        setEditingId(product._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;

        try {
            const response = await deleteProductAPI(id, token);
            alert(response.message);
            fetchProducts();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            discountPercentage: '',
            category: 'Cushions',
            stock: ''
        });
        setImage(null);
        setEditingId(null);
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
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                        <IoAdd size={20} /> Products
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
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
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
                    </button>
                    <h1 className="text-2xl font-black text-gray-900">Product Management</h1>
                    <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        <IoAdd size={20} /> Add Product
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Product</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Price</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Stock</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Category</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {products.map(product => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image && <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />}
                                                <div>
                                                    <p className="font-bold text-gray-900">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.description.substring(0, 30)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-red-500 font-bold">₹{product.price}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">{product.stock}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{product.category}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => handleEdit(product)} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200">
                                                <IoPencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
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
                    <div className="bg-white rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                                <IoClose size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Product Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-500" required />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border rounded px-3 py-2 focus:outline-none focus:border-red-500"></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Price *</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border rounded px-3 py-2" required />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Discount %</label>
                                    <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Category *</label>
                                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                                        <option>Cushions</option>
                                        <option>Pillows</option>
                                        <option>Bolsters</option>
                                        <option>Bed Sheets</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Product Image {!editingId && '*'}</label>
                                <input type="file" onChange={handleImageChange} className="w-full border rounded px-3 py-2" accept="image/*" required={!editingId} />
                                {image && <p className="text-xs text-green-600 mt-1">✓ Image selected</p>}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button type="submit" className="flex-1 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
