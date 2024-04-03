require("dotenv").config();

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgres://ethrefund:aXX7K78GTShYZ66B8jNVofLUPsXWy0Fc@dpg-co6c9r8l6cac73a6u64g-a/ethrefund`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction
});

module.exports = { pool };
