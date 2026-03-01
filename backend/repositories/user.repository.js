import pool from "../config/db.js";

export const UserRepository = {
  async getUserByEmail(email) {
    try {
      const result = await pool.query("SELECT * FROM users where email = $1", [
        email,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error("Database error");
    }
  },

  async createUser(username, email, hashedPassword) {
    try {
      const newUser = await pool.query(
        "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id, name, email",
        [username, email, hashedPassword],
      );
      console.log(newUser);
      return newUser.rows[0];
    } catch (error) {
      throw new Error("Creation of user failed");
    }
  },
};
