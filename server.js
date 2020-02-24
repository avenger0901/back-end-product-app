require("dotenv").config();
// Application Dependencies
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const pg = require("pg");
console.log(process.env);
// Database Client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();
// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan("dev")); // http logging
app.use(cors()); // enable CORS request
app.use(express.static("public")); // server files from /public folder
app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.get("/api/cats", async (req, res) => {
  try {
    const result = await client.query(`
            SELECT
                c.*,
                t.name as type
            FROM cats c
            JOIN types t
            ON   c.type_id = t.id
            ORDER BY c.year;
        `);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err
    });
  }
});
// API Routes
// app.get('/api/cars', async(req, res) => {
//     try {
//         const result = await client.query(`
//             SELECT
//             id,
//             brand,
//             year,
//             type,
//             model,
//             image,
//             price
//         FROM cars;
//         `);
//         console.log(result.rows);
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).json({
//             error: err.message || err
//         });
//     }
// });
//Get another route for a specific product (then go to create table to create another talbe )
// Start the server
app.listen(PORT, () => {
  console.log("server running on PORT", PORT);
});
