Overview
--------

This is a RESTful API built using NestJS that integrates with the [TMDB API](https://www.themoviedb.org/) to provide movie-related functionalities. The application allows users to interact with movies by rating them, adding movies to their watchlist, filtering by genre, and more.

The app is containerized using Docker and includes caching mechanisms to reduce database calls. It also provides Swagger documentation for API exploration.

* * * * *

Features
--------

### Completed Features:

-   CRUD Operations :
    -   Fetch popular movies from TMDB and store them in the database.
    -   Sync TMDB data daily via a cron job or manually via CLI command (`npm run cli sync:movies`).
-   User Authentication :
    -   JWT-based authentication for secure API access.
    -   Login endpoint to generate tokens.
-   Movie Endpoints :
    -   List movies with pagination, search, and filtering by genre.
    -   Rate a movie (returns average rating).
    -   Add/Remove movies from a user's watchlist.
-   Caching :
    -   Redis-based caching for frequently accessed movie data.
-   Database Integration :
    -   PostgreSQL database with TypeORM for ORM.
    -   Relationships between `User`, `Movie`, and `Rating`.
-   API Documentation :
    -   Swagger UI available at `/api`.
-   Docker Support :
    -   Application runs in Docker containers (PostgreSQL, Redis, and the app itself).
    -   Launch with `docker-compose up`.

* * * * *

### Missing Features:

-   Unit Testing :
    -   Unit tests are not fully implemented (current coverage < 85%).
-   Advanced Filtering :
    -   Filtering by release year or other criteria is not yet implemented.
-   Refresh Token Mechanism :
    -   JWT refresh token flow is not implemented.
-   Error Handling Enhancements :
    -   Global exception handling could be improved for production readiness.
-   Rate Limiting :
    -   API rate limiting is not implemented.
-   Frontend Integration :
    -   No frontend interface is provided; only backend APIs are implemented.

* * * * *

How to Use
----------

### Prerequisites

-   Node.js >= 16
-   Docker and Docker Compose installed
-   A TMDB API key (get one from [TMDB](https://www.themoviedb.org/) )

* * * * *

### Setup Instructions

1.  Clone the Repository :

    cd movie-api

2.  Set Environment Variables : Create a `.env` file in the root directory and add the following variables:


3.  Run the Application : Start the app with Docker:
```bash
$ docker-compose up --build
```

    

4.  Access the Application :

    -   Swagger API Docs: <http://localhost:8080/api>
    -   App Endpoint: [http://localhost:8080](http://localhost:8080/)
5.  Sync TMDB Data : Run the sync command manually:

```bash
$ npm run cli sync:movies
```
 

6.  Test Authentication :

    -   Register/Login to get a JWT token:

     ```bash

        curl -X POST http://localhost:8080/auth/login

        -H "Content-Type: application/json"

        -d '{"email": "user@example.com", "password": "password"}'
     ```
     
    -   Use the token in subsequent requests:

        ```bash
        curl -X POST http://localhost:8080/movies/123/rate

        -H "Authorization: Bearer YOUR_TOKEN_HERE"

        -H "Content-Type: application/json"

        -d '{"rating": 4}' ```

* * * * *

API Endpoints
-------------

### Auth

-   POST /auth/login : Authenticate and get a JWT token.

    ```json

    {

    "email": "user@example.com",

    "password": "password"

    }
    ```

### Movies

-   GET /movies : List movies with optional filters (genre, search, pagination).
-   POST /movies/:id/rate : Rate a movie (requires authentication).

    ```json

    {

    "rating": 4

    }
    ```

-   POST /movies/:id/watchlist : Add/Remove a movie from the watchlist (toggle functionality).

* * * * *

Technologies Used
-----------------

-   Backend Framework : NestJS
-   Database : PostgreSQL
-   ORM : TypeORM
-   Caching : Redis
-   Authentication : JWT
-   Containerization : Docker
-   API Documentation : Swagger

* * * * *

Future Improvements
-------------------

-   Implement unit tests to achieve >85% coverage.
-   Add refresh token mechanism for JWT.
-   Introduce rate limiting to prevent abuse.
-   Enhance error handling for production environments.
-   Build a frontend interface for better user interaction.

* * * * *

Contribution
------------

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss the proposed changes.


* * * * *

This Markdown file is clean, professional, and easy to read. It includes all the necessary sections in a structured format, making it suitable for sharing on GitHub. Let me know if you'd like further adjustments!
