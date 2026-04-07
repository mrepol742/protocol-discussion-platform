# Web Routes Documentation (React SPA)

This document describes the web routes that serve the React single-page application (SPA).

---

## Overview

- All web requests for the frontend are served through a single Laravel view (`index.blade.php`).  
- React handles routing on the client side, so Laravel only provides the SPA entry point.  
- Any undefined route is redirected to the SPA, allowing React Router (or your front-end router) to manage the URL.

---

## Routes

### Home Page

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Loads the SPA entry point (`index.blade.php`). React will handle rendering the correct page. |
