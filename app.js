const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* ======================
   ENV CONFIG
====================== */
dotenv.config({ path: './config.env' });


/* ======================
   DATABASE
====================== */
require("./server/database/conn");

/* ======================
   MIDDLEWARE
====================== */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* ======================
   ROUTES
====================== */
app.use(require("./server/router/auth"));

/* ======================
   STATIC FILES
====================== */
app.use("/uploads", express.static("uploads"));

/* ======================
   PRODUCTION BUILD
====================== */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client/build", "index.html")
    );
  });
}

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
