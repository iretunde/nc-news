const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

// Convert all `bigint` to a JavaScript integer
const types = require('pg').types;
types.setTypeParser(20, function(val) {
    return parseInt(val, 10); // Parse 'bigint' as integer
});

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);
