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


## PHP dependency verification (November 9, 2026)

The targeted Composer refresh updates Guzzle 7.9.3 to 7.16.1 and compatible locked dependencies, including the Promises 2 and PSR HTTP Message 2 interfaces required by patched Guzzle. Symfony HTTP Foundation, HTTP Kernel, Routing and YAML move from 6.4.49 to 6.4.50. Laravel 9 and all application controllers, models and migrations remain unchanged. No production database migration or deployment was performed.

With a locally isolated Ubuntu PHP 8.1 CLI, the original locked install and two starter tests pass using an ephemeral application key. The same runtime also passes the expanded six-test suite on both original and refreshed dependencies. Coverage includes Laravel HTTP JSON/async behavior, Guzzle redirect/promise behavior through mock handlers, the password-breach verifier using intercepted synthetic HTTP data, Sanctum login, protected routes, survey create/read/update/delete and cross-user read rejection against in-memory SQLite. No real passwords, breach service, email service or existing database are used. These tests are not a MySQL, browser-to-backend, live network-transport or full security test.

For the same isolated test setup after `composer install`, use a PHP CLI with PDO SQLite, mbstring and XML extensions:

```sh
php scripts/test-dependencies.php
```

The runner forces a fresh ephemeral test key, in-memory SQLite and array-backed cache/session/mail; it never needs the project's real `.env` key or database. It does not run schema changes against a persistent database.

Composer audit fell from 21 advisory IDs across six packages to six IDs in Laravel itself, with no new IDs. Laravel 9 still has known findings, including critical/high findings, and needs a separately verified framework migration. PHP 8.1 is used here only as compatibility evidence for the existing stack, not as a supported production-runtime recommendation. The older backend and floating Docker image are not cleared by this targeted update.


### Framework migration follow-up

The subsequent repository-only migration uses Laravel 13.40.0, Sanctum 4, Tinker 3, PHPUnit 12 and PHP **8.4.1 or newer within 8.x**. The locked Symfony 8 components require at least PHP 8.4.1; the verified runtime is PHP 8.4.27. Do not install this lock with PHP 8.1. All original application structure, database migrations and controller behavior are retained. Sanctum's three middleware keys and the CSRF middleware base follow the current upgrade guides. The existing personal-access-token migration already includes Sanctum's required columns, so no duplicate migration was added.

The expanded suite passes seven tests/37 assertions, including registration with intercepted synthetic breach-service responses. A second repeatable check uses a disposable SQLite file, actual loopback HTTP and real bearer tokens:

```sh
php scripts/test-dependencies.php
python3 scripts/test-http-dependencies.py
cd vue && npm ci && npm test && npm run build
```

The HTTP check performs 21 checks covering missing/invalid auth, login and input rejection, token revocation on logout, survey/question creation and serialization, slug generation, date validation, pagination, cross-user read/update/delete rejection, and survey update/delete. It uses only synthetic local users, deletes its scratch database, refuses cached config and does not use registration's external password-breach service. The same checks also passed with a separately started disposable MySQL 8.0.46 server. No existing database was touched. Browser login and survey create/reload/update/delete passed against the real local Laravel API. A pre-existing Vue error reopening surveys with null expiration was reproduced and fixed with a small date-normalization helper and two Node tests; both dated and undated surveys now passed the browser check. Existing remote logo/avatar image failures remain unchanged.

For comparison, the original Laravel 9 lock passes seven tests/37 assertions and the 21 HTTP checks on PHP 8.1. Its exact lock cannot install on PHP 8.4 because of upper bounds in Nette dependencies; same-runtime PHP 8.4 parity used a local-only Laravel 9 baseline with Nette/Tinker transitive refreshes. That normalized baseline also passes the seven tests and all 21 HTTP checks on both SQLite and MySQL. The baseline normalization was not published.

The final Composer audit reports zero advisory IDs, down from six after the first targeted patch and 21 before either backend patch. This is the local Composer audit, not a promise that a delayed GitHub graph rescan is complete or that the entire application has no security problems. Registration tests fake the breach service; production email, live external HTTP, image uploads, real deployment and existing-data upgrades were not validated. Browser testing used the local PHP development server, not a production web server.

The Compose backend still uses a floating `bitnami/laravel:latest` image. **Do not treat the unchanged Compose startup as a safe upgrade path**: it regenerates the app key and runs `migrate:fresh --seed`, which can erase data. This work does not start it or rotate a real key. Any deployment needs an explicit PHP 8.4.1+ runtime check, backup and a non-destructive migration plan before using real data.

Upgrade references:
- https://laravel.com/framework/docs/10.x/upgrade
- https://laravel.com/framework/docs/11.x/upgrade
- https://laravel.com/framework/docs/12.x/upgrade
- https://laravel.com/framework/docs/13.x/upgrade
- https://github.com/laravel/sanctum/blob/4.x/UPGRADE.md
