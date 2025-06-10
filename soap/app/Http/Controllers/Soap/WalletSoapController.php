<?php

namespace App\Http\Controllers\Soap;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WalletSoapController extends Controller
{
    use ApiResponseTrait;

    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    public function registerClient(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'documento' => 'required|string|max:20|unique:clients,document',
                'nombres' => 'required|string|max:100',
                'email' => 'required|email|max:150|unique:clients,email',
                'celular' => 'required|string|max:15'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors()->first());
            }

            $result = $this->walletService->registerClient([
                'document' => $request->documento,
                'names' => $request->nombres,
                'email' => $request->email,
                'phone' => $request->celular
            ]);

            if ($result['success']) {
                return $this->successResponse('Cliente registrado exitosamente', $result['data']);
            }

            return $this->errorResponse($result['code'], $result['message']);

        } catch (\Exception $e) {
            Log::error('Error en registroCliente: ' . $e->getMessage());
            return $this->serverErrorResponse();
        }
    }
    
    public function rechargeWallet(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'documento' => 'required|string|max:20',
                'celular' => 'required|string|max:15',
                'valor' => 'required|numeric|min:0.01'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors()->first());
            }

            $result = $this->walletService->rechargeWallet(
                $request->documento,
                $request->celular,
                $request->valor
            );

            if ($result['success']) {
                return $this->successResponse('Recarga realizada exitosamente', $result['data']);
            }

            return $this->errorResponse($result['code'], $result['message']);

        } catch (\Exception $e) {
            Log::error('Error en recargaBilletera: ' . $e->getMessage());
            return $this->serverErrorResponse();
        }
    }

} 