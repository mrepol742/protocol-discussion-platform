# Protocol Discussion Platform

A content-first discussion platform where users can post structured protocols, create discussion threads, and engage through comments, reviews, and voting — with intelligent search and filtering powered by Typesense.

---

## 🚀 Setup

### 1. Install Dependencies

```sh
composer install
npm install
```

### 2. Environment Configuration

```sh
cp .env.example .env
```

Update the following in `.env`:

* Database credentials
* Typesense configuration

```sh
SCOUT_DRIVER=typesense

TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=your-typesense-api-key
TYPESENSE_COLLECTION_PREFIX=
```

For AI features, set up GROQ:

```env
GROQ_API_KEY=your-groq-api-key
```

---

### 3. Generate App Key

```sh
php artisan key:generate
```

---

### 4. Database & Search Index Setup

```sh
php artisan migrate:fresh --seed
php artisan scout:import "App\Models\Protocol"
php artisan scout:import "App\Models\Thread"
```

---

## ▶️ Running the Application

```sh
npm run dev
```

---

## 🔄 Refresh Database

```sh
php artisan migrate:refresh --seed
```

---

## 🧪 Running Tests

⚠️ **Important:** Never run tests on your main database.

### Setup Testing Environment

```sh
cp .env .env.testing
```

Then update `.env.testing`:

```env
APP_ENV=testing
DB_DATABASE=your_test_database
```

💡 Recommended (faster & safer):

```env
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

## Production Sentry
To enable Sentry error tracking in production, set the following in your `.env`:

```env
APP_ENV=production
SENTRY_LARAVEL_DSN=
```
To find your Sentry DSN (Data Source Name) URL, navigate to Sentry > Project Settings > SDK Setup > Client Keys (DSN).

---

### Run Tests

```sh
php artisan test
```

---

## 🔍 Typesense Commands

Clear and reseed search collections:

```sh
php artisan app:clear-typesense-collections
php artisan app:seed-typesense-collections
```

Reindex everything:

```sh
# reindex all searchable models
php artisan app:reindex-typesense

# reindex specific models
php artisan app:reindex-typesense protocols
php artisan app:reindex-typesense threads
```

For full reset:

```sh
php artisan scout:flush "App\Models\Protocol"
php artisan scout:flush "App\Models\Thread"

php artisan app:seed-typesense-collections
php artisan app:reindex-typesense
```

---

## ⚡ Optimization

```sh
php artisan optimize
```

---

## API Documentation

For full API details, see [API Docs](./docs/api.md)

---

## 🧠 Notes

* Search functionality is powered by Laravel Scout + Typesense
* After seeding, always re-import data into Typesense
* Tests may not reflect search results unless:

  * Typesense is running, OR
  * `SCOUT_DRIVER=database` is used in `.env.testing`

---

## 🛠️ Troubleshooting

### Search returns empty results?

Run:

```sh
php artisan scout:import "App\Models\Thread"
```

### Tests failing due to search?

Set:

```env
SCOUT_DRIVER=database
```

---
