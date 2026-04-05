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

---

## ⚡ Optimization

```sh
php artisan optimize
```

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
