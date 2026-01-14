# 🏦 VASTA Bank - Enterprise Banking Platform

<div align="center">


**A Modern, Scalable, and Secure Banking System Built with Microservices Architecture**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Kafka](https://img.shields.io/badge/Apache-Kafka-black?style=for-the-badge&logo=apache-kafka)](https://kafka.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis)](https://redis.io/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

</div>

---

## 📋 Table of Contents

- [🎯 What is VASTA Bank?](#-what-is-vasta-bank)
- [🌟 Why Choose VASTA Bank?](#-why-choose-vasta-bank)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [🔧 Development Guide](#-development-guide)
- [📚 API Documentation](#-api-documentation)
- [🔒 Security Implementation](#-security-implementation)
- [📊 Monitoring & Observability](#-monitoring--observability)
- [🧪 Testing Strategy](#-testing-strategy)
- [🚢 Deployment Guide](#-deployment-guide)
- [🔍 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team & Support](#-team--support)

---

## 🎯 What is VASTA Bank?

**VASTA Bank** is a comprehensive, production-ready banking platform that demonstrates modern software engineering practices. It's not just a simple banking application—it's a **fully-featured financial system** designed to handle real-world banking operations at scale.

### The Vision

In today's digital age, traditional banking systems are being transformed. VASTA Bank represents this transformation by implementing:

- **Microservices Architecture** - Breaking down complex banking operations into manageable, independent services
- **Event-Driven Design** - Real-time processing of financial transactions using Apache Kafka
- **Cloud-Native Approach** - Containerized services that can run anywhere, from local development to cloud platforms
- **Security-First Mindset** - Industry-standard security practices including JWT authentication, encryption, and audit trails
- **Developer-Friendly** - Clean code, comprehensive documentation, and easy setup

### Who Is This For?

- **Software Engineers** learning microservices and distributed systems
- **Students** working on final year projects or learning Spring Boot
- **Companies** looking for a starting point for their banking solutions
- **Developers** preparing for technical interviews at fintech companies
- **Architects** studying modern banking system design patterns

---

## 🌟 Why Choose VASTA Bank?

### Production-Ready Features

Unlike typical demo projects, VASTA Bank includes everything you'd find in a real banking system:

| Feature | What You Get | Why It Matters |
|---------|-------------|----------------|
| **Complete Banking Operations** | Account creation, money transfers, loan management, transaction history | Real-world functionality, not just CRUD operations |
| **Microservices Architecture** | 7+ independent services with proper boundaries | Learn how large systems are designed and scaled |
| **Event-Driven Communication** | Kafka-based async messaging | Understand how modern systems handle real-time events |
| **Proper Security** | JWT with RS256, role-based access, token management | Bank-grade security implementation |
| **Full Observability** | Prometheus metrics, Grafana dashboards, health checks | Monitor and debug like production systems |
| **Complete DevOps** | Docker Compose, CI/CD pipelines, automated builds | Deploy anywhere with confidence |
| **Modern Frontend** | React-based UI with responsive design | Full-stack experience with professional UI/UX |

### Technical Excellence

```
✅ Clean Code Principles
✅ SOLID Design Patterns
✅ Comprehensive Error Handling
✅ Detailed Logging & Auditing
✅ Database Optimization
✅ API Best Practices
✅ Security Best Practices
✅ Scalable Architecture
```

### Real-World Scenarios Covered

- **User Registration & KYC** - Complete onboarding flow with document verification
- **Multi-Account Management** - Users can have Savings, Current, and Fixed Deposit accounts
- **Real-Time Transfers** - Instant money transfers with balance validation and notifications
- **Loan Processing** - Application submission, approval workflow, EMI calculation, and repayment
- **Transaction History** - Complete audit trail with filtering, search, and export capabilities
- **Email Notifications** - Automated alerts for all important banking activities
- **Admin Dashboard** - Management interface for bank operations

---

## ✨ Key Features

### 🏦 Core Banking Services

#### 1. User Management System
- **Registration & Authentication**
    - Secure user registration with email verification
    - Multi-factor authentication support
    - Password strength validation and encryption
    - Session management with automatic timeout

- **Profile Management**
    - Complete user profile with personal details
    - Address management (permanent & correspondence)
    - Contact information (mobile, email, alternate numbers)
    - Profile photo upload and management

- **KYC (Know Your Customer)**
    - Document upload (PAN, Aadhaar, Passport, Driving License)
    - Document verification workflow
    - KYC status tracking (Pending → Verified → Rejected)
    - Compliance with banking regulations

#### 2. Account Services
- **Account Types**
    - **Savings Account** - Regular savings with interest calculation
    - **Current Account** - For business transactions with overdraft facility
    - **Fixed Deposit** - Time-based deposits with higher interest rates

- **Account Operations**
    - Account creation with initial deposit
    - Balance inquiry and management
    - Account statement generation (PDF, CSV formats)
    - Interest calculation and crediting
    - Minimum balance maintenance alerts
    - Account closure with proper settlement

#### 3. Transaction Management
- **Transfer Operations**
    - **Internal Transfers** - Between VASTA Bank accounts (instant, no charges)
    - **External Transfers** - To other banks via IMPS/NEFT/RTGS
    - **Scheduled Transfers** - Set future-dated transactions
    - **Recurring Transfers** - Automatic periodic payments

- **Transaction Features**
    - Real-time balance validation
    - Transaction limits and daily caps
    - Transaction remarks and notes
    - Receipt generation with QR code
    - Transaction reversal (with proper authorization)

- **Transaction History**
    - Advanced filtering (date range, type, amount range)
    - Search functionality (by reference number, payee, remarks)
    - Export to PDF, Excel, CSV
    - Transaction categorization (bills, groceries, entertainment, etc.)

#### 4. Loan Services
- **Loan Types**
    - **Personal Loan** - Unsecured loans for personal use
    - **Home Loan** - Property purchase with competitive rates
    - **Car Loan** - Vehicle financing with flexible terms
    - **Education Loan** - Study funding with moratorium period

- **Loan Process**
    - Online application with document upload
    - Eligibility calculator (based on income, credit score, age)
    - EMI calculator with amortization schedule
    - Approval workflow (Application → Review → Approval → Disbursement)
    - Loan agreement generation and e-signing

- **Loan Management**
    - EMI payment tracking with reminders
    - Prepayment and foreclosure options
    - Loan statement generation
    - Interest rate modification requests
    - Loan restructuring in case of financial hardship

#### 5. Notification System
- **Multi-Channel Notifications**
    - **Email Notifications** - Detailed transaction receipts, statements
    - **SMS Alerts** - Quick updates for critical activities
    - **In-App Notifications** - Real-time push notifications in the web/mobile app

- **Notification Types**
    - Transaction alerts (debit, credit, transfers)
    - Low balance warnings
    - Payment due reminders
    - Security alerts (login from new device, password change)
    - Promotional offers and announcements

- **Customization**
    - User preferences for notification channels
    - Frequency settings (instant, daily digest, weekly summary)
    - Opt-in/opt-out for different notification types

### 🔐 Advanced Security Features

#### Authentication & Authorization
- **JWT Token-Based Authentication**
    - RS256 asymmetric encryption (public/private key pair)
    - Token payload contains user ID, roles, and expiration
    - Access tokens (short-lived, 24 hours)
    - Refresh tokens (long-lived, 7 days)

- **Role-Based Access Control (RBAC)**
    - **USER** - Regular customers with account access
    - **ADMIN** - Bank administrators with management capabilities
    - **MANAGER** - Branch managers with approval authorities
    - **AUDITOR** - Read-only access for compliance and auditing

- **Token Management**
    - Redis-based token storage for quick validation
    - Token revocation on logout
    - Automatic token cleanup for expired tokens
    - Token blacklisting for compromised credentials

#### Security Measures
- **Password Security**
    - BCrypt hashing with configurable strength (default: 12 rounds)
    - Password history tracking (prevent reuse of last 5 passwords)
    - Password expiration policy (force change every 90 days)
    - Account lockout after 5 failed login attempts

- **Transaction Security**
    - Two-factor authentication for large transactions (> ₹50,000)
    - Transaction OTP sent to registered mobile/email
    - IP address logging and suspicious activity detection
    - Rate limiting to prevent brute force attacks

- **Data Protection**
    - Database encryption at rest
    - SSL/TLS for data in transit
    - PII (Personally Identifiable Information) masking in logs
    - Secure document storage with encryption

### 📡 Event-Driven Architecture

#### Apache Kafka Integration
- **Event Topics**
    - `transaction.events` - All transaction-related events
    - `account.events` - Account creation, modification, closure
    - `notification.events` - Notification delivery requests
    - `loan.events` - Loan application and approval events
    - `audit.events` - System-wide audit logs

- **Event Processing**
    - **Asynchronous Processing** - Non-blocking operations for better performance
    - **Event Sourcing** - Complete history of all state changes
    - **CQRS Pattern** - Separate read and write models for optimization
    - **Eventual Consistency** - Services sync data through events

- **Reliability Features**
    - Guaranteed message delivery with Kafka acknowledgments
    - Dead letter queue for failed message processing
    - Automatic retry mechanism with exponential backoff
    - Message ordering within partitions

### 🔄 Service Discovery & Gateway

#### Eureka Service Registry
- **Dynamic Service Registration**
    - Services automatically register on startup
    - Health checks every 30 seconds
    - Automatic deregistration on shutdown
    - Multiple instance support for high availability

- **Client-Side Load Balancing**
    - Round-robin distribution of requests
    - Health-aware routing (skip unhealthy instances)
    - Sticky session support when needed

#### API Gateway
- **Unified Entry Point**
    - Single URL for all microservices
    - Automatic service discovery and routing
    - Path-based routing (e.g., `/api/accounts` → Account Service)

- **Gateway Features**
    - Request/response logging
    - CORS configuration for frontend
    - Rate limiting per user/IP
    - Request/response transformation
    - Circuit breaker pattern for fault tolerance

### 📊 Monitoring & Observability

#### Prometheus Metrics
- **Application Metrics**
    - Request count, rate, and duration
    - Error rates and types
    - Active user sessions
    - Database connection pool statistics

- **Business Metrics**
    - Transactions per second
    - Total transaction volume
    - Account creation rate
    - Loan application conversion rate

#### Grafana Dashboards
- **System Overview Dashboard**
    - Overall system health status
    - Request throughput across all services
    - Error rate trends
    - Resource utilization (CPU, memory, disk)

- **Service-Specific Dashboards**
    - Per-service metrics and health
    - Response time percentiles (p50, p95, p99)
    - Database query performance
    - Kafka consumer lag

- **Business Analytics Dashboard**
    - Daily transaction volume charts
    - Popular transaction types
    - Peak usage hours
    - Geographic distribution of users

### 💻 Developer Experience

#### Easy Setup
```bash
# One command to start everything
docker-compose up -d

# Everything runs in containers:
# ✅ No Java installation needed
# ✅ No Maven installation needed
# ✅ No MySQL setup required
# ✅ No Redis installation required
# ✅ No Kafka configuration needed
```

#### Hot Reload & Live Development
- Spring Boot DevTools for automatic restart
- Frontend hot module replacement
- Database schema auto-update (development mode)
- Integrated debugging support

#### Comprehensive Logging
```java
// Structured logging with context
log.info("Transaction completed",
    "transactionId", txnId,
    "amount", amount,
    "fromAccount", fromAcctId,
    "toAccount", toAcctId,
    "userId", userId
);
```

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
                                    ┌─────────────────┐
                                    │   React Web     │
                                    │   Application   │
                                    └────────┬────────┘
                                             │
                                             │ HTTP/HTTPS
                                             ▼
                    ┌────────────────────────────────────────┐
                    │         API Gateway (Port 8080)         │
                    │  ┌──────────────────────────────────┐   │
                    │  │   - Routing & Load Balancing     │   │
                    │  │   - Authentication Filter        │   │
                    │  │   - Rate Limiting                │   │
                    │  │   - Request Logging              │   │
                    │  └──────────────────────────────────┘   │
                    └────────────────┬───────────────────────┘
                                     │
                     ┌───────────────┼───────────────┐
                     │               │               │
                     ▼               ▼               ▼
         ┌────────────────┐  ┌──────────────┐  ┌──────────────┐
         │ Eureka Server  │  │    Auth      │  │     User     │
         │   (Port 8761)  │  │   Service    │  │   Service    │
         │                │  │  (Port 8081) │  │ (Port 8082)  │
         │ Service        │  │              │  │              │
         │ Discovery &    │  │ - JWT Tokens │  │ - User CRUD  │
         │ Registration   │  │ - Login/out  │  │ - KYC        │
         └────────────────┘  │ - Refresh    │  │ - Profile    │
                             └──────┬───────┘  └──────┬───────┘
                                    │                 │
                     ┌──────────────┴─────────────────┴────┐
                     │                                      │
                     ▼                                      ▼
         ┌───────────────────┐                  ┌───────────────────┐
         │     Account       │                  │   Transaction     │
         │     Service       │                  │     Service       │
         │   (Port 8083)     │◄────────────────►│   (Port 8084)     │
         │                   │                  │                   │
         │ - Create Account  │                  │ - Fund Transfer   │
         │ - Check Balance   │                  │ - History         │
         │ - Statement       │                  │ - Validation      │
         └─────────┬─────────┘                  └─────────┬─────────┘
                   │                                      │
                   │         ┌────────────────┐           │
                   │         │  Loan Service  │           │
                   └────────►│  (Port 8086)   │◄──────────┘
                             │                │
                             │ - Apply Loan   │
                             │ - EMI Payment  │
                             │ - Eligibility  │
                             └────────┬───────┘
                                      │
                                      │
                     ┌────────────────┴─────────────────┐
                     │                                  │
                     ▼                                  ▼
         ┌─────────────────────┐          ┌──────────────────────┐
         │    Apache Kafka     │          │  Notification Server │
         │    (Port 9092)      │─────────►│    (Port 8085)       │
         │                     │          │                      │
         │ Topics:             │          │ - Email Service      │
         │ - transactions      │          │ - SMS Service        │
         │ - notifications     │          │ - Push Notifications │
         │ - accounts          │          │ - Template Manager   │
         │ - loans             │          └──────────────────────┘
         │ - audit-logs        │
         └─────────────────────┘


         ┌─────────────────────────────────────────────────────┐
         │              Data & Storage Layer                    │
         │                                                      │
         │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
         │  │    MySQL     │  │    Redis     │  │   Kafka   │ │
         │  │ (Port 3306)  │  │ (Port 6379)  │  │  Storage  │ │
         │  │              │  │              │  │           │ │
         │  │ - Users DB   │  │ - JWT Tokens │  │ - Events  │ │
         │  │ - Accounts   │  │ - Sessions   │  │ - Logs    │ │
         │  │ - Txns       │  │ - Cache      │  │           │ │
         │  │ - Loans      │  │              │  │           │ │
         │  └──────────────┘  └──────────────┘  └───────────┘ │
         └─────────────────────────────────────────────────────┘


         ┌─────────────────────────────────────────────────────┐
         │         Monitoring & Observability Layer             │
         │                                                      │
         │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
         │  │  Prometheus  │  │   Grafana    │  │  Actuator │ │
         │  │ (Port 9090)  │  │ (Port 3000)  │  │  Health   │ │
         │  │              │  │              │  │  Endpoints│ │
         │  │ Metrics      │  │ Dashboards   │  │           │ │
         │  │ Collection   │  │ Alerts       │  │           │ │
         │  └──────────────┘  └──────────────┘  └───────────┘ │
         └─────────────────────────────────────────────────────┘
```

### Microservices Breakdown

#### 1. **Eureka Server** (Service Discovery)
- **Purpose**: Maintains a registry of all running services
- **Port**: 8761
- **Key Responsibilities**:
    - Service registration when instances start
    - Health checks every 30 seconds
    - Provides service locations to clients
    - Load balancing information
- **Technologies**: Spring Cloud Netflix Eureka
- **Why It's Important**: Enables dynamic scaling - services can start/stop without manual configuration

#### 2. **API Gateway**
- **Purpose**: Single entry point for all client requests
- **Port**: 8080
- **Key Responsibilities**:
    - Route requests to appropriate microservices
    - JWT token validation before routing
    - Rate limiting per user/IP address
    - Request/response logging and monitoring
    - CORS handling for web clients
    - Load balancing across service instances
- **Technologies**: Spring Cloud Gateway
- **Why It's Important**: Simplifies client code, provides centralized security, and enables monitoring

#### 3. **Auth Service** (Authentication & Authorization)
- **Purpose**: Handles all authentication and authorization logic
- **Port**: 8081
- **Database**: Shares User database, has auth-specific tables
- **Key Responsibilities**:
    - User registration with password hashing
    - Login and JWT token generation
    - Token refresh mechanism
    - Logout and token revocation
    - Password reset workflow
    - Role and permission management
- **Technologies**: Spring Security, JWT (RS256), Redis
- **API Endpoints**:
  ```
  POST /auth/register          - Register new user
  POST /auth/login             - Authenticate and get token
  POST /auth/refresh           - Refresh expired token
  POST /auth/logout            - Invalidate token
  POST /auth/forgot-password   - Initiate password reset
  POST /auth/reset-password    - Complete password reset
  ```
- **Token Structure**:
  ```json
  {
    "sub": "user123",
    "roles": ["USER", "CUSTOMER"],
    "iat": 1704067200,
    "exp": 1704153600
  }
  ```

#### 4. **User Service** (User Profile Management)
- **Purpose**: Manages user profiles and KYC documents
- **Port**: 8082
- **Database**: `user_db` with tables: users, addresses, kyc_documents
- **Key Responsibilities**:
    - Create and update user profiles
    - Manage addresses (permanent & correspondence)
    - Handle KYC document uploads
    - Verify KYC documents (workflow)
    - Update contact information
    - User search and listing (admin)
- **Technologies**: Spring Boot, Spring Data JPA, MySQL
- **API Endpoints**:
  ```
  GET    /users/profile              - Get logged-in user profile
  PUT    /users/profile              - Update profile
  POST   /users/address              - Add new address
  PUT    /users/address/{id}         - Update address
  POST   /users/kyc                  - Upload KYC documents
  GET    /users/kyc/status           - Check KYC verification status
  GET    /admin/users                - List all users (admin only)
  GET    /admin/users/{id}           - Get user details (admin)
  PUT    /admin/users/{id}/verify    - Verify KYC (admin)
  ```
- **Data Models**:
    - User: Basic info (name, email, phone, DOB)
    - Address: Multiple addresses per user
    - KYC: Documents (PAN, Aadhaar, etc.) with status

#### 5. **Account Service** (Account Management)
- **Purpose**: Handles all account-related operations
- **Port**: 8083
- **Database**: `account_db` with tables: accounts, account_types, transactions
- **Key Responsibilities**:
    - Create new accounts (Savings, Current, FD)
    - Maintain account balances
    - Calculate and credit interest
    - Generate account statements
    - Handle account closure
    - Minimum balance checks
    - Validate account operations
- **Technologies**: Spring Boot, Spring Data JPA, MySQL
- **API Endpoints**:
  ```
  POST   /accounts                           - Create new account
  GET    /accounts                           - List user's accounts
  GET    /accounts/{id}                      - Get account details
  GET    /accounts/{id}/balance              - Check balance
  GET    /accounts/{id}/statement            - Generate statement
  PUT    /accounts/{id}                      - Update account details
  DELETE /accounts/{id}                      - Close account
  GET    /accounts/{id}/interest             - Calculate interest
  POST   /admin/accounts/{id}/freeze         - Freeze account (admin)
  ```
- **Account Types**:
    - **Savings**: Regular savings account (4% interest)
    - **Current**: Business account (no interest, overdraft)
    - **Fixed Deposit**: Time-bound deposit (7% interest)
- **Business Logic**:
    - Minimum balance: ₹1000 for Savings, ₹5000 for Current
    - Interest calculated monthly
    - Account number format: VASTA-XXXX-XXXX-XXXX

#### 6. **Transaction Service** (Payment Processing)
- **Purpose**: Processes all financial transactions
- **Port**: 8084
- **Database**: `transaction_db` with tables: transactions, scheduled_transactions
- **Key Responsibilities**:
    - Process fund transfers (internal & external)
    - Validate balances before transfer
    - Generate transaction receipts
    - Maintain transaction history
    - Handle scheduled transactions
    - Support transaction reversals
    - Calculate transaction limits
    - Categorize transactions
- **Technologies**: Spring Boot, Spring Data JPA, MySQL, Kafka
- **API Endpoints**:
  ```
  POST   /transactions/transfer              - Transfer funds
  POST   /transactions/schedule              - Schedule future transfer
  GET    /transactions                       - Transaction history
  GET    /transactions/{id}                  - Get transaction details
  GET    /transactions/{id}/receipt          - Download receipt
  POST   /transactions/{id}/reverse          - Reverse transaction (admin)
  GET    /transactions/search                - Search transactions
  POST   /transactions/export                - Export to PDF/CSV
  ```
- **Transaction Flow**:
  ```
  1. Validate sender account exists and is active
  2. Validate receiver account exists
  3. Check sender balance >= amount + fees
  4. Check daily transaction limit
  5. Lock accounts (pessimistic locking)
  6. Debit sender account
  7. Credit receiver account
  8. Create transaction record
  9. Release locks
  10. Publish Kafka event
  11. Trigger notification
  ```
- **Transaction Types**:
    - IMPS: Immediate payment (up to ₹5 lakh)
    - NEFT: National Electronic Funds Transfer
    - RTGS: Real Time Gross Settlement (min ₹2 lakh)
    - Internal: Within VASTA Bank (no charges)

#### 7. **Loan Service** (Loan Management)
- **Purpose**: Manages the complete loan lifecycle
- **Port**: 8086
- **Database**: `loan_db` with tables: loans, loan_types, emi_schedule, payments
- **Key Responsibilities**:
    - Accept loan applications
    - Calculate loan eligibility
    - Generate EMI schedules
    - Process EMI payments
    - Handle prepayments
    - Calculate interest
    - Manage loan approvals
    - Track overdue payments
- **Technologies**: Spring Boot, Spring Data JPA, MySQL, Kafka
- **API Endpoints**:
  ```
  POST   /loans                              - Apply for loan
  GET    /loans                              - List user's loans
  GET    /loans/{id}                         - Get loan details
  GET    /loans/{id}/schedule                - Get EMI schedule
  POST   /loans/{id}/pay                     - Make EMI payment
  POST   /loans/{id}/prepay                  - Make prepayment
  GET    /loans/eligibility                  - Check eligibility
  POST   /admin/loans/{id}/approve           - Approve loan (admin)
  POST   /admin/loans/{id}/reject            - Reject loan (admin)
  ```
- **Loan Types**:
    - **Personal Loan**: 10-14% interest, up to 5 years
    - **Home Loan**: 8-10% interest, up to 30 years
    - **Car Loan**: 9-12% interest, up to 7 years
    - **Education Loan**: 8-11% interest, up to 15 years
- **Eligibility Calculation**:
  ```java
  eligibleAmount = (monthlyIncome * 0.5) * loanTenureInMonths
  creditScore >= 650 (minimum)
  age: 21-60 years
  existingLoanEMI < 40% of income
  ```

#### 8. **Notification Service** (Communication Hub)
- **Purpose**: Sends notifications across multiple channels
- **Port**: 8085
- **Database**: `notification_db` with tables: notifications, templates
- **Key Responsibilities**:
    - Send email notifications
    - Send SMS alerts
    - Push in-app notifications
    - Manage notification templates
    - Track delivery status
    - Handle failed notifications with retry
    - User preference management
- **Technologies**: Spring Boot, JavaMail, Twilio, Firebase, Kafka Consumer
- **Kafka Integration**:
    - Listens to `notification.events` topic
    - Processes events asynchronously
    - Handles events from all services
- **Notification Types**:
    - Transaction alerts (debit/credit)
    - Login/logout notifications
    - Account creation confirmation
    - Loan application status
    - Payment reminders
    - Security alerts
- **Template System**:
  ```
  Welcome Email
  Transaction Receipt
  Low Balance Alert
  Payment Due Reminder
  Loan Approval/Rejection
  KYC Verification Status
  ```

### Data Flow Examples

#### Example 1: Money Transfer Flow

```
User clicks "Transfer" → 
Frontend (React) → 
API Gateway (validates JWT) → 
Transaction Service → 
├─ Validates balance with Account Service
├─ Acquires database locks
├─ Updates sender balance
├─ Updates receiver balance
├─ Creates transaction record
├─ Publishes event to Kafka
└─ Returns success response

Kafka Consumer (Notification Service) → 
├─ Picks up transaction event
├─ Sends email to sender
├─ Sends SMS to sender
└─ Sends email to receiver
```

#### Example 2: Loan Application Flow

```
User submits loan application → 
Frontend → 
API Gateway → 
Loan Service → 
├─ Validates user from User Service
├─ Checks account status from Account Service
├─ Calculates eligibility
├─ Creates loan application record
├─ Publishes event to Kafka
└─ Returns application ID

Admin reviews application → 
Admin clicks "Approve" → 
Loan Service → 
├─ Updates loan status to APPROVED
├─ Generates EMI schedule
├─ Publishes approval event to Kafka
└─ Returns success

Notification Service → 
├─ Sends approval email
└─ Sends SMS with loan details
```

### Database Schema Overview

#### User Database
```sql
users (user_id, email, password_hash, first_name, last_name, phone, dob, created_at)
addresses (address_id, user_id, type, street, city, state, pincode, is_primary)
kyc_documents (kyc_id, user_id, document_type, document_number, file_url, status, verified_at)
```

#### Account Database
```sql
accounts (account_id, user_id, account_number, account_type, balance, status, created_at)
account_types (type_id, name, interest_rate, min_balance, description)
```

#### Transaction Database
```