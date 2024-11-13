Login and Sign-Up App
Live App Link - https://login-app-by-faiz.onrender.com/

**Overview**
This is a full-stack login and sign-up application built with JavaScript, Express, and MongoDB Atlas. The app allows users to create an account, log in with their credentials, and access different features based on their selected role. It’s designed to be simple and secure, with JWT authentication and password hashing using bcryptjs.

**Features**

User Registration: New users can create an account with a secure password, which is hashed with bcryptjs.

User Login: Users can log in with their registered credentials. On successful login, they receive a JWT token for session management.

Role Selection: Users can select a role (e.g., Admin or User) during registration.

Admin Access: Admin users have access to view all registered users’ data, enabling an overview of user accounts.

JWT Authentication: Secure login with JSON Web Tokens (JWT) to maintain user sessions without storing sensitive data on the client side.

MongoDB Atlas: Data is stored remotely in MongoDB Atlas, a cloud-based NoSQL database.

Front-End: The front end is built using vanilla JavaScript, keeping it simple and lightweight.

Tech Stack

Front-End: JavaScript, HTML, CSS

Back-End: Node.js, Express.js

Database: MongoDB Atlas (cloud-based NoSQL database)

Security: bcryptjs for password hashing, JWT for session handling

Clone the Repository:

git clone https://github.com/MashooqAli9140/Login_app.git

cd Login_app

npm install

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

PORT=your_port

node server.js
