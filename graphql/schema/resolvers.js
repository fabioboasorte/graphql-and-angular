const { pool } = require("../db");

const resolvers = {
  Query: {
    users: async () => {
      const [rows] = await pool.query("SELECT id, name, username, age, nationality FROM users");
      return rows;
    },
    user: async (_, { id }) => {
      const [[user]] = await pool.query(
        "SELECT id, name, username, age, nationality FROM users WHERE id = ?",
        [id]
      );
      return user;
    },
    nationalities: async () => {
      const [rows] = await pool.query(
        "SELECT DISTINCT nationality FROM users WHERE nationality IS NOT NULL AND nationality != '' ORDER BY nationality"
      );
      return rows.map((r) => r.nationality);
    },
  },
  Mutation: {
    addUser: async (_, { input }) => {
      const [rows] = await pool.query("SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM users");
      const nextId = rows[0].nextId;
      await pool.query(
        "INSERT INTO users (id, name, username, age, nationality) VALUES (?, ?, ?, ?, ?)",
        [nextId, input.name, input.username, input.age, input.nationality]
      );
      const [[user]] = await pool.query(
        "SELECT id, name, username, age, nationality FROM users WHERE id = ?",
        [nextId]
      );
      return user;
    },
    updateUser: async (_, { id, input }) => {
      const fields = [];
      const values = [];
      if (input.name !== undefined) {
        fields.push("name = ?");
        values.push(input.name);
      }
      if (input.username !== undefined) {
        fields.push("username = ?");
        values.push(input.username);
      }
      if (input.age !== undefined) {
        fields.push("age = ?");
        values.push(input.age);
      }
      if (input.nationality !== undefined) {
        fields.push("nationality = ?");
        values.push(input.nationality);
      }
      if (fields.length === 0) {
        const [[user]] = await pool.query(
          "SELECT id, name, username, age, nationality FROM users WHERE id = ?",
          [id]
        );
        if (!user) throw new Error("User not found");
        return user;
      }
      values.push(id);
      await pool.query(
        `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
      const [[user]] = await pool.query(
        "SELECT id, name, username, age, nationality FROM users WHERE id = ?",
        [id]
      );
      if (!user) throw new Error("User not found");
      return user;
    },
  },
};

module.exports = { resolvers };
