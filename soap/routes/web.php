<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Soap\WalletSoapController;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix' => 'soap', 'middleware' => 'web'], function () {
    Route::post('/registerClient', [WalletSoapController::class, 'registerClient'])->withoutMiddleware(['web']);
    
    Route::post('/rechargeWallet', [WalletSoapController::class, 'rechargeWallet'])->withoutMiddleware(['web']);
    
    Route::post('/pay', [WalletSoapController::class, 'pay'])->withoutMiddleware(['web']);
    
    Route::post('/confirmPayment', [WalletSoapController::class, 'confirmPayment'])->withoutMiddleware(['web']);
    
    Route::post('/checkBalance', [WalletSoapController::class, 'checkBalance'])->withoutMiddleware(['web']);
    
    Route::post('/getTransactionHistory', [WalletSoapController::class, 'getTransactionHistory'])->withoutMiddleware(['web']);
});

Route::get('/soap/info', function () {
    return response()->json([
        'service' => 'Wallet SOAP Service',
        'version' => '1.0',
        'endpoints' => [
            'POST /soap/registerClient' => 'Registrar nuevo cliente',
            'POST /soap/rechargeWallet' => 'Recargar billetera',
            'POST /soap/pay' => 'Iniciar pago (generar token)',
            'POST /soap/confirmPayment' => 'Confirmar pago con token',
            'POST /soap/checkBalance' => 'Consultar saldo de billetera',
            'POST /soap/getTransactionHistory' => 'Obtener historial de transacciones paginado'
        ]
    ]);
});
