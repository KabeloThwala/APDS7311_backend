// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/**
 * CUSTOMER SIGNUP (keeps existing behavior)
 */
router.post("/signup", async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, password } = req.body || {};
    if (!fullName || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ accountNumber });
    if (existing) return res.status(400).json({ message: "Account already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      idNumber,
      accountNumber,
      password: hashed,
      role: "customer", // ✅ consistent with rest of app
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * LOGIN (works for all roles)
 */
router.post("/login", async (req, res) => {
  try {
    const { accountNumber, password } = req.body || {};
    if (!accountNumber || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(400).json({ message: "Invalid account number or password." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid account number or password." });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { fullName: user.fullName, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * ADMIN & EMPLOYEE CREATION (one-time setup)
 * Call manually via POST /api/auth/create-defaults (optional)
 */
router.post("/create-defaults", async (req, res) => {
  try {
    const defaults = [
      {
        fullName: "Bank Employee",
        accountNumber: "EMP001",
        idNumber: "9000000000001",
        password: "password123",
        role: "employee",
      },
      {
        fullName: "Bank Admin",
        accountNumber: "ADM001",
        idNumber: "9000000000002",
        password: "admin123",
        role: "admin",
      },
    ];

    for (const def of defaults) {
      const exists = await User.findOne({ accountNumber: def.accountNumber });
      if (!exists) {
        const hashed = await bcrypt.hash(def.password, 10);
        await User.create({ ...def, password: hashed });
        console.log(`✅ Created ${def.role}: ${def.accountNumber} / ${def.password}`);
      }
    }

    res.json({ message: "Default employee and admin created." });
  } catch (err) {
    console.error("Create-defaults error:", err);
    res.status(500).json({ message: "Failed to create defaults." });
  }
});

export default router;
