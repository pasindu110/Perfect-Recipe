# Spring Boot + React Full Stack Application

This is a full-stack application using Spring Boot for the backend and React for the frontend.

## Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- Maven
- npm or yarn

## Project Structure

```
.
├── backend/                # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/example/fullstackapp/
│   │       │       ├── controller/
│   │       │       └── FullstackApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
└── frontend/              # React frontend
    ├── public/
    └── src/
        ├── App.js
        ├── App.css
        └── index.js
```

## Running the Application

### Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
3. The backend will be available at `http://localhost:8080`

### Frontend (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/hello` - Returns a hello message from the backend

## Features

- Spring Boot 3.2.3
- React 18
- H2 Database
- JPA for data persistence
- RESTful API
- Modern React with Hooks
- Axios for API calls 
