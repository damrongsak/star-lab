# Database Service

This service is responsible for managing the database interactions for the Star Lab application. It provides an interface for other services to interact with the database, abstracting away the underlying database implementation details.

## Features

*   **Database Abstraction:** Provides a consistent interface for interacting with the database, regardless of the underlying database technology.
*   **Data Validation:** Enforces data integrity by validating data before it is stored in the database.
*   **Error Handling:** Handles database errors gracefully and provides informative error messages.
*   **Connection Pooling:** Manages a pool of database connections to improve performance and resource utilization.
*   **Schema Management:** Manages the database schema.
*   **Migration and Seeding:** Supports database migrations and seeding using Knex.js.

## Technologies

*   **Database:** PostgreSQL
*   **ORM:** TypeORM
*   **Migration Tool:** Knex.js
*   **Language:** TypeScript
*   **Framework:** Express.js


## Getting Started

### Prerequisites

*   Node.js (v16 or later)
*   PostgreSQL database

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the service directory:

    ```bash
    cd database-service
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Configure environment variables:

    *   Create a `.env` file in the root directory.
    *   Set the following environment variables:

        ```
        DATABASE_HOST=<database-host>
        DATABASE_PORT=<database-port>
        DATABASE_USERNAME=<database-username>
        DATABASE_PASSWORD=<database-password>
        DATABASE_NAME=<database-name>
        ```

### Running the Service

```bash
npm run start:dev
```

### Database Migrations and Seeding

The following commands are available for managing database migrations and seeding:

*   Run the latest migrations:

    ```bash
    npm run migrate:latest
    ```

*   Rollback the last migration:

    ```bash
    npm run migrate:rollback
    ```

*   Create a new migration:

    ```bash
    npm run migrate:make <migration-name>
    ```

*   Run database seeds:

    ```bash
    npm run seed:run
    ```

*   Create a new seed file:

    ```bash
    npm run seed:make <seed-name>
    ```

*   Run a specific migration up:

    ```bash
    npm run migrate:up
    ```

*   Rollback a specific migration down:

    ```bash
    npm run migrate:down
    ```

### Testing

```bash
npm run test
```

## API Documentation

The API documentation for this service can be found at `/api`.

## Contributing

Contributions are welcome! Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE).
