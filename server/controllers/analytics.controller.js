import Analytics from "../models/analytics.model.js";

// Get all analytics records
export const getAllAnalytics = async (req, res) => {
  try {
    const { page = 1, limit = 10, dateFrom, dateTo, pageUrl } = req.query;
    let filter = {};

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.date.$lte = new Date(dateTo);
      }
    }

    if (pageUrl) {
      filter.pageUrl = pageUrl;
    }

    const skip = (page - 1) * limit;
    const analytics = await Analytics.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Analytics.countDocuments(filter);

    return res.json({
      success: true,
      message: "Analytics fetched successfully",
      data: analytics,
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

// Get analytics by date range
export const getAnalyticsByDateRange = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({
        success: false,
        message: "Date range is required",
      });
    }

    const analytics = await Analytics.find({
      date: {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo),
      },
    }).sort({ date: 1 });

    // Aggregate data
    const aggregatedData = {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      avgConversionRate: 0,
      avgOrderValue: 0,
      avgBounceRate: 0,
      deviceTraffic: { mobile: 0, tablet: 0, desktop: 0 },
      trafficSources: {
        organic: 0,
        direct: 0,
        referral: 0,
        paid: 0,
        social: 0,
      },
    };

    analytics.forEach((record) => {
      aggregatedData.totalPageViews += record.pageViews;
      aggregatedData.totalUniqueVisitors += record.uniqueVisitors;
      aggregatedData.totalClicks += record.clicks;
      aggregatedData.totalConversions += record.conversions;
      aggregatedData.totalRevenue += record.revenue;
      aggregatedData.avgConversionRate += record.conversionRate;
      aggregatedData.avgBounceRate += record.bounce_rate;
      aggregatedData.avgOrderValue += record.avgOrderValue;

      aggregatedData.deviceTraffic.mobile += record.deviceType.mobile;
      aggregatedData.deviceTraffic.tablet += record.deviceType.tablet;
      aggregatedData.deviceTraffic.desktop += record.deviceType.desktop;

      aggregatedData.trafficSources.organic += record.trafficSource.organic;
      aggregatedData.trafficSources.direct += record.trafficSource.direct;
      aggregatedData.trafficSources.referral += record.trafficSource.referral;
      aggregatedData.trafficSources.paid += record.trafficSource.paid;
      aggregatedData.trafficSources.social += record.trafficSource.social;
    });

    if (analytics.length > 0) {
      aggregatedData.avgConversionRate /= analytics.length;
      aggregatedData.avgBounceRate /= analytics.length;
      aggregatedData.avgOrderValue /= analytics.length;
    }

    return res.json({
      success: true,
      message: "Analytics aggregated successfully",
      data: {
        aggregatedData,
        dailyData: analytics,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Record analytics
export const recordAnalytics = async (req, res) => {
  try {
    const {
      pageUrl,
      pageViews = 0,
      uniqueVisitors = 0,
      clicks = 0,
      conversions = 0,
      revenue = 0,
      orders = 0,
      deviceType = {},
      trafficSource = {},
    } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find existing record for today
    let analytics = await Analytics.findOne({
      date: today,
      pageUrl: pageUrl || null,
    });

    if (analytics) {
      // Update existing record
      analytics.pageViews += pageViews;
      analytics.uniqueVisitors += uniqueVisitors;
      analytics.clicks += clicks;
      analytics.conversions += conversions;
      analytics.revenue += revenue;
      analytics.orders += orders;

      if (Object.keys(deviceType).length > 0) {
        analytics.deviceType.mobile += deviceType.mobile || 0;
        analytics.deviceType.tablet += deviceType.tablet || 0;
        analytics.deviceType.desktop += deviceType.desktop || 0;
      }

      if (Object.keys(trafficSource).length > 0) {
        analytics.trafficSource.organic += trafficSource.organic || 0;
        analytics.trafficSource.direct += trafficSource.direct || 0;
        analytics.trafficSource.referral += trafficSource.referral || 0;
        analytics.trafficSource.paid += trafficSource.paid || 0;
        analytics.trafficSource.social += trafficSource.social || 0;
      }
    } else {
      // Create new record
      analytics = new Analytics({
        date: today,
        pageUrl: pageUrl || null,
        pageViews,
        uniqueVisitors,
        clicks,
        conversions,
        revenue,
        orders,
        deviceType: deviceType || { mobile: 0, tablet: 0, desktop: 0 },
        trafficSource: trafficSource || {
          organic: 0,
          direct: 0,
          referral: 0,
          paid: 0,
          social: 0,
        },
      });
    }

    // Calculate conversion rate
    if (analytics.pageViews > 0) {
      analytics.conversionRate = (
        (analytics.conversions / analytics.pageViews) *
        100
      ).toFixed(2);
    }

    // Calculate average order value
    if (analytics.orders > 0) {
      analytics.avgOrderValue = (analytics.revenue / analytics.orders).toFixed(
        2
      );
    }

    await analytics.save();

    return res.json({
      success: true,
      message: "Analytics recorded successfully",
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get analytics summary
export const getAnalyticsSummary = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await Analytics.find({
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const summary = {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      avgConversionRate: 0,
      topPages: [],
      topProducts: [],
      topKeywords: [],
    };

    analytics.forEach((record) => {
      summary.totalPageViews += record.pageViews;
      summary.totalUniqueVisitors += record.uniqueVisitors;
      summary.totalClicks += record.clicks;
      summary.totalConversions += record.conversions;
      summary.totalRevenue += record.revenue;
      summary.avgConversionRate += record.conversionRate;
    });

    if (analytics.length > 0) {
      summary.avgConversionRate /= analytics.length;
    }

    return res.json({
      success: true,
      message: "Analytics summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete analytics record
export const deleteAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const analytics = await Analytics.findByIdAndDelete(id);

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: "Analytics record not found",
      });
    }

    return res.json({
      success: true,
      message: "Analytics record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
