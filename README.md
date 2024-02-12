# Victorious Sports Complex

Backend service for managing sports classes and users of the sports complex.

The project is written in NestJS with Swagger's API documentation and tested using Jest tests.

## Project Description

The Victorious Sports Complex project is a backend service designed to manage sports classes, customers and admins of the sports complex. It provides a comprehensive solution for handling various aspects of the sports complex operations.

Purpose of this project is to make the organization of classes, user registrations and applications to specific classes easier for administrators. By automating these processes, the sports complex can operate more efficiently and provide a better experience for its members.

The goals of the project include:

- Creating a user-friendly interface for administrators to manage classes and users.
- Implementing authentication and authorization mechanisms for secure management.

## Features

- Class management: Allows administrators to create, update, and delete sports classes.
- User management: Provides functionality for administrators to manage users and functionality for users to register and login.
- Authentication: Implements authentication based on a JWT token to ensure secure access to the system.
- Authorization: Enforces role based acces control to restrict certain actions.
- API endpoints: Defines API endpoints for interacting with the backend service.
- Database integration: Integrates with a MongoDB database to store and retrieve data.
- Error handling: Implements error handling mechanisms to provide meaningful error messages to users.
- Testing: Includes unit tests and integration tests to ensure that the code is written properly without errors.

## Installation

Clone the github repository and install the required npm packages:

```bash
git clone https://github.com/codingSince9/sport-complex-server
cd sport-complex-server/
npm install
```

## Configuration

The sports complex server requires a MongoDB database to store class and user information.
You can create a free MongoDB database at [https://www.mongodb.com/](https://www.mongodb.com/).

- Create a new project
- Deploy a free M0 database
- Select authentication with Username and Password
- Create a user with username and password
- Connect from "My Local Environment" and add your IP to the access list
- On the overview site choose Connect > Drivers > Node.js and copy the connection string to the .env file

In the .env file in the server/ directory, replace the MONGO_DATABASE_URI variable with your MongoDB connection string.

```bash
MONGO_DATABASE_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER_NAME>.hhu2amy.mongodb.net/?retryWrites=true&w=majority
MONGO_TEST_DATABASE_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER_NAME>.hhu2amy.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES=<YOUR_TIME_UNTIL_TOKEN_EXPIRATION>
```

Repeat the procces if you want to execute unit tests and replace the MONGO_TEST_DATABASE_URI connection string

## Running the application

To run the app, you will need to execute the following command:

```bash
npm run start
```

## Usage

Since Swagger is part of the application you can interact with the app using the following api:
[Swagger API](https://localhost:3000/api)
All of the methods and objects required to run the methods successfully are described in the API.

- If you want to register a "ADMIN" user you need to provide the email with the "@victorious" domain since the complex management is believed to have their own work e-mail account.
- Other users will by default have a "USER" role which can be changed by a "ADMIN" user.

-When registering a user, password must be provided two times for confirmation.

-Users can then view all classes, filter classes by their name, view details and apply to a specific sports class.

- Administrators can view and edit information of all users.
- Only administrators can create, update and delete a sport, role or a sports class.
- For creation of a sports class multiple requirements need to be passed.
- For instance a sports class can not be created unless the sport itself does not exist in the database.
  Within the sports class, administrators can edit the students that applied to it, as well as all of the informations about it

- A sports class has a start and an end date as well as the weekly schedule that is written in days of the week.
- Sports class has an application deadline after which users can no longer apply to the class.
- Start, end and deadline dates have a date format of MM/DD/YYYY.
- For example a sports class can start on 03.01.2024 and end on 12.31.2024. with the deadline being for example 3 days after the class begins (if the admin thinks that the student can catch up to the class until that point).
  - The deadline is at least on the day at the specific time that the class starts.
  - For example if the class starts on 03.01.2024 @ 17:00 the deadline is at least until the same time (03.01.2024 @ 17:00).
