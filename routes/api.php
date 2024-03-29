<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\SurveyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/user/sign-out', [AuthenticationController::class, 'logout']);
    Route::apiResource('/surveys', SurveyController::class);
});

Route::group(['prefix' => '/user'], function () {
    Route::post('/sign-up', [AuthenticationController::class, 'register']);
    Route::post('/sign-in', [AuthenticationController::class, 'login']);
});
