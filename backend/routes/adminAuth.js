const express = require("express");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
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
=======
const bcrypt = require("bcryptjs");
const router = express.Router();
const AdminUser = require("../models/AdminUser");

const JWT_SECRET = process.env.JWT_SECRET || "safesecret";

// REGISTER admin
router.post("/admin-register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new AdminUser({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      user: { fullName, email, role: "admin" },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN admin
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      user: { fullName: user.fullName, email, role: "admin" },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
>>>>>>> back
