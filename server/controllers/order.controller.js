import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js"; // पक्का करें कि यह सही पाथ है

export const createOrder = async (req, res) => {
    try {
        // 🛡️ Helper: HTML टैग्स को हटाने के लिए (XSS Protection)
        const sanitize = (str) => typeof str === 'string' ? str.replace(/<[^>]*>?/gm, '').trim() : str;

        // ✅ Authenticated User ID nikalna
        const userId = req.userId || req.user?._id;
        const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;
        
        // 🔍 DEBUG LOGS: Isse aapko terminal mein dikhega ki frontend kya bhej raha hai
        console.log("--- New Order Attempt ---");
        console.log("User:", userId);
        console.log("Payment Method:", paymentMethod);
        console.log("Total Amount:", totalAmount);
        // console.log("Items:", JSON.stringify(orderItems, null, 2)); // प्रोडक्शन में बंद रखें

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated. Please login again." });
        }

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        // Validate required fields
        if (!totalAmount || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing Required Fields: totalAmount, shippingAddress or paymentMethod" 
            });
        }

        // ✅ Validation: Order items mein productId hona zaroori hai
        const isValidItems = orderItems.every(item => item.productId || item._id);
        if (!isValidItems) {
            return res.status(400).json({ success: false, message: "Each item must have a valid Product ID" });
        }

        // 🔐 SECURITY FIX: पक्का करें कि प्राइस डेटाबेस से आ रहा है, फ्रंटेंड से नहीं
        let serverCalculatedTotal = 0;
        const processedItems = await Promise.all(orderItems.map(async (item) => {
            const product = await ProductModel.findById(item.productId || item._id);
            if (!product) throw new Error(`Product not found: ${item.name}`);
            
            const price = product.sellingPrice || product.price;
            const qty = item.quantity || item.qty || 1;
            serverCalculatedTotal += price * qty;

            return {
                productId: product._id,
                name: product.name,
                quantity: qty,
                price: price,
                image: product.thumbnail || (product.images && product.images[0]?.url)
            };
        }));

        // डिलीवरी चार्ज और डिस्काउंट (जो आपके CheckoutPage में था) यहाँ भी जोड़ें
        const discount = Math.round(serverCalculatedTotal * 0.10);
        const deliveryFee = serverCalculatedTotal > 500 ? 0 : 40;
        const finalAmount = serverCalculatedTotal - discount + deliveryFee;

        // अगर फ्रंटेंड और बैकेंड का अमाउंट मैच नहीं होता (टैम्परिंग का शक)
        if (Math.abs(finalAmount - totalAmount) > 1) {
            return res.status(400).json({ success: false, message: "Price mismatch detected! Security alert." });
        }

        const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 8999)}`;

        const newOrder = new OrderModel({
            userId: userId,
            orderNumber,
            orderItems: processedItems,
            shippingAddress: {
                fullName: sanitize(shippingAddress.fullName),
                address: sanitize(shippingAddress.address),
                city: sanitize(shippingAddress.city),
                postalCode: sanitize(shippingAddress.postalCode),
                mobile: sanitize(shippingAddress.mobile)
            },
            paymentMethod,
            totalAmount: finalAmount,
            paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Completed' // 'cod' से तुलना करें
        });

        await newOrder.save();
        
        // ✅ User ki history update karein
        await UserModel.findByIdAndUpdate(userId, {
            $push: { orderHistory: newOrder._id }
        });

        console.log(`✅ Order ${orderNumber} saved successfully for user ${userId}`);

        return res.status(201).json({ success: true, message: "Order placed successfully", data: newOrder });
    } catch (error) {
        console.error("🔥 ORDER SAVE ERROR:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false, 
                message: "Validation Failed: Check your order fields.", 
                details: error.errors 
            });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().populate('userId', 'name email').sort({ createdAt: -1 });
        return res.json({ success: true, data: orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await OrderModel.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true });
        return res.json({ success: true, message: "Status updated", data: order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};