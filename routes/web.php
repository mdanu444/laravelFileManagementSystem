<?php

use App\Http\Controllers\StorageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::resource("/fileUpload", StorageController::class);
Route::post("/createFolder", [StorageController::class, "createfolder"])->name("createFolder");
Route::get("/getfiles", [StorageController::class, "getfiles"])->name("getfiles");
Route::post("/deleteFile", [StorageController::class, "deleteFile"])->name("deleteFile");
Route::put("/importantFile/{id}", [StorageController::class, "importantFile"])->name("importantFile");
Route::put("/normalizeFile/{id}", [StorageController::class, "normalizeFile"])->name("normalizeFile");
Route::get("/getfolderInfo/{folder}", [StorageController::class, "getfolderInfo"])->name("getfolderInfo");
Route::get("/getFolderData/{id}", [StorageController::class, "getFolderData"])->name("getFolderData");
