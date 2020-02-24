require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');
console.log(process.env);
// Database Client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();
// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // server files from /public folder
app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.get('/api/cars', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT
                c.*,
                t.name as type
            FROM cars c
            JOIN types t
            ON   c.type = t.type_id
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

app.post('/api/cars', async(req, res) => {
    try {
        console.log(req.body);
    // make a new car out of the car that comes in req.body;
        const result = await client.query(
            `

        INSERT INTO cars (brand,year, type,model,image,price)
                    VALUES ($1, $2, $3, $4, $5, $6);
            RETURNING *;
        `,

            [
                req.body.brand,
                req.body.year,
                req.body.type,
                req.body.model,
                req.body.image,
                req.body.price
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/car/:myCarId', async(req, res) => {
    try {
        const result = await client.query(
            `
          SELECT *
          FROM cars
          WHERE cars.id=$1`,
      // the second parameter is an array of values to be SANITIZED then inserted into the query
      // i only know this because of the `pg` docs
            [req.params.myCarId]
        );

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/types', async(req, res) => {
    try {
        const result = await client.query(`
          SELECT *
          FROM types
          ORDER BY name;
      `);

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
//Get another route for a specific product (then go to create table to create another talbe )
// Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});
