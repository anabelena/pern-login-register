import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to the DB");
});

pool.on("error", (err) => {
  console.error("DB Error", err);
});

export default pool;
