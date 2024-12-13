const Visitor = require("../models/visitor");
const geoip = require("geoip-lite");

const recordVisitor = async (req, res) => {
  try {
    // console.log("req : ", req);

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const location = geoip.lookup(ip) || {
      country: "Tidak Diketahui",
      region: "Tidak Diketahui",
      city: "Tidak Diketahui",
      ll: [0, 0], // default latitude dan longitude
    };

    console.log("location : ", location);

    const visitorInfo = {
      ip_address: ip,
      country: location.country,
      region: location.region,
      city: location.city,
      latitude: location.ll[0],
      longitude: location.ll[1],
      page_visited: req.body.page,
      visit_time: new Date(),
      user_agent: req.headers["user-agent"],
    };

    await Visitor.create(visitorInfo);
    res.status(201).send("Visitor recorded");
  } catch (error) {
    console.error("Error recording visitor:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { recordVisitor };
