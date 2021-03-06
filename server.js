require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const PORT = process.env.PORT || 4000;

const app = express();
// Middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1/register", require("./routes/register"));
app.use("/api/v1/login", require("./routes/auth"));
app.use("/api/v1/profile", require("./routes/profile"));

app.get("/", (req, res) => {
    res.status(200).json({ msg: "At index" });
});

app.listen(PORT, () => {
    console.log(`Live @ http://localhost:${PORT}`);
});