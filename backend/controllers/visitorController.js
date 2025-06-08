const axios = require("axios");
const Visitor = require("../models/visitor");
const geoip = require("geoip-lite");
const { Sequelize } = require("sequelize");

const getVisitorStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.count({
      where: {
        visit_time: {
          [Sequelize.Op.gte]: today,
        },
      },
    });

    // Unique IPs
    const uniqueIPs = await Visitor.count({
      distinct: true,
      col: "ip_address",
    });

    console.log(
      "totalVisitors, todayVisitors, uniqueIPs: ",
      totalVisitors,
      todayVisitors,
      uniqueIPs
    );

    res.json({
      totalVisitors,
      todayVisitors,
      uniqueIPs,
    });
  } catch (err) {
    console.error("Error fetching visitor stats:", err.message);
    res.status(500).send("Internal server error");
  }
};

const getDailyVisitors = async (req, res) => {
  try {
    const days = 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    const dailyData = await Visitor.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("visit_time")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "count"],
      ],
      where: {
        visit_time: {
          [Sequelize.Op.gte]: startDate,
        },
      },
      group: [Sequelize.fn("DATE", Sequelize.col("visit_time"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("visit_time")), "ASC"]],
    });

    const result = Array.from({ length: days }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const found = dailyData.find((v) => v.getDataValue("date") === dateStr);
      return {
        date: dateStr,
        count: found ? parseInt(found.getDataValue("count")) : 0,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching daily visitor chart:", err.message);
    res.status(500).send("Internal server error");
  }
};

// Analytics baru untuk insights
const getVisitorInsights = async (req, res) => {
  try {
    // Top Countries
    const topCountries = await Visitor.findAll({
      attributes: [
        "country",
        [Sequelize.fn("COUNT", Sequelize.col("*")), "count"],
      ],
      where: {
        country: {
          [Sequelize.Op.ne]: null,
          [Sequelize.Op.ne]: "Tidak Diketahui",
        },
      },
      group: ["country"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("*")), "DESC"]],
      limit: 5,
    });

    // Top Cities
    const topCities = await Visitor.findAll({
      attributes: [
        "city",
        "region",
        [Sequelize.fn("COUNT", Sequelize.col("*")), "count"],
      ],
      where: {
        city: {
          [Sequelize.Op.ne]: null,
          [Sequelize.Op.ne]: "Tidak Diketahui",
        },
      },
      group: ["city", "region"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("*")), "DESC"]],
      limit: 10,
    });

    // Top Pages
    const topPages = await Visitor.findAll({
      attributes: [
        "page_visited",
        [Sequelize.fn("COUNT", Sequelize.col("*")), "count"],
      ],
      where: {
        page_visited: {
          [Sequelize.Op.ne]: null,
          [Sequelize.Op.ne]: "Unknown",
        },
      },
      group: ["page_visited"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("*")), "DESC"]],
      limit: 10,
    });

    // Device Types (berdasarkan user agent)
    const allVisitors = await Visitor.findAll({
      attributes: ["user_agent"],
      where: {
        user_agent: {
          [Sequelize.Op.ne]: null,
        },
      },
    });

    let mobileCount = 0;
    let desktopCount = 0;

    allVisitors.forEach((visitor) => {
      const userAgent = visitor.user_agent.toLowerCase();
      if (
        userAgent.includes("mobile") ||
        userAgent.includes("iphone") ||
        userAgent.includes("android")
      ) {
        mobileCount++;
      } else {
        desktopCount++;
      }
    });

    // Hourly Distribution (untuk hari ini)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hourlyData = await Visitor.findAll({
      attributes: [
        [
          Sequelize.fn("EXTRACT", Sequelize.literal("HOUR FROM visit_time")),
          "hour",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "count"],
      ],
      where: {
        visit_time: {
          [Sequelize.Op.gte]: today,
        },
      },
      group: [
        Sequelize.fn("EXTRACT", Sequelize.literal("HOUR FROM visit_time")),
      ],
      order: [
        [
          Sequelize.fn("EXTRACT", Sequelize.literal("HOUR FROM visit_time")),
          "ASC",
        ],
      ],
    });

    // GPS vs IP Location Analysis
    const gpsLocations = await Visitor.count({
      where: {
        latitude_gps: {
          [Sequelize.Op.ne]: null,
        },
        longitude_gps: {
          [Sequelize.Op.ne]: null,
        },
      },
    });

    const totalVisitors = await Visitor.count();

    res.json({
      topCountries: topCountries.map((item) => ({
        country: item.country,
        count: parseInt(item.getDataValue("count")),
      })),
      topCities: topCities.map((item) => ({
        city: item.city,
        region: item.region,
        count: parseInt(item.getDataValue("count")),
      })),
      topPages: topPages.map((item) => ({
        page: item.page_visited,
        count: parseInt(item.getDataValue("count")),
      })),
      deviceTypes: {
        mobile: mobileCount,
        desktop: desktopCount,
      },
      hourlyDistribution: Array.from({ length: 24 }, (_, hour) => {
        const found = hourlyData.find(
          (item) => parseInt(item.getDataValue("hour")) === hour
        );
        return {
          hour,
          count: found ? parseInt(found.getDataValue("count")) : 0,
        };
      }),
      locationAccuracy: {
        withGPS: gpsLocations,
        withoutGPS: totalVisitors - gpsLocations,
        gpsPercentage: Math.round((gpsLocations / totalVisitors) * 100),
      },
    });
  } catch (err) {
    console.error("Error fetching visitor insights:", err.message);
    res.status(500).send("Internal server error");
  }
};

