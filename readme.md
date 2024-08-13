
# Betting Dashboard

This project is a comprehensive betting dashboard application designed to offer a seamless user experience for placing bets on various sports events. The application is composed of a robust Node.js backend powered by Express and TypeORM, coupled with a modern React frontend using Vite for rapid development and TypeScript for type safety.

## Tech Stack Overview

### Backend
- **Node.js**: JavaScript runtime environment for building scalable server-side applications.
- **Express**: Lightweight web framework for Node.js, enabling fast API development.
- **TypeORM**: Object-Relational Mapper (ORM) for TypeScript and JavaScript, simplifying database interactions.
- **PostgreSQL**: A powerful, open-source relational database for data storage.
- **Docker**: Platform for developing, shipping, and running applications in isolated containers.

### Frontend
- **React**: Popular JavaScript library for building dynamic and interactive user interfaces.
- **Vite**: Modern frontend build tool that provides a fast development environment.
- **TypeScript**: Strongly typed superset of JavaScript that enhances code reliability and maintainability.
- **Tailwind CSS**: Utility-first CSS framework for quickly styling UI components.

## Project Structure

```
.
├── backend/
│   ├── .env
│   ├── Dockerfile
│   ├── logs/
│   │   ├── combined.log
│   │   └── errors.log
│   ├── package.json
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── entities/
│   │   ├── index.ts
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── utils/
│   ├── tsconfig.json
│   └── ...
├── docker-compose.yml
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   ├── README.md
│   ├── src/
│   │   ├── api/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── ...
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```

## Development Approach

### Backend
The backend of this application is designed using Express and TypeORM. It interfaces with a PostgreSQL database, providing a RESTful API for frontend consumption. The database schema is constructed using TypeORM entities, ensuring consistency and flexibility. Additionally, a seeding script is available to populate the database with initial data, facilitating easier development and testing.

### Frontend
The frontend is engineered with React, leveraging Vite for a highly efficient development process. The UI is constructed with reusable components, styled using Tailwind CSS for a clean and modern design. TypeScript is employed across the frontend to enhance code quality and prevent errors, ensuring a smooth user experience.

## Running the Application

### Prerequisites
Ensure you have the following installed on your development machine:
- **Docker**
- **Docker Compose**

### Getting Started

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Start the application using Docker Compose:**
    ```sh
    docker-compose up --build
    ```

    This command will:
    - Build Docker images for both backend and frontend.
    - Launch PostgreSQL, backend, and frontend services in separate containers.

3. **Access the application:**
    - **Backend API**: `http://localhost:8083`
    - **Frontend**: `http://localhost:5137`

4. ***Login with seeded user:**
    - email: user1@example.com
    - password: password123

### Additional Commands

- **Stop the application:**
    ```sh
    docker-compose down
    ```

- **View logs:**
    ```sh
    docker-compose logs -f
    ```

This structured approach ensures the Betting Dashboard is easy to deploy, maintain, and scale. The combination of Docker for containerization, React for the frontend, and Node.js with TypeORM for the backend makes this a robust and modern web application solution.

<img width="974" alt="image" src="https://github.com/user-attachments/assets/b736fb02-3127-42ed-a887-6c4068d97fbc">


### Improvements List

- BACKEND
  > Integration Tests - JEST + SUPERTEST for the Controlllers and APIS
  > Cache Layer with REDIS
  > Repository pattern to make it less dependent on the implementation and library
  > Security - The JWT implementation was a basic one without token refresh or invalidation
  > Monitoring tool
- FRONTEND
  > Component Test
  > E2E Test with Cypress or playright
  > Component refinement (For the time constraints some components was attached to the screens)
  > Segregation of the logic and dummy components (I love the approach to have the logic complete apart from the component rendering (dummy components))
  > Server components (Maybe?)





