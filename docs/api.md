# API Documentation

Use the links below to navigate to different sections:

- [Project Documentation](index.md)
- [Web Documentation](web.md)
- [README](../README.md)

## Table of Contents

- [Authentication](#authentication)
- [Protocols](#protocols)
- [Threads](#threads)
- [Comments](#comments)
- [Reviews](#reviews)
- [Voting](#voting)
- [Health Check](#health-check)

---

## Authentication

| Method | Endpoint               | Auth Required | Description                    |
| ------ | ---------------------- | ------------- | ------------------------------ |
| POST   | `/auth/login`          | ❌            | Login a user                   |
| POST   | `/auth/register`       | ❌            | Register a new user            |
| GET    | `/auth/verify-session` | ✅            | Verify if the session is valid |
| POST   | `/auth/logout`         | ✅            | Logout the authenticated user  |

> **Rate limiting:** 10 requests per minute for unauthenticated actions
> **Honeypot:** The login/register endpoint includes a honeypot field to detect bots & autofill. If the honeypot field is filled, the request will be rejected.

---

## Protocols

| Method | Endpoint          | Auth Required | Description                 |
| ------ | ----------------- | ------------- | --------------------------- |
| GET    | `/protocols`      | Optional      | List all protocols. Supports search via query parameter `q` (Typesense). If `q` is not provided, returns all protocols in paginated form. If user is logged in, returns **only their protocols** by default.- To fetch all protocols (global/everyone), pass query parameter `?everyone=true`.       |
| GET    | `/protocols/{id}` | Optional      | View a single protocol      |
| POST   | `/protocols`      | ✅            | Create a new protocol       |
| PUT    | `/protocols/{id}` | ✅            | Update an existing protocol |
| DELETE | `/protocols/{id}` | ✅            | Delete a protocol           |

> **Rate limiting:** 60 requests per minute for authenticated actions

---

## Threads

| Method | Endpoint             | Auth Required | Description                        |
| ------ | -------------------- | ------------- | ---------------------------------- |
| GET    | `/threads/{id}`      | ❌            | List threads by Protocol ID                 |
| GET    | `/threads/{id}/info` | ❌            | Get Thread Info by Thread ID |
| POST   | `/threads`           | ✅            | Create a new thread                |
| PUT    | `/threads/{id}`      | ✅            | Update a thread                    |
| DELETE | `/threads/{id}`      | ✅            | Delete a thread                    |

---

## Comments

| Method | Endpoint         | Auth Required | Description          |
| ------ | ---------------- | ------------- | -------------------- |
| GET    | `/comments/{id}` | ❌            | Get all comments by Thread ID |
| POST   | `/comments`      | ✅            | Add a comment        |
| PUT    | `/comments/{id}` | ✅            | Update a comment     |
| DELETE | `/comments/{id}` | ✅            | Delete a comment     |

---

## Reviews

| Method | Endpoint        | Auth Required | Description         |
| ------ | --------------- | ------------- | ------------------- |
| GET    | `/reviews`      | ❌            | List all reviews    |
| GET    | `/reviews/{id}` | ❌            | Get a single review |
| POST   | `/reviews`      | ✅            | Add a review        |
| PUT    | `/reviews/{id}` | ✅            | Update a review     |
| DELETE | `/reviews/{id}` | ✅            | Delete a review     |

---

## Voting

| Method | Endpoint | Auth Required | Description                   |
| ------ | -------- | ------------- | ----------------------------- |
| POST   | `/vote`  | ✅            | Cast a vote (upvote/downvote) |

---

## Health Check

| Method | Endpoint | Auth Required | Description            |
| ------ | -------- | ------------- | ---------------------- |
| GET    | `/up`    | ❌            | Check if the API is up |

---

## Notes

- Routes protected with `auth:sanctum` require a valid Sanctum token.
- `sanctum.optional` routes are accessible to unauthenticated users.
- Rate limits:
    - Auth actions: 10 requests/minute
    - Other actions: 60 requests/minute
    - Exceeding limits returns `429 Too Many Requests` with a JSON error message.
    - Per User ID for authenticated users + IP, and per IP for unauthenticated users.
