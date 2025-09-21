const express = require("express");
const app = express();
const cookieParser = require("cookie-parser"); 
const { createDatabase, createTables } = require("./models/auth-model.js");
const {authRouter, userRouter} = require("./routes/auth-route.js");
const cors = require('cors'); 
const PORT = 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

(async () => {
  try {
    await createDatabase();
    await createTables();
  } catch (error) {
    console.error("FATAL: Failed to initialize database on startup:", error);
    process.exit(1);
  }
})();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});