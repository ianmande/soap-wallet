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

    public function pay(Request $request)
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

            $result = $this->walletService->initiatePayment(
                $request->documento,
                $request->celular,
                $request->valor
            );

            if ($result['success']) {
                return $this->successResponse(
                    'Token enviado al email. Use el ID de sesión para confirmar.',
                    $result['data']
                );
            }

            return $this->errorResponse($result['code'], $result['message']);

        } catch (\Exception $e) {
            Log::error('Error en pagar: ' . $e->getMessage());
            return $this->serverErrorResponse();
        }
    }

    public function confirmPayment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_id' => 'required|string|max:36',
                'token' => 'required|string|size:6'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors()->first());
            }

            $result = $this->walletService->confirmPayment(
                $request->session_id,
                $request->token
            );

            if ($result['success']) {
                return $this->successResponse('Pago confirmado exitosamente', $result['data']);
            }

            return $this->errorResponse($result['code'], $result['message']);

        } catch (\Exception $e) {
            Log::error('Error en confirmarPago: ' . $e->getMessage());
            return $this->serverErrorResponse();
        }
    }

    public function checkBalance(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'documento' => 'required|string|max:20',
                'celular' => 'required|string|max:15'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors()->first());
            }

            $result = $this->walletService->checkBalance(
                $request->documento,
                $request->celular
            );

            if ($result['success']) {
                return $this->successResponse('Consulta de saldo exitosa', $result['data']);
            }

            return $this->errorResponse($result['code'], $result['message']);

        } catch (\Exception $e) {
            Log::error('Error en consultarSaldo: ' . $e->getMessage());
            return $this->serverErrorResponse();
        }
    }

    public function getTransactionHistory(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'documento' => 'required|string|max:20',
                'celular' => 'required|string|max:15',
                'page' => 'nullable|integer|min:1',
                'per_page' => 'nullable|integer|min:1|max:100'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors()->first());
            }

            $result = $this->walletService->getTransactionHistory(
                $request->documento,
                $request->celular,
                $request->get('page', 1),
                $request->get('per_page', 20)
            );

            if ($result['success']) {
                return $this->successResponse('Historial de transacciones obtenido exitosamente', $result['data']);
            }

            return $this->errorResponse($result['code'], $result['message']);

        } catch (\Exception $e) {
            Log::error('Error en getTransactionHistory: ' . $e->getMessage());
            return $this->serverErrorResponse();
        }
    }
} 