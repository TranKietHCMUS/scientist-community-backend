const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const router = require("./routes/index.route");

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true 
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/api", router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => {
    console.log(`Server running on port: ${PORT}`);
});

