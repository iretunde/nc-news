#  News API

This is a RESTful API built using Node.js, Express.js, and PostgreSQL. It provides endpoints for fetching and interacting with articles, topics, comments, and users.

1. Installation
Clone the repository:

git clone <repository_url>


2. Install dependencies:

Dependencies:

express: Fast, minimalist web framework for Node.js.
pg: PostgreSQL client for Node.js.
dotenv: Loads environment variables from a .env file into process.env.
cors: Enables Cross-Origin Resource Sharing for making requests from different domains.
jest: JavaScript testing framework.
supertest: A library for testing Node.js HTTP servers.

Development Dependencies:

nodemon: Automatically restarts the server on file changes during development.
eslint: Linter for maintaining coding style and syntax.
jest-sorted: Jest matchers for testing sorted arrays.

bash
Copy code
3. Do npm install
Set up your PostgreSQL database with the required schema and data. You can find the database names in the setup.sql file.

4. Create a .env file in the root folder and add your PostgreSQL credentials:
PGDATABASE=your_database_name

5. Run npm start

6. Running Tests
Before running tests, you need to set up your test and development databases. Run the following command:
npm run setup-dbs
Then, run the test suite using:
npm test


7. Error Handling

The API provides appropriate error responses for invalid requests, missing data, or server issues:

400: Bad Request
404: Not Found
500: Internal Server Error


