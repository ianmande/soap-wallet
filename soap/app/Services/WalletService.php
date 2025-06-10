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


} 