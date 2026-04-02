# Protocol Discussion Platform
A content-first discussion platform where users can post structured protocols, create discussion threads, and engage through comments, reviews, and voting—with intelligent search and filter capabilities.

## Setting up
- install dependecies
  ```
  composer install && npm install
  ```
- create environment
  ```
  cp .env.example .env
  ```
- generate app key
  ```
  php artisan key:generate
  ```
- database migration
  ```
  php artisan migrate
  php artisan db:seed
  ```

# Start application
- start vite
  ```
  npm run dev
  ```
- start laravel
  ```sh
  php artisan serve
  ```

  ## Refresh migration
```
  php artisan migrate:refresh
  php artisan db:seed
```

## Optimize
```
  php artisan optimize
```
