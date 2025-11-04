// backend/server.js
import fs from "fs";
import path from "path";
import https from "https";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payments.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://localhost:3000,http://localhost:3000,http://localhost")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...allowedOrigins],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, preload: true },
  })
);

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 120;
const requestCounts = new Map();

const rateLimiter = (req, res, next) => {
  const now = Date.now();
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const entry = requestCounts.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }

  requestCounts.set(ip, entry);

  if (entry.count > RATE_LIMIT_MAX) {
    res.status(429).json({ message: "Too many requests. Please try again later." });
    return;
  }

  next();
};

const sanitizeKeys = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeKeys);
  }
  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, val]) => {
      if (key.startsWith("$") || key.includes(".")) {
        return acc;
      }
      acc[key] = sanitizeKeys(val);
      return acc;
    }, {});
  }
  return value;
};

const stripDangerousCharacters = (value) => {
  if (Array.isArray(value)) {
    return value.map(stripDangerousCharacters);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, stripDangerousCharacters(val)])
    );
  }
  if (typeof value === "string") {
    return value.replace(/[<>]/g, "");
  }
  return value;
};

const normalizeParams = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? normalizeParams(value[0]) : undefined;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, normalizeParams(val)])
    );
  }
  return value;
};

app.use(express.json({ limit: "10kb" }));
app.use(rateLimiter);
app.use((req, res, next) => {
  if (req.body) req.body = stripDangerousCharacters(sanitizeKeys(req.body));
  if (req.query) req.query = normalizeParams(stripDangerousCharacters(sanitizeKeys(req.query)));
  if (req.params) req.params = stripDangerousCharacters(sanitizeKeys(req.params));
  next();
});
app.use(morgan("combined"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("✅ API running securely"));

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bankapp", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  const certDirectory = process.env.CERT_DIR || path.resolve("./backend/certs");
  const keyPath = process.env.SSL_KEY || path.join(certDirectory, "key.pem");
  const certPath = process.env.SSL_CERT || path.join(certDirectory, "cert.pem");

  try {
    const httpsServer = https.createServer(
      {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
      app
    );

    httpsServer.listen(PORT, () => {
      console.log(`🚀 Secure server running at https://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start HTTPS server. Ensure certificates are present.", err);
    console.log("Falling back to HTTP (development only).");
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  }
};

connectToDatabase().then(startServer);