// Recent visitors dengan detail lokasi
const getRecentVisitors = async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const recentVisitors = await Visitor.findAll({
      attributes: [
        "id",
        "ip_address",
        "country",
        "region",
        "city",
        "page_visited",
        "visit_time",
        "user_agent",
        "latitude_gps",
        "longitude_gps",
        "location_details_gps",
      ],
      order: [["visit_time", "DESC"]],
      limit: parseInt(limit),
    });

    const formattedVisitors = recentVisitors.map((visitor) => {
      const userAgent = visitor.user_agent;
      let deviceType = "Desktop";
      let browser = "Unknown";
      let os = "Unknown";

      if (userAgent) {
        const ua = userAgent.toLowerCase();

        // Device Type
        if (
          ua.includes("mobile") ||
          ua.includes("iphone") ||
          ua.includes("android")
        ) {
          deviceType = "Mobile";
        }

        // Browser
        if (ua.includes("firefox")) browser = "Firefox";
        else if (ua.includes("chrome")) browser = "Chrome";
        else if (ua.includes("safari")) browser = "Safari";
        else if (ua.includes("edge")) browser = "Edge";

        // OS
        if (ua.includes("windows")) os = "Windows";
        else if (ua.includes("mac")) os = "MacOS";
        else if (ua.includes("linux")) os = "Linux";
        else if (ua.includes("android")) os = "Android";
        else if (ua.includes("ios")) os = "iOS";
      }

      // Extract detailed location from GPS data
      let detailedLocation = `${visitor.city}, ${visitor.region}`;
      if (
        visitor.location_details_gps &&
        visitor.location_details_gps.address
      ) {
        const addr = visitor.location_details_gps.address;
        if (addr.road) {
          detailedLocation = `${addr.road}, ${
            addr.village || addr.town || visitor.city
          }`;
        }
      }

      return {
        id: visitor.id,
        ip_address: visitor.ip_address,
        location: detailedLocation,
        country: visitor.country,
        page_visited: visitor.page_visited,
        visit_time: visitor.visit_time,
        device_type: deviceType,
        browser: browser,
        os: os,
        has_gps: !!(visitor.latitude_gps && visitor.longitude_gps),
        coordinates:
          visitor.latitude_gps && visitor.longitude_gps
            ? {
                lat: visitor.latitude_gps,
                lng: visitor.longitude_gps,
              }
            : null,
      };
    });

    res.json(formattedVisitors);
  } catch (err) {
    console.error("Error fetching recent visitors:", err.message);
    res.status(500).send("Internal server error");
  }
};

const recordVisitor = async (req, res) => {
  try {
    const { latitude, longitude, page } = req.body;
    let locationDetails = {};

    if (latitude && longitude) {
      try {
        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        const response = await axios.get(geocodeUrl, { timeout: 5000 });
        if (response.data && typeof response.data === "object") {
          locationDetails = response.data;
        }
      } catch (geocodeError) {
        console.warn("Geocode API error:", geocodeError.message);
      }
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const location = geoip.lookup(ip) || {
      country: "Tidak Diketahui",
      region: "Tidak Diketahui",
      city: "Tidak Diketahui",
      ll: [0, 0],
    };

    console.log("Location from IP:", location);
    console.log("GPS Location:", { latitude, longitude });

    const visitorInfo = {
      ip_address: ip,
      country: location.country || "Tidak Diketahui",
      region: location.region || "Tidak Diketahui",
      city: location.city || "Tidak Diketahui",
      latitude: location.ll[0] || null,
      longitude: location.ll[1] || null,
      page_visited: page || "Unknown",
      visit_time: new Date(),
      user_agent: req.headers["user-agent"] || "Unknown",
      latitude_gps: latitude || null,
      longitude_gps: longitude || null,
      location_details_gps: locationDetails,
    };

    await Visitor.create(visitorInfo);
    res.status(201).json({
      message: "Visitor recorded successfully",
      location: {
        ip_based: `${location.city}, ${location.region}, ${location.country}`,
        gps_based: locationDetails.display_name || "Not available",
      },
    });
  } catch (error) {
    console.error("Unexpected error recording visitor:", error.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  recordVisitor,
  getVisitorStats,
  getDailyVisitors,
  getVisitorInsights,
  getRecentVisitors,
};
