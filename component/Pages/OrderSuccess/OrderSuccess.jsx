import React, { useEffect } from 'react';
import { IoCheckmarkCircleOutline, IoDownloadOutline, IoMailOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import MinimalCheckoutHeader from '../../header/MinimalCheckoutHeader.jsx';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId = 'ORD-XXXXX', amount = 0, method = 'card', address = {} } = location.state || {};

    // Auto-redirect to home if no order data
    useEffect(() => {
        if (!location.state) {
            setTimeout(() => navigate('/'), 3000);
        }
    }, [location.state, navigate]);

    return (
        <>
            <MinimalCheckoutHeader currentStep={3} />
            <section className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Success Icon & Message */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                            <IoCheckmarkCircleOutline size={48} className="text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 text-lg">Thank you for your purchase</p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                        {/* Order ID */}
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase tracking-widest">Order ID</p>
                            <p className="text-2xl font-black text-gray-900 mt-1">{orderId}</p>
                        </div>

                        {/* Order Amount */}
                        <div>
                            <p className="text-sm text-gray-600 font-bold uppercase tracking-widest">Order Value</p>
                            <p className="text-2xl font-black text-green-600 mt-1">₹{amount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <p className="text-sm text-gray-600 font-bold uppercase tracking-widest mb-2">Payment Method</p>
                        <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded font-bold text-sm capitalize">
                            {method === 'card' && 'Credit/Debit Card'}
                            {method === 'upi' && 'UPI'}
                            {method === 'netbanking' && 'Net Banking'}
                            {method === 'cod' && 'Cash on Delivery'}
                            {method === 'emi' && 'EMI'}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 font-bold uppercase tracking-widest mb-2">Delivery Address</p>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <p className="font-bold text-gray-900">{address.name || 'Customer'}</p>
                            <p className="text-sm text-gray-600 mt-1">{address.address || 'Address will be updated'}</p>
                            <p className="text-sm text-gray-600 mt-1">Phone: {address.phone || 'Phone number'}</p>
                        </div>
                    </div>

                    {/* Delivery Est */}
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                        <p className="text-sm font-bold text-green-700">
                            📦 Expected Delivery: <span className="text-green-900">3-5 Business Days</span>
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Download Invoice */}
                    <button className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        <IoDownloadOutline size={20} />
                        Download Invoice
                    </button>

                    {/* Track Order */}
                    <button className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
                        <IoMailOutline size={20} />
                        Track Order
                    </button>

                    {/* Continue Shopping */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Email Confirmation */}
                <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-sm text-blue-700">
                        ✓ A confirmation email has been sent to your registered email address
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                        You can track your order status anytime from your account
                    </p>
                </div>
            </div>
        </section>
        </>
    );
};

export default OrderSuccess;
