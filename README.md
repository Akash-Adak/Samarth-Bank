
<div align="center">

# 🏦 VASTA – AI-Powered Enterprise Banking System

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![Java](https://img.shields.io/badge/Java-21-orange)
![Kafka](https://img.shields.io/badge/Kafka-Event%20Driven-black)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-purple)

**VASTA** is a production-ready, AI-enabled banking platform built using **Spring Boot microservices**,  
**event-driven architecture**, and **cloud-native DevOps practices**.

</div>

---

## 🚀 Key Highlights

- Microservices-based banking system
- AI-powered fraud detection & loan risk analysis
- Secure JWT (RS256) authentication
- Kafka-based event-driven communication
- Redis token management
- Centralized monitoring (Prometheus + Grafana)
- Fully Dockerized – runs on any machine

---

## 🧠 AI Capabilities

| Feature | Description |
|------|-------------|
| Fraud Detection | Real-time transaction risk scoring |
| Loan Risk Analysis | AI-based approval probability |
| Spending Insights | Smart expense categorization |
| Priority Alerts | Risk-based notifications |

AI services are **separate microservices** (Python) communicating via REST — real enterprise design.

---

## 🏗️ Architecture Overview

```

Client → API Gateway → Microservices → Kafka → Notifications
↓
AI Engine

````

**Core Services**
- Auth Service
- User Service
- Account Service
- Transaction Service
- Loan Service
- Notification Service
- AI Risk Engine

---

## 🛠️ Tech Stack

**Backend**
- Spring Boot 3.x, Java 21
- Spring Cloud Gateway, Eureka
- Spring Security + JWT (RS256)

**Data & Messaging**
- MySQL, Redis
- Apache Kafka

**AI**
- Python (FastAPI)
- Scikit-Learn / ML Models

**DevOps & Monitoring**
- Docker, Docker Compose
- Prometheus, Grafana

---

## 🐳 Run on Any Machine (Docker)

### Prerequisites
- Docker
- Docker Compose

### Start the System
```bash
git clone https://github.com/Akash-Adak/Banking-system.git
cd Banking-system
docker-compose up -d
````

No Java, Maven, or MySQL installation required.

---

## 🌐 Service Ports

| Service      | Port |
| ------------ | ---- |
| API Gateway  | 8080 |
| Eureka       | 8761 |
| Auth         | 8081 |
| User         | 8082 |
| Account      | 8083 |
| Transaction  | 8084 |
| Loan         | 8086 |
| Notification | 8085 |
| AI Engine    | 8090 |
| Kafka        | 9092 |
| MySQL        | 3306 |
| Redis        | 6379 |
| Grafana      | 3000 |

---

## 🔐 Security

* JWT Authentication (RS256)
* Role-Based Access Control
* Redis token revocation
* Encrypted passwords (BCrypt)

---

## 📊 Monitoring

* Application metrics via Prometheus
* Pre-configured Grafana dashboards
* Health checks via Spring Actuator

---

## 💼 Interview-Ready Summary

> **VASTA** is an enterprise-grade, AI-powered banking platform built using Spring Boot microservices, Kafka, Docker, and cloud-native monitoring.
> AI services handle fraud detection and loan risk scoring in real time, fully decoupled from core banking services.

---

## 📜 License

MIT License © 2026

```


