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
Route::prefix("mydrive/")->group(function(){
    Route::resource("/fileUpload", StorageController::class);
    Route::post("/createFolder", [StorageController::class, "createfolder"])->name("createFolder");
    Route::get("/getfiles", [StorageController::class, "getfiles"])->name("getfiles");
    Route::get("/getimportantfiles", [StorageController::class, "getimportantfiles"])->name("getimportantfiles");
    Route::get("/gettrashedfiles", [StorageController::class, "gettrashedfiles"])->name("gettrashedfiles");
    Route::post("/deleteFile", [StorageController::class, "deleteFile"])->name("deleteFile");
    Route::put("/importantFile/{id}", [StorageController::class, "importantFile"])->name("importantFile");
    Route::put("/normalizeFile/{id}", [StorageController::class, "normalizeFile"])->name("normalizeFile");
    Route::get("/getfolderInfo/{folder}", [StorageController::class, "getfolderInfo"])->name("getfolderInfo");
    Route::get("/getFolderData/{id}", [StorageController::class, "getFolderData"])->name("getFolderData");
    Route::post("/downloadZip", [StorageController::class, "downloadZip"])->name("downloadZip");
    Route::post("/fileRestore", [StorageController::class, "fileRestore"])->name("fileRestore");
    Route::post("/fileDeleteForever", [StorageController::class, "fileDeleteForever"])->name("fileDeleteForever");
    Route::post("/search", [StorageController::class, "search"])->name("search");
});
