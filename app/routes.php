<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('hello');
});

Route::get('/tree', 'AnimalController@treeTimeFunTime');
Route::get('/animal/{id}', 'AnimalController@getBeastData');
Route::get('/sighting', 'AnimalController@addSighting');
/*Route::get('/kingdoms', 'AnimalController@getKingdoms');
Route::get('/phylums/{kingdom}', 'AnimalController@getPhylums');
Route::get('/classes/{phylum}', 'AnimalController@getClasses');
Route::get('/orders/{class}', 'AnimalController@getOrders');
Route::get('/families/{order}', 'AnimalController@getFamilies');
Route::get('/genuses/{family}', 'AnimalController@getGenuses');
Route::get('/species/{genus}', 'AnimalController@getSpecies');
Route::get('/images', 'AnimalController@findPhotos');
Route::get('/all', 'AnimalController@ALLOFIT');*/




