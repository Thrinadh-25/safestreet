const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "safesecret";

/*
  Simple Admin Credentials
  (For demo / project use)
*/
const adminEmail = "safestreetps@gmail.com";
const adminPassword = "safestreet123";

/* ===================== ADMIN LOGIN ===================== */
router.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      user: {
        fullName: "Admin",
        email: adminEmail,
        role: "admin",
      },
      token,
    });
  }

  return res.status(401).json({
    message: "Invalid admin credentials",
  });
});

/* ===================== ADMIN CHECK ===================== */
router.get("/check", (req, res) => {
  res.json({
    success: true,
    message: "Admin route working",
  });
});

module.exports = router;
