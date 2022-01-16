const express = require("express");
const dotenv = require("dotenv");
const color = require("colors");
const cors = require("cors");
const http = require("http");

const db = require("./config/dbconnection");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
db.connectDB();

//  Route file
const todo = require("./routes/Todo");

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Mount routers
app.use("/api/v1/todos", todo);

app.get("/", (req, res) => {
  res.send("Todo API is live!");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
    );
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;
