# 🏦 VASTA Bank

<div align="center">

![VASTA Bank Logo](vasta-bank-logo.png)

**Enterprise-Grade Banking Platform**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/)

[//]: # ([![Kafka]&#40;https://img.shields.io/badge/Apache-Kafka-black&#41;]&#40;https://kafka.apache.org/&#41;)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

[Live Demo](https://vasta-bank.vercel.app/) · [Documentation](docs/) · [Report Bug](https://github.com/Akash-Adak/VASTA-Bank/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Monitoring](#-monitoring)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**VASTA Bank** is a production-ready, microservices-based banking system designed for scalability, security, and real-time operations. Built with Spring Boot and cloud-native technologies, it provides a comprehensive solution for modern digital banking needs.

### Why VASTA Bank?

- **Production-Ready**: Enterprise-grade architecture with proven design patterns
- **Scalable**: Microservices architecture that scales horizontally
- **Secure**: JWT-based authentication with RS256 encryption
- **Real-Time**: Event-driven architecture using Apache Kafka
- **Observable**: Built-in monitoring with Prometheus and Grafana
- **Cloud-Native**: Fully containerized with Docker

---

## ✨ Features

### Core Banking Operations
- 👤 **User Management** - Complete user lifecycle with KYC
- 💰 **Account Services** - Multiple account types (Savings, Current, Fixed Deposit)
- 💸 **Transactions** - Real-time money transfers with audit trails
- 🏦 **Loan Services** - Loan application, approval, and management
- 📊 **Account Statements** - Transaction history and reporting

### Advanced Capabilities
- 🔐 **Secure Authentication** - JWT with RS256 algorithm
- 📢 **Real-Time Notifications** - Email, SMS, and in-app notifications
- 🔄 **Event-Driven Architecture** - Asynchronous processing with Kafka
- 📈 **Monitoring & Metrics** - Application health and performance tracking
- 🚀 **API Gateway** - Unified entry point with routing and load balancing

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  API Gateway    │ ──→ Eureka Discovery
│   (Port 8080)   │
└────────┬────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌─────────┐                  ┌─────────┐
│  Auth   │                  │  User   │
│ Service │                  │ Service │
│  :8081  │                  │  :8082  │
└────┬────┘                  └────┬────┘
     │                            │
     └──────────┬─────────────────┘
                │
    ┌───────────┼───────────────┐
    ▼           ▼               ▼
┌─────────┐ ┌─────────┐  ┌──────────┐
│ Account │ │Transaction│ │   Loan   │
│ Service │ │ Service   │ │ Service  │
│  :8083  │ │  :8084    │ │  :8086   │
└────┬────┘ └────┬──────┘ └────┬─────┘
     │           │              │
     └───────────┼──────────────┘
                 │
                 ▼
         ┌──────────────┐
         │    Kafka     │
         │   :9092      │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │Notification  │
         │  Service     │
         │   :8085      │
         └──────────────┘
```

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| **API Gateway** | 8080 | Entry point, routing, and load balancing |
| **Eureka Server** | 8761 | Service discovery and registration |
| **Auth Service** | 8081 | Authentication and JWT token management |
| **User Service** | 8082 | User profile and KYC management |
| **Account Service** | 8083 | Account creation and balance management |
| **Transaction Service** | 8084 | Money transfers and transaction history |
| **Notification Service** | 8085 | Email and SMS notifications |
| **Loan Service** | 8086 | Loan application and management |

---

## 🛠️ Tech Stack

### Backend
- **Java 21** - Latest LTS version
- **Spring Boot 3.x** - Framework for microservices
- **Spring Cloud** - Gateway, Config, Eureka
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database interactions

### Database & Cache
- **MySQL** - Primary database
- **Redis** - Token management and caching

### Messaging & Events
- **Apache Kafka** - Event streaming platform
- **Kafka Connect** - Data integration

### Monitoring & Observability
- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards
- **Spring Actuator** - Health checks and metrics

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipelines

### Frontend
- **React.js** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling

---

## 🚀 Getting Started

### Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Git**

> **Note**: Java, Maven, and MySQL are NOT required on your machine. Everything runs in Docker containers.

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Akash-Adak/VASTA-Bank.git
cd VASTA-Bank
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Wait for services to initialize** (~2-3 minutes)
```bash
docker-compose logs -f
```

4. **Access the application**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761
- Grafana: http://localhost:3000

### Default Credentials

**Application**
- Email: `demo@vastabank.com`
- Password: `Demo@123`

**Grafana**
- Username: `admin`
- Password: `admin`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication

All protected endpoints require a JWT token in the header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Authentication
```http
POST /auth/register      - Register new user
POST /auth/login         - Login and get JWT token
POST /auth/logout        - Logout and invalidate token
POST /auth/refresh       - Refresh expired token
```

#### User Management
```http
GET    /users/profile    - Get user profile
PUT    /users/profile    - Update user profile
POST   /users/kyc        - Submit KYC documents
```

#### Accounts
```http
GET    /accounts         - List all accounts
POST   /accounts         - Create new account
GET    /accounts/{id}    - Get account details
PUT    /accounts/{id}    - Update account
DELETE /accounts/{id}    - Close account
```

#### Transactions
```http
GET    /transactions              - List transactions
POST   /transactions/transfer     - Transfer money
GET    /transactions/{id}         - Get transaction details
GET    /transactions/statement    - Download statement
```

#### Loans
```http
GET    /loans           - List all loans
POST   /loans           - Apply for loan
GET    /loans/{id}      - Get loan details
POST   /loans/{id}/pay  - Make loan payment
```

For complete API documentation, visit `/swagger-ui.html` when the application is running.

---

## 📊 Monitoring

### Prometheus Metrics

Access Prometheus at `http://localhost:9090`

Key metrics tracked:
- Request rates and latencies
- Database connection pool stats
- JVM memory and CPU usage
- Kafka consumer lag
- Custom business metrics

### Grafana Dashboards

Access Grafana at `http://localhost:3000`

Pre-configured dashboards:
1. **System Overview** - Overall health and performance
2. **Service Metrics** - Individual microservice statistics
3. **Database Metrics** - Query performance and connection pools
4. **Kafka Metrics** - Message throughput and consumer lag

---

## 🔒 Security

### Authentication Flow

```
1. User logs in → Auth Service validates credentials
2. Auth Service generates JWT (RS256) with claims
3. Token stored in Redis with TTL
4. Client includes token in subsequent requests
5. API Gateway validates token before routing
```

### Security Features

- **RS256 JWT** - Asymmetric encryption for tokens
- **Password Hashing** - BCrypt with configurable strength
- **Token Revocation** - Redis-based blacklist
- **Role-Based Access** - Fine-grained permissions (USER, ADMIN, MANAGER)
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Request payload sanitization
- **SQL Injection Prevention** - Parameterized queries

### Best Practices

- Tokens expire after 24 hours
- Refresh tokens valid for 7 days
- HTTPS required in production
- Sensitive data encrypted at rest
- Audit logs for all transactions

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=vasta_bank
MYSQL_USER=vastauser
MYSQL_PASSWORD=vastapassword

# Redis
REDIS_PASSWORD=redispassword

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:9092

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Service Configuration

Each microservice has its own `application.yml` in the respective service directory. Common configurations:

```yaml
server:
  port: 8081

spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:mysql://mysql:3306/vasta_bank
    username: ${MYSQL_USER}
    password: ${MYSQL_PASSWORD}

eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
./mvnw test

# Run tests for specific service
cd auth-service
../mvnw test

# Run with coverage
./mvnw clean verify
```

### Test Coverage

Current test coverage: **85%+**

- Unit Tests: JUnit 5 + Mockito
- Integration Tests: TestContainers
- API Tests: REST Assured

---

## 🚢 Deployment

### Docker Compose (Development)

```bash
docker-compose up -d
```

### Kubernetes (Production)

```bash
# Apply configurations
kubectl apply -f k8s/

# Check deployment
kubectl get pods
kubectl get services
```

### CI/CD Pipeline

GitHub Actions workflow automatically:
1. Runs tests on every PR
2. Builds Docker images
3. Pushes to Docker Hub
4. Deploys to staging environment

---

## 📁 Project Structure

```
VASTA-Bank/
├── auth-service/           # Authentication & JWT
├── user-service/           # User management
├── account-service/        # Account operations
├── transaction-service/    # Transaction processing
├── loan-service/           # Loan management
├── notification-service/   # Email & SMS notifications
├── eureka-server/          # Service discovery
├── banking-frontend/       # React frontend
├── docs/                   # Documentation
├── docker-compose.yml      # Docker orchestration
├── pom.xml                 # Maven parent POM
└── README.md               # This file
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java code conventions
- Write unit tests for new features
- Update documentation
- Keep commits atomic and meaningful

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Akash Adak**

- GitHub: [@Akash-Adak](https://github.com/Akash-Adak)
- LinkedIn: [Connect with me](https://linkedin.com/in/akash-adak)

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Apache Kafka for reliable messaging
- Docker for simplifying deployment
- All contributors who helped improve this project

---

## 📞 Support

For support, email akashadak@vastabank.com or join our Slack channel.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Akash Adak

</div>