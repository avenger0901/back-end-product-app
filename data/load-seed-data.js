require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import our seed data:
const cars = require('./data.js');
run();
async function run() {
    const client = new Client(process.env.DATABASE_URL);
    try {
        await client.connect();
        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // for every cat data, we want a promise to insert into the db
            cars.map(car => {
                // This is the query to insert a cat into the db.
                // First argument is the function is the "parameterized query"
                return client.query(`
                    INSERT INTO cars (id,brand,year, type,model,image,price)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
                    // Second argument is an array of values for each parameter in the query:
                [car.id, car.brand, car.year, car.type, car.model, car.image, car.price]);
            })
        );
        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
}