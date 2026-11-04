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

## Front-end dependency verification (November 2026)

Tested with Node.js 26.13.0 LTS. The root asset build uses Laravel Vite Plugin 2.1 and Vite 7, a matching peer pair. The separate Vue application uses Vue Plugin 6 and Vite 8; Vue 3 and Tailwind 3 remain unchanged. UUID 11 preserves the existing v4 API and was tested through question and option creation. Root PostCSS is overridden to a patched 8.5 release.

Clean `npm ci` and production builds pass in both directories. Local Chromium checks cover unauthenticated routing, the dashboard with a local session fixture, survey editor rendering, and UUID-backed question/option creation. The 430px view has no horizontal overflow, but the existing external logo is broken and the narrow question-type control is cramped. These checks are not a real login, survey save or backend integration test.

Root npm audit drops from 5 to 0 package findings (31 to 0 distinct advisory IDs). Vue npm audit drops from 8 to 4 package findings (21 to 1 distinct ID), with no new advisory IDs; the residual Minimatch finding remains. A zero root npm audit is not a full application clearance. PHP/Laravel 9 dependencies, real database/API behavior, and the existing floating Docker image are outside this front-end update and remain unverified.
