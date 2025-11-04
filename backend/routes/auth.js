// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User.js";
import { validateSignupPayload, validateLoginPayload } from "../middleware/validation.js";

dotenv.config();

const router = express.Router();

router.post("/signup", validateSignupPayload, async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, password } = req.body;

    const existing = await User.findOne({ accountNumber });
    if (existing) {
      res.status(400).json({ message: "Account already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      idNumber,
      accountNumber,
      password: hashed,
      role: "customer",
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: { fullName: user.fullName, accountNumber: user.accountNumber },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", validateLoginPayload, async (req, res) => {
  try {
    const { accountNumber, password } = req.body;

    const user = await User.findOne({ accountNumber });
    if (!user) {
      res.status(400).json({ message: "Invalid account number or password." });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ message: "Invalid account number or password." });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        fullName: user.fullName,
        role: user.role,
        accountNumber: user.accountNumber,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/create-defaults", async (req, res) => {
  try {
    const defaults = [
      {
        fullName: "Bank Employee",
        accountNumber: "90000001",
        idNumber: "9000000000001",
        password: "Password@123",
        role: "employee",
      },
      {
        fullName: "Bank Admin",
        accountNumber: "90000002",
        idNumber: "9000000000002",
        password: "Password@123",
        role: "admin",
      },
    ];

    for (const def of defaults) {
      const exists = await User.findOne({ accountNumber: def.accountNumber });
      if (!exists) {
        const hashed = await bcrypt.hash(def.password, 12);
        await User.create({ ...def, password: hashed });
        console.log(`✅ Created ${def.role}: ${def.accountNumber}`);
      }
    }

    res.json({ message: "Default employee and admin created." });
  } catch (err) {
    console.error("Create-defaults error:", err);
    res.status(500).json({ message: "Failed to create defaults." });
  }
});

export default router;
