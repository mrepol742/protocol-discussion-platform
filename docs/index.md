# Project Documentation

Welcome to the project documentation. Use the links below to navigate to different sections:

- [API Documentation](api.md)
- [Web Documentation](web.md)
- [README](../README.md)

## Architectural Overview

The project uses a Laravel backend with a React frontend integrated via Vite. While in typical production setups these are deployed as separate applications (often on different domains or hosting environments), for this assessment I structured them as a single unified project. This approach was intentionally chosen to simplify deployment and ensure compatibility with Laravel Cloud.

The React frontend is bundled within the Laravel application using Vite, allowing both frontend and backend to be managed and deployed together as a single service.

Bundling both layers into one application significantly reduces infrastructure cost and simplifies setup. However, this approach can introduce scalability limitations under high traffic. This trade-off is mitigated by using Laravel Cloud, which can dynamically scale server resources based on demand.

## Implementation Details

- **Backend**: Laravel 12, utilizing Eloquent ORM for database interactions, Laravel Scout with Typesense for search functionality and Laravel AI to summarize user reviews.
- **Frontend**: React 19, built with Vite for fast development and optimized production builds, uses TypeScript for type safety and improved developer experience.
- **Deployment**: The entire application is designed to be deployed on Laravel Cloud, leveraging its capabilities for scaling and performance optimization.

### Auth Mechanism

The application implements a secure authentication mechanism using Laravel Sanctum for API token management. This allows users to authenticate and maintain sessions securely, ensuring that user data and interactions are protected.

```
User
  -> Submit Login Credentials
    -> Laravel Auth Controller
      -> Validate Credentials
        -> Laravel Sanctum Generates Token
          -> Return API Token to User

User (with Token)
  -> Send API Requests (Bearer Token)
    -> Sanctum Middleware
      -> Validate Token
        -> Allow Access to Protected Routes

User
  -> Logout Request
    -> Laravel Backend
      -> Sanctum Revokes Token
        -> Token Invalidated
          -> User Session Ends
```

### Search Functionality

The search functionality is implemented using Laravel Scout with Typesense as the search engine, enabling fast and efficient querying of data based on user input.

In some applications, search is handled through a dedicated endpoint separate from listing endpoints. However, in this implementation, both listing and searching are combined into a single endpoint to simplify the API design and reduce the number of routes.

Search is performed using a query parameter (e.g., ?search=keyword), allowing the backend to dynamically handle both standard listing and filtered search results within the same request. Pagination is also supported to ensure efficient data retrieval and scalability.

Typesense search is implemented in backend to not just control the logic and search results but also to prevent abuse of the search endpoint. By handling search logic on the backend, i can implement rate limiting, authentication checks, and other security measures to protect against abuse while still providing a seamless search experience for users.

### Standard CRUD Operations

The application supports standard Create, Read, Update, and Delete (CRUD) operations for managing resources. These operations are implemented using Laravel's resource controllers, providing a structured and consistent approach to handling data interactions. Each resource has defined routes for CRUD operations, allowing users to easily manage their data through the frontend interface. The backend ensures that all operations are performed securely and efficiently, adhering to best practices for data management and user authentication.

```
Frontend (React)
   ↓
API Request (GET, POST, PUT, DELETE)
   ↓
Laravel Backend
   ↓
Database/Typesense (store/retrieve data)
   ↓
JSON Response
   ↓
Frontend updates UI
```
