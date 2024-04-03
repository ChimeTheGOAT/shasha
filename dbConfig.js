require("dotenv").config();

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://ethrefund:qweasdzxc@185.230.64.48:5432/ethrefund`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction
});

module.exports = { pool };
