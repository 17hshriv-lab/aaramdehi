import Banner from "../models/banner.model.js";
import { uploadImageCloudinary } from "../utils/uploadImageCloudinary.js";

// Get all banners with filters and pagination
export const getAllBanners = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, isActive } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;
    const banners = await Banner.find(filter)
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .sort({ position: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Banner.countDocuments(filter);

    return res.json({
      success: true,
      message: "Banners fetched successfully",
      data: banners,
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

// Get banner by ID
export const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id)
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email");

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.json({
      success: true,
      message: "Banner fetched successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new banner
export const createBanner = async (req, res) => {
  try {
    const { title, link, category, position, altText, startDate, endDate } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Banner title is required",
      });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      // Check if buffer exists (memoryStorage) or path exists (diskStorage)
      const fileToUpload = req.file.buffer || req.file.path;
      if (!fileToUpload) throw new Error("File content is missing");

      const uploadResult = await uploadImageCloudinary(fileToUpload, "banners");
      // Check if upload was successful. If not, return the detailed error message.
      if (uploadResult && !uploadResult.success) {
          return res.status(500).json({
              success: false,
              message: uploadResult.message // Propagate the detailed error from Cloudinary helper
          });
      } else if (!uploadResult || !uploadResult.url) {
        throw new Error("Cloudinary upload failed: No secure_url returned.");
      }
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.public_id;
    } else {
      return res.status(400).json({
        success: false,
        message: "Banner image is required",
      });
    }

    const banner = new Banner({
      title,
      image: imageUrl,
      imagePublicId,
      link: link || "",
      category: category || "promotional",
      position: parseInt(position) || 0,
      altText: altText || "",
      startDate: startDate || new Date(),
      endDate: endDate || null,
      createdBy: req.user?._id || req.user?.id || req.userId, // Multi-property check for safety
    });

    // Check if createdBy was successfully assigned
    if (!banner.createdBy) {
        return res.status(401).json({
            success: false,
            message: "Authentication error: User ID not found in request context."
        });
    }

    await banner.save();

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    console.error("🔥 createBanner Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, category, position, altText, isActive, startDate, endDate } =
      req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    if (title) banner.title = title;
    if (link !== undefined) banner.link = link;
    if (category) banner.category = category;
    if (position !== undefined) banner.position = position;
    if (altText !== undefined) banner.altText = altText;
    if (isActive !== undefined) banner.isActive = isActive;
    if (startDate) banner.startDate = startDate;
    if (endDate) banner.endDate = endDate;

    if (req.file) {
      // FIX: Apply robust file check like in createBanner
      const fileToUpload = req.file.buffer || req.file.path;
      if (!fileToUpload) throw new Error("File content is missing for update.");

      const uploadResult = await uploadImageCloudinary(fileToUpload, "banners");
      // Check if upload was successful. If not, return the detailed error message.
      if (uploadResult && !uploadResult.success) {
          return res.status(500).json({
              success: false,
              message: uploadResult.message // Propagate the detailed error from Cloudinary helper
          });
      } else if (!uploadResult || !uploadResult.url) {
          throw new Error("Cloudinary upload failed: No secure_url returned during update.");
      }
      banner.image = uploadResult.url;
      banner.imagePublicId = uploadResult.public_id;
    }

    banner.lastModifiedBy = req.user?._id || req.user?.id || req.userId;
    await banner.save();

    return res.json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    console.error("🔥 updateBanner Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.json({
      success: true,
      message: "Banner deleted successfully",
      data: banner,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get banners for frontend (active only)
export const getActiveBanners = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {
      isActive: true,
      startDate: { $lte: new Date() },
      $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
    };

    if (category) {
      filter.category = category;
    }

    const banners = await Banner.find(filter).sort({ position: 1 });

    return res.json({
      success: true,
      message: "Active banners fetched successfully",
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
