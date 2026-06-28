# BT-System — Banking Transaction System

This document provides an overview of the available APIs for user authentication, account management, and transaction processing.

## What Was Built

### Auth APIs
- Created user schema
- Setup Google API Console (Client ID, Client Secret, Refresh Token)
- Setup Nodemailer with Google OAuth2 for sending emails

### Account APIs
- Created account schema with indexes
- Setup auth middleware to validate logged-in user
- Created account routes and controller

### Transaction APIs
- Created transaction schema with indexes
- Created ledger schema with immutability protection and indexes
- Worked on create transaction API (request validation, idempotency key validation)
- Checked account status (ACTIVE/FROZEN/CLOSED) before processing
- Derived sender balance from ledger using aggregation
- Created transaction with MongoDB sessions (DEBIT, CREDIT ledger entries, COMPLETED status)
- Setup email service for sendTransactionEmail and sendTransactionFailureEmail

### System User API
- Added `systemUser` field in user model
- Registered one system user (name: system, email: system@test.com, password: test123)
- Created system user middleware for protected system routes

### Initial Funds Transfer API
- Setup route `/system/initial-funds`
- Controller for initial fund transfer with DEBIT and CREDIT ledger entries

### Get All User Accounts API
- Setup protected route
- Controller for fetching all accounts of logged-in user

### Get Balance API
- Setup protected route
- Controller calculates balance from ledger (Total Credits - Total Debits)

### Logout API
- Created token blacklist schema
- On logout, token is saved to blacklist so it cannot be reused

---

## Table of Contents
- [Auth APIs](#auth-apis)
  - [User Register API](#user-register-api)
  - [User Login API](#user-login-api)
  - [User Logout API](#user-logout-api)
- [Account APIs](#account-apis)
  - [Create Account API](#create-account-api)
  - [Get All User Accounts](#get-all-user-accounts)
  - [Get Account Balance](#get-account-balance)
- [Transaction APIs](#transaction-apis)
  - [Initial Fund Transfer API](#initial-fund-transfer-api)
  - [Create Transaction API](#create-transaction-api)

---

## Auth APIs

### User Register API
- **Endpoint:** `POST http://localhost:5000/api/auth/register`
- **Purpose:** Allows new users to register by providing their details.
- **Request Body:**
    ```json
    {
        "name": "system",
        "email": "system@test.com",
        "password": "test123"
    }
    ```
- **CURL Example:**
    ```bash
    curl --location 'localhost:5000/api/auth/register' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "system",
        "email": "system@test.com",
        "password": "test123"
    }'
    ```

### User Login API
- **Endpoint:** `POST http://localhost:5000/api/auth/login`
- **Purpose:** Authenticates users and provides a JWT token via cookie for subsequent requests.
- **Request Body:**
    ```json
    {
        "email": "test@gmail.com",
        "password": "test123"
    }
    ```
- **CURL Example:**
    ```bash
    curl --location 'localhost:5000/api/auth/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email": "test@gmail.com",
        "password": "test123"
    }'
    ```

### User Logout API
- **Endpoint:** `POST http://localhost:5000/api/auth/logout`
- **Purpose:** Logs out the user by blacklisting the current JWT token so it cannot be reused.
- **CURL Example:**
    ```bash
    curl --location 'localhost:5000/api/auth/logout' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

---

## Account APIs

### Create Account API
- **Endpoint:** `POST http://localhost:5000/api/account/create`
- **Purpose:** Creates a new bank account for the currently logged-in user.
- **CURL Example:**
    ```bash
    curl --location --request POST 'localhost:5000/api/account/create' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Get All User Accounts
- **Endpoint:** `GET http://localhost:5000/api/account/user-account`
- **Purpose:** Retrieves all bank accounts belonging to the logged-in user.
- **CURL Example:**
    ```bash
    curl --location 'localhost:5000/api/account/user-account' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

### Get Account Balance
- **Endpoint:** `GET http://localhost:5000/api/account/balance/:accountId`
- **Purpose:** Fetches the current balance of a specific account calculated from the ledger (Total Credits - Total Debits).
- **CURL Example:**
    ```bash
    curl --location 'localhost:5000/api/account/balance/ACCOUNT_ID_HERE' \
    --header 'Cookie: token=YOUR_TOKEN_HERE'
    ```

---

## Transaction APIs

### Initial Fund Transfer API
- **Endpoint:** `POST http://localhost:5000/api/transaction/system/initial-funds`
- **Purpose:** Allows the system user to add initial funds to a user account. Only accessible by the system user.
- **Request Body:**
    ```json
    {
        "toAccount": "6a2712eb7f9fa5f2f0dea0d5",
        "amount": 10000,
        "idempotencyKey": "019ee9ff-5767-7c36-84af-bf553bec6112"
    }
    ```
- **CURL Example:**
    ```bash
    curl --location 'localhost:5000/api/transaction/system/initial-funds' \
    --header 'Content-Type: application/json' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --data '{
        "toAccount": "6a2712eb7f9fa5f2f0dea0d5",
        "amount": 10000,
        "idempotencyKey": "019ee9ff-5767-7c36-84af-bf553bec6112"
    }'
    ```

### Create Transaction API
- **Endpoint:** `POST http://localhost:5000/api/transaction/create`
- **Purpose:** Transfers funds between two accounts. Uses MongoDB sessions to ensure atomic debit and credit ledger entries.
- **Request Body:**
    ```json
    {
        "fromAccount": "6a2712eb7f9fa5f2f0dea0d5",
        "toAccount": "6a3924baa1b85d1fc1c3ac5b",
        "amount": 9000,
        "idempotencyKey": "019eef92-26a3-7fce-8c01-1877752c58fe"
    }
    ```
- **CURL Example:**
    ```bash
    curl --location 'localhost:5000/api/transaction/create' \
    --header 'Content-Type: application/json' \
    --header 'Cookie: token=YOUR_TOKEN_HERE' \
    --data '{
        "fromAccount": "6a2712eb7f9fa5f2f0dea0d5",
        "toAccount": "6a3924baa1b85d1fc1c3ac5b",
        "amount": 9000,
        "idempotencyKey": "019eef92-26a3-7fce-8c01-1877752c58fe"
    }'
    ```
