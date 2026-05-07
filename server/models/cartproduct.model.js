import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product' // Ye aapke Product model ka naam hona chahiye
    },
    quantity : {
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User' // Ye aapke User model ka naam hona chahiye
    }
}, {
    timestamps : true
});

const CartProductModel = mongoose.model('cartProduct', cartProductSchema);

export default CartProductModel;