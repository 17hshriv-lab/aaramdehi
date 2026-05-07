import Coupon from "../models/coupon.model.js";

// Get all coupons with filters
export const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, search } = req.query;
    let filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (search) {
      filter.code = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const coupons = await Coupon.find(filter)
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(filter);

    return res.json({
      success: true,
      message: "Coupons fetched successfully",
      data: coupons,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id)
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .populate("applicableProducts", "name sku")
      .populate("applicableCategories", "name");

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.json({
      success: true,
      message: "Coupon fetched successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      applicableTo,
      applicableProducts,
      applicableCategories,
      usageLimit,
      usagePerUser,
      startDate,
      expiryDate,
    } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({
        success: false,
        message: "Code, discount type, and value are required",
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description: description || "",
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount: maxDiscountAmount || null,
      applicableTo: applicableTo || "all",
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      usageLimit: usageLimit || null,
      usagePerUser: usagePerUser || 1,
      startDate: startDate || new Date(),
      expiryDate,
      createdBy: req.user.id,
    });

    await coupon.save();

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      applicableTo,
      applicableProducts,
      applicableCategories,
      usageLimit,
      usagePerUser,
      startDate,
      expiryDate,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        code: code.toUpperCase(),
      });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }
      coupon.code = code.toUpperCase();
    }

    if (description !== undefined) coupon.description = description;
    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (maxDiscountAmount !== undefined)
      coupon.maxDiscountAmount = maxDiscountAmount;
    if (applicableTo) coupon.applicableTo = applicableTo;
    if (applicableProducts) coupon.applicableProducts = applicableProducts;
    if (applicableCategories)
      coupon.applicableCategories = applicableCategories;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (usagePerUser !== undefined) coupon.usagePerUser = usagePerUser;
    if (startDate) coupon.startDate = startDate;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (isActive !== undefined) coupon.isActive = isActive;

    coupon.lastModifiedBy = req.user.id;
    await coupon.save();

    return res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.json({
      success: true,
      message: "Coupon deleted successfully",
      data: coupon,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Validate coupon code for checkout
export const validateCoupon = async (req, res) => {
  try {
    const { code, userId, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active",
      });
    }

    // Check expiry
    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    // Check start date
    if (new Date() < new Date(coupon.startDate)) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not yet valid",
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon has reached its usage limit",
      });
    }

    // Check user usage limit
    const userUsage = coupon.usedBy.find((u) => u.userId.equals(userId));
    if (userUsage && userUsage.usageCount >= coupon.usagePerUser) {
      return res.status(400).json({
        success: false,
        message: "You have already used this coupon",
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return res.json({
      success: true,
      message: "Coupon is valid",
      data: {
        couponId: coupon._id,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: discount,
        finalAmount: orderAmount - discount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
