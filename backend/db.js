const pgp = require('pg-promise')();

const cn = {
    connectionString: process.env.DATABASE_URL,
};
const db = pgp(cn);


module.exports = db;
