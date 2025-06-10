<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'balance',
        'active'
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function recharge(float $amount, string $description = 'Recarga de billetera'): Transaction
    {
        return DB::transaction(function () use ($amount, $description) {
            $previousBalance = $this->balance;
            $newBalance = $previousBalance + $amount;

            $this->update(['balance' => $newBalance]);

            return $this->transactions()->create([
                'client_id' => $this->client_id,
                'type' => 'recharge',
                'amount' => $amount,
                'previous_balance' => $previousBalance,
                'new_balance' => $newBalance,
                'description' => $description,
                'status' => 'completed'
            ]);
        });
    }

    public function deduct(float $amount, string $description = 'Pago realizado', string $reference = null): Transaction
    {
        if ($this->balance < $amount) {
            throw new \Exception('Saldo insuficiente');
        }

        return DB::transaction(function () use ($amount, $description, $reference) {
            $previousBalance = $this->balance;
            $newBalance = $previousBalance - $amount;

            $this->update(['balance' => $newBalance]);

            return $this->transactions()->create([
                'client_id' => $this->client_id,
                'type' => 'payment',
                'amount' => $amount,
                'previous_balance' => $previousBalance,
                'new_balance' => $newBalance,
                'description' => $description,
                'reference' => $reference,
                'status' => 'completed'
            ]);
        });
    }

    public function hasSufficientBalance(float $amount): bool
    {
        return $this->balance >= $amount;
    }
}
