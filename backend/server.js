require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));

const payments = require('./routes/payments');
app.use('/api/payments', payments);




const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/apds7311";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected:", mongoose.connection.name))
  .catch((err) => console.error("MongoDB connection error:", err.message));

const PORT = process.env.PORT || 3443;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
