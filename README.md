# node-prisma-structure

The `node-prisma-structure` npm package is designed to simplify the setup of authentication APIs in your project. It allows you to quickly copy a predefined project structure, install all the required dependencies, and get your project up and running. This package is particularly useful for creating projects with a consistent and reusable authentication system.

[![npm version](https://badge.fury.io/js/node-prisma-structure.svg)](https://badge.fury.io/js/node-prisma-structure)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)


## Features
- Quickly sets up a predefined project structure for authentication APIs.
- Automatically installs all required dependencies.
- Supports Prisma for database handling.
- Saves time and ensures consistency across projects.
- Provides a ready-to-run setup.

## How to Install
To install the package, run the following command:
```bash
  npm i node-prisma-structure
```
or
```bash
  yarn i node-prisma-structure
```

# How to Publish
After installing the package, follow these steps:

- Run the following command to copy the project structure and API files into your project:

```bash
  npx create-prisma-structure
```

- Set up your `.env` file:
    - Add the necessary environment variables required for your project.
    - Ensure the `DATABASE_URL` for Prisma is properly configured.


## How to configure

### Generate Prisma client:
Run the following Prisma command to generate the client:

```bash
  npx prisma generate
```

### Publish Prisma Database:
Run the following Prisma command to publish database:

```bash
  npx prisma migrate dev
```

### Import necessary libraries
In your main run file (e.g., `index.js`, `server.js`, `app.js`, etc.), you need to import the required modules:

```javascript
// Load environment variables
require("dotenv").config(); // Add this line if not present

// Import necessary libraries
const express = require('express');
const { createDoc } = require('node-api-document');
const apiDoc = require('./api-doc');
const apiPath = require('./modules/api');
```

### Configure Express
Create an instance of `express` and configure it:

```javascript
const app = express();
```

### API Configuration
Next, configure the middleware for parsing incoming requests:

```javascript
// API Config
app.use(express.json()); // Parse JSON request bodies
app.use(express.text()); // Parse text request bodies
```

### Set Up API Routes
Map your API paths to the `express` application:

```javascript
// Auth API Path Mapping
app.use('/v1/', apiPath);
```

### Add API Documentation (Optional)
You can also generate API documentation using `node-api-document`. Set it up like this:

```javascript
// API Documentation mapping
createDoc(app, 'api-key, token, accept-language, z-user-ip', apiDoc);
```


### Full Code Example
Here is the full code for the main file to use the authentication API:


```javascript
require("dotenv").config(); // Add this line if not present
const express = require('express');
const { createDoc } = require('node-api-document');
const apiDoc = require('./api-doc');
const apiPath = require('./modules/api');
const app = express();

// API Config
app.use(express.json());  // Parse JSON request bodies
app.use(express.text());  // Parse text request bodies

// Auth API Path Mapping
app.use('/v1/', apiPath);

// API Documentation mapping
createDoc(app, 'api-key, token, accept-language, z-user-ip', apiDoc);

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000');
});
```

### Setup Sentry for Error Monitoring
To set up Sentry for error tracking, run the following command:
```bash
npx @sentry/wizard@latest -i sourcemaps
```

### Start your project

- If `nodemon` is installed, use the following command to start the project:

```bash
  nodemon index.js
```

- If `nodemon` is not installed, start the project with:

```bash
  node index.js
```

## 🔖 Notes
- Ensure that your `.env` file is properly configured with the correct database URL and API keys for seamless integration.
- The `createDoc` function automatically generates API documentation based on your API's main path. Once set up, the documentation can be accessed at the following endpoint: `http://localhost:3000/api-doc/`.
- You can customize the port number in the `app.listen()` method to suit your project’s configuration.

## 📌 Prerequisites
- **Node.js**: Ensure you have Node.js installed on your system with version **20.12.0** or higher.
- **Prisma**: Make sure you have Prisma configured for database handling.
- **Environment Variables**: Properly configure the .env file as per your project requirements.


## 🤝 Contributing

Feel free to submit issues or pull requests for new features, bug fixes, or general improvements.


## 🔗 Author Details
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://www.tirth-gaudani.ct.ws/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://in.linkedin.com/in/tirthgaudani)


## License

[MIT](https://choosealicense.com/licenses/mit/)
