const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to access API

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "economic_center"
});

con.connect((err) => {
    if (err) {
        console.log("Database Connection Error: ", err);
    } else {
        console.log("Connected to Database");
    }
});

// Register API
app.post("/registerpost", (req, res) => {
    const { username, email, pwrd, role } = req.body;

    // Check if email already exists
    con.query("SELECT * FROM register WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).send("Server error.");
        }

        if (results.length > 0) {
            return res.status(400).send("Email already exists.");
        }

        // Insert new user
        con.query(
            "INSERT INTO register (username, email, pwrd, role) VALUES (?, ?, ?, ?)",
            [username, email, pwrd, role],
            (err, result) => {
                if (err) {
                    console.error("Insert Error: ", err);
                    res.status(500).send("Error registering user.");
                } else {
                    res.status(201).send("User registered successfully!");
                }
            }
        );
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
