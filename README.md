# GraphQL and Angular

A full-stack application with an **Angular** frontend and an **Apollo GraphQL** backend. The Angular app consumes the GraphQL API to manage users (list, add, edit) and uses **Apollo Angular** as the GraphQL client.

## Project Structure

```
graphql-and-angular/
├── angular/     # Angular 19 frontend (Apollo Angular client)
└── graphql/     # Apollo Server backend with MySQL
```

---

## Prerequisites

- **Node.js** (v18 or later recommended)
- **MySQL** (or use Docker for a local MySQL instance)
- **npm** (comes with Node.js)

---

## GraphQL Backend

The GraphQL server is built with **Apollo Server 4** and uses **MySQL** for persistence. It exposes a Users API with queries and mutations.

### Setup

1. **Install dependencies**

   ```bash
   cd graphql
   npm install
   ```

2. **Start MySQL**

   Option A — Using Docker Compose (recommended):

   ```bash
   cd graphql
   docker-compose up -d
   ```

   This starts MySQL on port 3306 and runs `init.sql` to create the `graphql` database and `users` table with sample data.

   Option B — Using an existing MySQL instance:

   - Create a database named `graphql`
   - Run the schema and seed data:

     ```bash
     cd graphql
     chmod +x import.sh
     ./import.sh
     ```

3. **Configure the database** (if not using defaults)

   Use environment variables if your MySQL setup differs:

   | Variable     | Default   | Description      |
   |-------------|-----------|------------------|
   | `DB_HOST`   | localhost | MySQL host       |
   | `DB_PORT`   | 3306     | MySQL port       |
   | `DB_USER`   | admin    | MySQL user       |
   | `DB_PASSWORD` | nimda  | MySQL password   |
   | `DB_NAME`   | graphql   | Database name    |

4. **Start the GraphQL server**

   ```bash
   cd graphql
   npm start
   ```

   The server runs at **http://localhost:3000**. Apollo Sandbox/Playground is available for testing queries and mutations.

### API Overview

- **Queries:** `users`, `user(id)`, `nationalities`
- **Mutations:** `addUser(input)`, `updateUser(id, input)`

---

## Angular Frontend

The Angular app is built with **Angular 19** and uses **Apollo Angular** to talk to the GraphQL API. It provides user listing, add user, and edit user flows.

### Setup

1. **Install dependencies**

   ```bash
   cd angular
   npm install
   ```

2. **Start the development server**

   ```bash
   cd angular
   npm start
   ```

   Or:

   ```bash
   ng serve
   ```

   The app is served at **http://localhost:4200**.

3. **Configure the GraphQL endpoint** (optional)

   By default it connects to `http://localhost:3000`. To change it, edit `angular/src/app/app.config.ts`:

   ```ts
   uri: 'http://your-graphql-server:port',
   ```

### Available Scripts

| Command       | Description                    |
|--------------|--------------------------------|
| `npm start`  | Start dev server               |
| `npm run build` | Production build            |
| `ng test`    | Run unit tests (Karma)         |

### Routes

- `/` → redirects to `/users`
- `/users` → User list
- `/users/new` → Add user form
- `/users/:id/edit` → Edit user form
- `/data` → Data page

---

## Running the Full Stack

1. Start MySQL (if using Docker):
   ```bash
   cd graphql
   docker-compose up -d
   ```

2. Start the GraphQL server:
   ```bash
   cd graphql
   npm start
   ```

3. In another terminal, start the Angular app:
   ```bash
   cd angular
   npm start
   ```

4. Open **http://localhost:4200** in your browser.

---

## Tech Stack

| Project | Technologies |
|--------|--------------|
| **GraphQL** | Apollo Server 4, GraphQL, MySQL2 (mysql2), nodemon |
| **Angular** | Angular 19, Apollo Angular, @apollo/client, RxJS |
