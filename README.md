# myCryptoFolio - Backend

This is the backend server for the myCryptoFolio application. It is built with Node.js, Express, and MongoDB.

## Features
- **User Authentication:** Secure user registration and login with hashed passwords, JWT tokens, and cookies.
- **Portfolio Management:** APIs to add, edit, and delete transactions for each cryptocurrency.
- **Email Notifications:** Reset password and account verification through email using Nodemailer.
- **Data Validation:** Uses Joi for data validation.
- **Rate Limiting:** Protects APIs from excessive requests using express-rate-limit.
- **Unit Testing:** Implements tests using Jest.
- **Automatic Restart:** Uses Nodemon for automatic server restarts during development.

## Technologies Used
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **Express-rate-limit**
- **Argon2**
- **Cookie Parser**
- **JSON Web Token**
- **Nodemailer**
- **Joi**
- **Jest**
- **Nodemon**

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/boris-picard/mycryptofolio-backend.git
    cd mycryptofolio-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file with the following content:
    ```plaintext
    MONGO_URI=your_mongo_db_uri
    JWT_SECRET=your_jwt_secret
    PORT=3001
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

5. The server will start on `http://localhost:3001`.

## API Endpoints

### Auth Routes
- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/signin`: Login a user.
- `POST /api/auth/refresh-token`: Refresh JWT token.
- `POST /api/auth/resend-email`: Resend verification email.
- `POST /api/auth/forgot-password`: Send reset password email.
- `POST /api/auth/reset-password`: Reset password.
- `GET /api/auth/user`: Get user details.
- `GET /api/auth/verify-email`: Verify user email.
- `DELETE /api/auth/logout`: Logout a user.

### Coin Routes
- `POST /api/coins/createTransaction`: Create a new coin and transaction.
- `GET /api/coins/detailed/:id`: Get detailed transactions for a coin.
- `PUT /api/coins/:id`: Update a coin.

### Transaction Routes
- `POST /api/transactions/name/:name`: Create a new transaction for a specific coin.
- `GET /api/transactions/portfolio`: Get all coins in the portfolio.
- `GET /api/transactions/id/:id`: Get a specific coin by ID.
- `GET /api/transactions/name/:name`: Get a specific coin by name.
- `PUT /api/transactions/id/:id`: Update a specific transaction.
- `DELETE /api/transactions/:id`: Delete a coin and its transactions.
- `DELETE /api/transactions/id/delete/:id`: Delete a specific transaction.

## Scripts

- `npm start`: Starts the production server.
- `npm run dev`: Starts the development server with Nodemon.
- `npm test`: Runs the test suite using Jest.

## Contributing

Contributions are welcome! Please create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
