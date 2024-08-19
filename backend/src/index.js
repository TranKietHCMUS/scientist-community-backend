const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser')
require("dotenv").config();

// const db = require("./Models/db")

const userRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/authRoute");
const communityRoute = require("./Routes/communityRoute");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/communities", communityRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, (req, res) => console.log(`Server running on port: ${PORT}`));