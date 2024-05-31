# Multi-Step Form Backend

## Overview

This backend project complements the frontend part of the Multi-Step Form Project. It is designed to handle data persistence and API endpoint management using Node.js, Express, MongoDB, and Mongoose. The backend facilitates storing and retrieving transaction data and other necessary operations to support the frontend functionalities.

## Objectives

- **Node.js and Express Integration:** Utilize Node.js and Express to create a robust server-side application, handling API requests and managing routing.
- **MongoDB with Mongoose:** Implement MongoDB for data persistence and Mongoose for object data modeling, ensuring seamless interaction between the server and the database.
- **API Endpoints for Transactions:** Create and manage API endpoints to handle transactions, supporting CRUD operations for the frontend application.

## Features

- **CRUD Operations:** Implement Create, Read, Update, and Delete operations for transactions.
- **Data Validation and Error Handling:** Ensure data integrity with appropriate validation and provide clear error messages for failed operations.
- **Modular and Maintainable Code:** Organize the backend code into modular components for better maintainability and scalability.

## API Endpoints

1. **Create Transaction**

   - **Method:** POST
   - **Endpoint:** `/api/transaction`
   - **Description:** Create a new transaction with details such as coin name, quantity, price, total spent, and transaction date.
   - **Request Body:**
     ```json
     {
       "name": "Bitcoin",
       "quantity": 1.5,
       "price": 45000,
       "spent": 67500,
       "date": "2023-05-31"
     }
     ```
   - **Response:** Returns the created transaction object.

2. **Get All Transactions**

   - **Method:** GET
   - **Endpoint:** `/api/transaction`
   - **Description:** Retrieve a list of all transactions.
   - **Response:** Returns an array of transaction objects.

3. **Get Transaction by ID**

   - **Method:** GET
   - **Endpoint:** `/api/transaction/:id`
   - **Description:** Retrieve details of a specific transaction by its ID.
   - **Response:** Returns the transaction object.

4. **Delete Transaction**

   - **Method:** DELETE
   - **Endpoint:** `/api/transaction/:id`
   - **Description:** Delete a specific transaction by its ID.
   - **Response:** Returns a success message upon successful deletion.

## How to Run the Backend

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/backend-form-template.git
   ```

2. **Install Dependencies:**

   ```bash
   cd backend-form-template
   npm install
   ```

3. **Set Up Environment Variables:**
   
   Create a `.env` file in the root of your project and add the following environment variables:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
   PORT=3001
   ```

4. **Run the Development Server:**

   ```bash
   npm start
   ```

**Note:** Make sure MongoDB is running and accessible with the provided connection string.

## Project Structure

```
backend-form-template/
├── controllers/
│   └── transactionsController.js
├── models/
│   └── Transaction.js
├── routes/
│   └── transactionRoutes.js
├── .env
├── server.js
├── package.json
└── README.md
```

- **controllers/**: Contains the logic for handling API requests.
- **models/**: Contains the Mongoose models for database schemas.
- **routes/**: Defines the routes for API endpoints.
- **server.js**: The main entry point for the application.
- **.env**: Environment variables for configuration.

## Conclusion

This backend project is essential for handling the data persistence and API management required by the frontend of the Multi-Step Form Project. By using Node.js, Express, MongoDB, and Mongoose, it ensures a robust and scalable server-side application, enabling efficient data operations and seamless integration with the frontend.

---

By following these instructions, you should be able to set up and run the backend part of your Multi-Step Form Project successfully. This README provides a comprehensive guide to the backend structure, functionality, and setup process.





