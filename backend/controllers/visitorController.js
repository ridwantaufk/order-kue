const axios = require("axios");
const Visitor = require("../models/visitor");
const geoip = require("geoip-lite");

const recordVisitor = async (req, res) => {
  try {
    const { latitude, longitude, page } = req.body;

    let locationDetails = {};
    if (latitude && longitude) {
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
      const response = await axios.get(geocodeUrl);

      if (response.data && typeof response.data === "object") {
        locationDetails = response.data;
      } else {
        console.warn("Invalid response from geocode API (GPS):", response.data);
      }
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const location = geoip.lookup(ip) || {
      country: "Tidak Diketahui",
      region: "Tidak Diketahui",
      city: "Tidak Diketahui",
      ll: [0, 0], // default latitude dan longitude
    };

    console.log(
      "Location from IP (biasanya alamat IP ISP/provider internet):",
      location
    );

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
    res.status(201).send("Visitor recorded");
  } catch (error) {
    console.error("Unexpected error recording visitor:", error.message);
    res.status(500).send("Internal server error");
  }
};

module.exports = { recordVisitor };
