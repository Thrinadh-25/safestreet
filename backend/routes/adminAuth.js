const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "safesecret";

const adminEmail = "safestreetps@gmail.com";
const adminPassword = "safestreet123";

router.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      user: {
        fullName: "Admin",
        email: adminEmail,
        role: "admin",
      },
      token,
    });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
});

module.exports = router; // ✅ this is required
