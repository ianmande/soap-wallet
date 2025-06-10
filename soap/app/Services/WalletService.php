<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Wallet;
use App\Models\Token;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class WalletService
{
    public function registerClient(array $data): array
    {
        try {
            return DB::transaction(function () use ($data) {
                // Create client
                $client = Client::create($data);

                // Create wallet automatically
                $wallet = Wallet::create([
                    'client_id' => $client->id,
                    'balance' => 0.00,
                    'active' => true
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'client_id' => $client->id,
                        'document' => $client->document,
                        'names' => $client->names,
                        'email' => $client->email,
                        'phone' => $client->phone,
                        'wallet_id' => $wallet->id,
                        'initial_balance' => $wallet->balance
                    ]
                ];
            });
        } catch (\Exception $e) {
            Log::error('Error registrando cliente: ' . $e->getMessage());
            return [
                'success' => false,
                'code' => '02',
                'message' => 'Error al registrar cliente: ' . $e->getMessage()
            ];
        }
    }

    public function rechargeWallet(string $document, string $phone, float $amount): array
    {
        try {
            // Search client by document and phone
            $client = Client::byDocumentAndPhone($document, $phone)->first();

            if (!$client) {
                return [
                    'success' => false,
                    'code' => '03',
                    'message' => 'Cliente no encontrado con ese documento y teléfono'
                ];
            }

            if (!$client->hasActiveWallet()) {
                return [
                    'success' => false,
                    'code' => '04',
                    'message' => 'Cliente no tiene una billetera activa'
                ];
            }

            $transaction = $client->wallet->recharge($amount, "Recarga de billetera por $amount");

            return [
                'success' => true,
                'data' => [
                    'client_id' => $client->id,
                    'document' => $client->document,
                    'phone' => $client->phone,
                    'amount_recharged' => $amount,
                    'previous_balance' => $transaction->previous_balance,
                    'new_balance' => $transaction->new_balance,
                    'transaction_id' => $transaction->id,
                    'timestamp' => $transaction->created_at->toISOString()
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Error recargando billetera: ' . $e->getMessage());
            return [
                'success' => false,
                'code' => '05',
                'message' => 'Error al recargar billetera: ' . $e->getMessage()
            ];
        }
    }

    public function initiatePayment(string $document, string $phone, float $amount): array
    {
        try {
            // Search client by document and phone
            $client = Client::byDocumentAndPhone($document, $phone)->first();

            if (!$client) {
                return [
                    'success' => false,
                    'code' => '03',
                    'message' => 'Cliente no encontrado con ese documento y teléfono'
                ];
            }

            if (!$client->hasActiveWallet()) {
                return [
                    'success' => false,
                    'code' => '04',
                    'message' => 'Cliente no tiene una billetera activa'
                ];
            }

            if (!$client->wallet->hasSufficientBalance($amount)) {
                return [
                    'success' => false,
                    'code' => '06',
                    'message' => 'Saldo insuficiente para realizar el pago'
                ];
            }

            $token = Token::createPaymentToken($client->id, $amount, 10); // 10 minutos de expiración

            $this->sendPaymentToken($client->email, $token->token, $client->names);

            return [
                'success' => true,
                'data' => [
                    'session_id' => $token->session_id,
                    'client_id' => $client->id,
                    'amount' => $amount,
                    'expires_at' => $token->expires_at->toISOString(),
                    'email_sent' => true,
                    'current_balance' => $client->wallet->balance
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Error iniciando pago: ' . $e->getMessage());
            return [
                'success' => false,
                'code' => '07',
                'message' => 'Error al iniciar pago: ' . $e->getMessage()
            ];
        }
    }

    public function confirmPayment(string $sessionId, string $token): array
    {
        try {
            $paymentToken = Token::validateSessionToken($sessionId, $token);

            if (!$paymentToken) {
                return [
                    'success' => false,
                    'code' => '08',
                    'message' => 'Token inválido, expirado o sesión no encontrada'
                ];
            }

            $client = $paymentToken->client;

            if (!$client->wallet->hasSufficientBalance($paymentToken->amount)) {
                return [
                    'success' => false,
                    'code' => '06',
                    'message' => 'Saldo insuficiente para completar el pago'
                ];
            }

            return DB::transaction(function () use ($paymentToken, $client) {
                $paymentToken->confirm();

                $transaction = $client->wallet->deduct(
                    $paymentToken->amount,
                    "Pago confirmado con token {$paymentToken->token}",
                    $paymentToken->session_id
                );

                return [
                    'success' => true,
                    'data' => [
                        'client_id' => $client->id,
                        'session_id' => $paymentToken->session_id,
                        'amount_paid' => $paymentToken->amount,
                        'previous_balance' => $transaction->previous_balance,
                        'new_balance' => $transaction->new_balance,
                        'transaction_id' => $transaction->id,
                        'confirmed_at' => $paymentToken->confirmed_at->toISOString()
                    ]
                ];
            });

        } catch (\Exception $e) {
            Log::error('Error confirmando pago: ' . $e->getMessage());
            return [
                'success' => false,
                'code' => '09',
                'message' => 'Error al confirmar pago: ' . $e->getMessage()
            ];
        }
    }

    public function checkBalance(string $document, string $phone): array
    {
        try {
            // Search client by document and phone
            $client = Client::byDocumentAndPhone($document, $phone)->first();

            if (!$client) {
                return [
                    'success' => false,
                    'code' => '03',
                    'message' => 'Cliente no encontrado con ese documento y teléfono'
                ];
            }

            if (!$client->hasActiveWallet()) {
                return [
                    'success' => false,
                    'code' => '04',
                    'message' => 'Cliente no tiene una billetera activa'
                ];
            }

            return [
                'success' => true,
                'data' => [
                    'client_id' => $client->id,
                    'document' => $client->document,
                    'names' => $client->names,
                    'phone' => $client->phone,
                    'balance' => $client->wallet->balance,
                    'wallet_active' => $client->wallet->active,
                    'last_updated' => $client->wallet->updated_at->toISOString()
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Error consultando saldo: ' . $e->getMessage());
            return [
                'success' => false,
                'code' => '10',
                'message' => 'Error al consultar saldo: ' . $e->getMessage()
            ];
        }
    }

    public function getTransactionHistory(string $document, string $phone, int $page = 1, int $perPage = 20): array
    {
        try {
            // Search client by document and phone
            $client = Client::byDocumentAndPhone($document, $phone)->first();

            if (!$client) {
                return [
                    'success' => false,
                    'code' => '03',
                    'message' => 'Cliente no encontrado con ese documento y teléfono'
                ];
            }

            $transactions = Transaction::getByClientPaginated($client->id, $perPage);

            return [
                'success' => true,
                'data' => [
                    'client_id' => $client->id,
                    'document' => $client->document,
                    'phone' => $client->phone,
                    'current_page' => $transactions->currentPage(),
                    'per_page' => $transactions->perPage(),
                    'total' => $transactions->total(),
                    'last_page' => $transactions->lastPage(),
                    'transactions' => $transactions->items()->map(function ($transaction) {
                        return [
                            'id' => $transaction->id,
                            'type' => $transaction->type,  
                            'amount' => $transaction->amount,
                            'previous_balance' => $transaction->previous_balance,
                            'new_balance' => $transaction->new_balance,
                            'description' => $transaction->description,
                            'reference' => $transaction->reference,
                            'status' => $transaction->status,
                            'created_at' => $transaction->created_at->toISOString()
                        ];
                    })->toArray()
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Error obteniendo historial de transacciones: ' . $e->getMessage());
            return [
                'success' => false,
                'code' => '10',
                'message' => 'Error al consultar historial de transacciones: ' . $e->getMessage()
            ];
        }
    }

    private function sendPaymentToken(string $email, string $token, string $names): void
    {
        try {
            // In production, here we would implement the real email sending
            Log::info("Token de pago enviado", [
                'email' => $email,
                'names' => $names,
                'token' => $token,
                'timestamp' => now()
            ]);

            // Mail::send(...);

        } catch (\Exception $e) {
            Log::error('Error enviando email con token: ' . $e->getMessage());
            throw $e;
        }
    }
} 