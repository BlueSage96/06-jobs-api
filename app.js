process.noDeprecation = true; //suppress deprecation warnings in console
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// connectDB
const connectDB = require("./db/connect");
const authenticateUser = require('./middleware/authentication');

// routers
const authRouter = require("./routes/auth");
const gameRouter = require("./routes/game");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const corsOptions = {
  origin: ["https://zero6-jobs-api-brittany.onrender.com","http://localhost:3000", "http://localhost:5000"]
}

app.use(express.json());
// security packages
app.use(cors(corsOptions));
app.use(xss());
app.use(helmet());
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,//15 minutes
    max: 1000 //up to 100 requests for each IP address
  })
)
// extra packages
app.use(express.static("public"));
// routes
app.use("/api/v1/sudoku/auth", authRouter);
app.use("/api/v1/sudoku/game", authenticateUser, gameRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
   await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
