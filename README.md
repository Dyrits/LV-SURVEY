# LV-SURVEY

A full-stack survey application: a Laravel REST API back end with a Vue 3 single-page application front end.

## About The Project

The back end is a Laravel application exposing a REST API with token authentication (Laravel Sanctum). Authenticated users can create and manage surveys made of questions, and collect answers; the domain is modeled with dedicated `Survey`, `SurveyQuestion`, `SurveyAnswer` and `SurveyQuestionAnswer` models.

The front end, in the `vue/` directory, is a Vue 3 application bundled with Vite, styled with Tailwind CSS, using Vue Router for navigation, Vuex for state management and Axios to call the API.

## Built With

- PHP / Laravel 9 (REST API, Sanctum authentication)
- Vue 3 / Vue Router / Vuex
- Vite
- Tailwind CSS

## Getting Started

### Prerequisites

- PHP 8.0+ with Composer
- Node.js
- A database supported by Laravel

### Back end

- Install the dependencies with `composer install`.
- Copy `.env.example` to `.env` and configure your database connection.
- Generate the application key with `php artisan key:generate`.
- Run the database migrations with `php artisan migrate`.
- Start the API with `php artisan serve`.

### Front end

- From the `vue/` directory, install the dependencies with `npm install`.
- Start the development server with `npm run dev`.

## License

No license file is present in this repository.

## Contact

Dylan J. Gerrits - [GitHub](https://github.com/Dyrits)
