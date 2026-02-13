const mockQuery = jest.fn();

jest.mock("../db", () => ({
  pool: {
    query: (...args) => mockQuery(...args),
  },
}));

const { resolvers } = require("./resolvers");

describe("GraphQL Query Resolvers", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe("users", () => {
    it("returns all users from the database", async () => {
      const mockUsers = [
        { id: 1, name: "John Doe", username: "john_doe", age: 30, nationality: "American" },
        { id: 2, name: "Jane Doe", username: "jane_doe", age: 28, nationality: "Canadian" },
      ];
      mockQuery.mockResolvedValue([mockUsers, []]);

      const result = await resolvers.Query.users();

      expect(result).toEqual(mockUsers);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT id, name, username, age, nationality FROM users"
      );
    });

    it("returns empty array when no users exist", async () => {
      mockQuery.mockResolvedValue([[], []]);

      const result = await resolvers.Query.users();

      expect(result).toEqual([]);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT id, name, username, age, nationality FROM users"
      );
    });
  });

  describe("user", () => {
    it("returns a single user by id", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        username: "john_doe",
        age: 30,
        nationality: "American",
      };
      mockQuery.mockResolvedValue([[mockUser], []]);

      const result = await resolvers.Query.user(null, { id: "1" });

      expect(result).toEqual(mockUser);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT id, name, username, age, nationality FROM users WHERE id = ?",
        ["1"]
      );
    });

    it("returns undefined when user is not found", async () => {
      mockQuery.mockResolvedValue([[undefined], []]);

      const result = await resolvers.Query.user(null, { id: "999" });

      expect(result).toBeUndefined();
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT id, name, username, age, nationality FROM users WHERE id = ?",
        ["999"]
      );
    });
  });

  describe("nationalities", () => {
    it("returns distinct nationalities sorted alphabetically", async () => {
      const mockRows = [
        { nationality: "American" },
        { nationality: "Australian" },
        { nationality: "British" },
      ];
      mockQuery.mockResolvedValue([mockRows, []]);

      const result = await resolvers.Query.nationalities();

      expect(result).toEqual(["American", "Australian", "British"]);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        "SELECT DISTINCT nationality FROM users WHERE nationality IS NOT NULL AND nationality != '' ORDER BY nationality"
      );
    });

    it("returns empty array when no nationalities exist", async () => {
      mockQuery.mockResolvedValue([[], []]);

      const result = await resolvers.Query.nationalities();

      expect(result).toEqual([]);
    });
  });
});
