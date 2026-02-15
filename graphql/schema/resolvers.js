const { pool } = require("../db");

const resolvers = {
  User: {
    address: (parent) => {
      if (
        parent.street == null &&
        parent.city == null &&
        parent.state == null &&
        parent.zip == null
      ) {
        return null;
      }
      return {
        street: parent.street ?? "",
        city: parent.city ?? "",
        state: parent.state ?? "",
        zip: parent.zip ?? "",
      };
    },
  },
  Query: {
    users: async () => {
      const [rows] = await pool.query(`
        SELECT users.id,
        users.name,
        users.username,
        users.age,
        users.nationality,
        address.street,
        address.city,
        address.state,
        address.zip
        FROM users LEFT JOIN address ON users.id = address.user_id`);
      return rows;
    },
    user: async (_, { id }) => {
      const [[user]] = await pool.query(
        `SELECT 
        users.id,
        users.name,
        users.username,
        users.age,
        users.nationality,
        address.street,
        address.city,
        address.state,
        address.zip
        FROM users LEFT JOIN address ON users.id = address.user_id WHERE users.id = ?`,
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
      await pool.query(
        "INSERT INTO address (user_id, street, city, state, zip) VALUES (?, ?, ?, ?, ?)",
        [nextId, input.address.street, input.address.city, input.address.state, input.address.zip]
      );
      return { id: nextId, ...input };
    },
    updateUser: async (_, { id, input }) => {
      const userFields = [];
      const userValues = [];
      if (input.name !== undefined) {
        userFields.push("name = ?");
        userValues.push(input.name);
      }
      if (input.username !== undefined) {
        userFields.push("username = ?");
        userValues.push(input.username);
      }
      if (input.age !== undefined) {
        userFields.push("age = ?");
        userValues.push(input.age);
      }
      if (input.nationality !== undefined) {
        userFields.push("nationality = ?");
        userValues.push(input.nationality);
      }
      if (userFields.length > 0) {
        await pool.query(
          `UPDATE users SET ${userFields.join(", ")} WHERE id = ?`,
          [...userValues, id]
        );
      }
      const address = input.address;
      if (address) {
        const addressFields = [];
        const addressValues = [];
        if (address.street !== undefined) {
          addressFields.push("street = ?");
          addressValues.push(address.street);
        }
        if (address.city !== undefined) {
          addressFields.push("city = ?");
          addressValues.push(address.city);
        }
        if (address.state !== undefined) {
          addressFields.push("state = ?");
          addressValues.push(address.state);
        }
        if (address.zip !== undefined) {
          addressFields.push("zip = ?");
          addressValues.push(address.zip);
        }
        if (addressFields.length > 0) {
          const [existing] = await pool.query(
            "SELECT user_id FROM address WHERE user_id = ?",
            [id]
          );
          if (existing.length === 0) {
            await pool.query(
              "INSERT INTO address (user_id, street, city, state, zip) VALUES (?, ?, ?, ?, ?)",
              [
                id,
                address.street ?? "",
                address.city ?? "",
                address.state ?? "",
                address.zip ?? "",
              ]
            );
          } else {
            await pool.query(
              `UPDATE address SET ${addressFields.join(", ")} WHERE user_id = ?`,
              [...addressValues, id]
            );
          }
        }
      }
      const [[updated]] = await pool.query(
        `SELECT users.id, users.name, users.username, users.age, users.nationality,
         address.street, address.city, address.state, address.zip
         FROM users LEFT JOIN address ON users.id = address.user_id WHERE users.id = ?`,
        [id]
      );
      return updated ?? { id, ...input };
    },
    deleteUser: async (_, { id }) => {
      await pool.query("DELETE FROM users WHERE id = ?", [id]);
      await pool.query("DELETE FROM address WHERE user_id = ?", [id]);
      return { id };
    },
  },
};

module.exports = { resolvers };
