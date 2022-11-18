# NC News

## Hosted Version
Click this link for the hosted version of this project: https://real-gray-elephant-ring.cyclic.app

## Project Summary

This is an API for the purpose of accessing application data programmatically. This API mimics a backend news service (such as reddit) which can provide information to a front end architecture.
It utilises a PSQL database, interacted with using node-postgres.

## Setup

Before you can run this API locally, you'll first need to:

### Clone this repository to your local machine
- Fork this repo to your own github account
- Then you can make a local copy of the repo by running git clone <link-to-forked-repo-here>
- You should now be able to access this repo locally.

### Install dependencies
- Install all dependencies listed in the `package.json` using the `npm install` command.

### Seed local database
- Install and start running Postgres
- Use the provided "setup-dbs" and "seed" scripts to create the database, also listed in the `package.json`

### Run tests
- If you head over to `/__tests__/app.test.js` you'll see a test suite that provides integration testing of all the available endpoints. 
- Ensure you have installed Jest, Supertest, Jest-Extended, and Jest-Sorted - these are listed in the dev-dependencies in the `package.json`.
- Run the tests using the provided script `npm test`.

### Create environment variables
There are two databases in this project. One for real looking *dev data* and another for simpler *test data*.

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored.

## Node and Postgres requirements

Specify minimum versions of `Node.js` and `Postgres` needed to run the project
This projected was created using:
- Node.js v18.0.0
- PostgreSQL 14.5 (Homebrew)

It is recommended that you have a minimum of these versions installed to run this project.