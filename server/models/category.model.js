import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true, lowercase: true },
    images: [{ type: String }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', default: null },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('category', categorySchema);