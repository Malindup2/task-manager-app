# Task Manager App
<img width="1581" height="701" alt="image" src="https://github.com/user-attachments/assets/15258527-e063-49e3-9f03-46d463a787df" />


**Full Stack Application — Angular + Spring Boot + MySQL**

---

## Overview
A full-stack Task Manager web application built with Angular (frontend), Spring Boot (backend), and MySQL (database). Supports full CRUD operations, JWT-based authentication, and Docker deployment.

---

## Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular 17, Angular Material, TypeScript |
| **Backend** | Spring Boot 3.2, Java 17, Maven |
| **Database** | MySQL 8 |
| **Auth** | JWT (JSON Web Tokens) + Spring Security |
| **Deployment** | Docker + Docker Compose |

---

## Project Structure
```text
task-manager-app/
├── backend/                  ← Spring Boot REST API
│   └── src/main/java/com/treinetic/taskmanager/
│       ├── controller/
│       ├── service/impl/
│       ├── repository/
│       ├── model/
│       ├── dto/
│       ├── exception/
│       └── config/
├── frontend/                 ← Angular App
│   └── src/app/
│       ├── components/
│       ├── services/
│       ├── models/
│       └── guards/
├── docker-compose.yml
└── README.md
```

---

## Prerequisites
- **Java 17+**
- **Node.js 18+** and **npm**
- **Angular CLI**: `npm install -g @angular/cli`
- **MySQL 8** (or use Docker)
- **Maven 3.8+**
- **Docker & Docker Compose** (for Docker setup)

---

## Getting Started

### 1. Backend Setup (Spring Boot)
#### Configure the Database
Open `.env` in the root folder (or `backend/treinetic/src/main/resources/application.yml`) and update:
```properties
DB_URL=jdbc:mysql://localhost:3306/taskmanager_db?createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_jwt_secret_key_make_it_long_and_secure_123456789
```

#### Run the Backend
```bash
cd backend/treinetic
mvn clean install
mvn spring-boot:run
```
*Backend runs on: http://localhost:8080*

### 2. Frontend Setup (Angular)
```bash
cd frontend
npm install
ng serve
```
*Frontend runs on: http://localhost:4200*

### 3. Run with Docker Compose
To run the entire stack (MySQL + Spring Boot + Angular) with a single command:
```bash
docker-compose up --build
```

| Service | URL |
| :--- | :--- |
| **Frontend** | [http://localhost:4200](http://localhost:4200) |
| **Backend API** | [http://localhost:8080](http://localhost:8080) |
| **MySQL** | localhost:3306 |

---

## API Endpoints

### Task Endpoints
| Method | URL | Description |
| :--- | :--- | :--- |
| **GET** | `/api/tasks` | Get all tasks |
| **GET** | `/api/tasks/{id}` | Get task by ID |
| **POST** | `/api/tasks` | Create a new task |
| **PUT** | `/api/tasks/{id}` | Update a task |
| **DELETE** | `/api/tasks/{id}` | Delete a task |

### Auth Endpoints
| Method | URL | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login and receive JWT token |

---

## JWT Authentication
All task API endpoints are protected and require a valid JWT token.

### How to Authenticate
1.  **Register** a new account via the `/register` page (or API `POST /api/auth/register`).
2.  **Login** with your new credentials via the `/login` page (or API `POST /api/auth/login`).
3.  The Angular interceptor will automatically attach the received JWT to all subsequent requests.

---

## Database Setup
The database `taskmanager_db` is auto-created on first run via:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
```

### Tables Created Automatically
- **tasks** — stores all task records
- **users** — stores registered user accounts

### Task Status Values
- `TO_DO`
- `IN_PROGRESS`
- `DONE`

---

## Features
### Core Features
- Create, view, edit, and delete tasks
- Filter tasks by status
- Form validation with error messages
- Responsive UI with Angular Material

### Bonus Features
- JWT-based authentication (register, login, protected routes)
- Auth guard on Angular routes
- Full Docker Compose setup for one-command deployment
