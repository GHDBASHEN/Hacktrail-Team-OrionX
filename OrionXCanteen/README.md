
# OrionX: Baquet and Catering System for Deandra

This is the Baquet and Catering System for Deandra, developed using **React.js** for the frontend and **Express.js** for the backend.

## Project Setup

To set up and run this project locally, follow these steps:

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/pathuGIT/OrionX.git
cd OrionX
```

### 2. Setup the Backend

1. Navigate to the **backend** directory:

   ```bash
   cd backend
   ```

2. Install the backend dependencies:

   ```bash
   npm install
   ```

3. **Create the `.env` file** in the `backend` directory and configure necessary environment variables for your application. Example:

   ```
   PORT=8000
   
   ```

4. **Create a `.gitignore` file** in the `backend` directory to ignore sensitive files and dependencies:

   ```
   node_modules/
   .env
   ```

### 3. Setup the Frontend

1. Navigate to the **frontend** directory:

   ```bash
   cd ../frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. **Create the `.env` file** in the `frontend` directory and add the environment-specific variables. Example:

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Create a `.gitignore` file** in the `frontend` directory to ignore unnecessary files:

   ```
   node_modules/
   .env
   ```

### 4. Running the Project

To run both the backend and frontend:

1. **Start the Backend**:
   
   Navigate to the backend folder and run:

   ```bash
   npm start
   ```

   The backend server will be running at `http://localhost:5000` (or your configured port).

2. **Start the Frontend**:

   Navigate to the frontend folder and run:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000` by default.

### 5. Additional Configuration

Ensure you have the required tools installed for both the frontend and backend:

- **Node.js**: Version 14 or later is recommended.
- **mysql** (for the backend): Make sure Mysql is running locally.

---

## Folder Structure

```
/OrionX
|-- /backend
|   |-- /controllers
|   |-- /models
|   |-- /routes
|   |-- .env
|   |-- .gitignore
|   |-- server.js
|
|-- /frontend
|   |-- /src
|   |-- .env
|   |-- .gitignore
|   |-- package.json
|
|-- README.md
```

---

## Conclusion

Now you're all set up to start working on **OrionX**! You can modify, extend, or deploy the application as needed. If you run into any issues, feel free to open an issue in the repository.

---
