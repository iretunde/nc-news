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

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool();
