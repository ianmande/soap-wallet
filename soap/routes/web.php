<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Soap\WalletSoapController;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix' => 'soap', 'middleware' => 'web'], function () {
    Route::post('/registerClient', [WalletSoapController::class, 'registerClient'])->withoutMiddleware(['web']);
    
});

Route::get('/soap/info', function () {
    return response()->json([
        'service' => 'Wallet SOAP Service',
        'version' => '1.0',
        'endpoints' => [
            'POST /soap/registerClient' => 'Registrar nuevo cliente',
           
        ]
    ]);
});
