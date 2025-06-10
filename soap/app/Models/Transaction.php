<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'wallet_id',
        'type',
        'amount',
        'previous_balance',
        'new_balance',
        'description',
        'reference',
        'status'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'previous_balance' => 'decimal:2',
        'new_balance' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const TYPE_RECHARGE = 'recharge';
    const TYPE_PAYMENT = 'payment';
    const TYPE_DISCOUNT = 'discount';

    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_PENDING = 'pending';

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }
    
    public static function getByClientPaginated(int $clientId, int $perPage = 20)
    {
        return self::where('client_id', $clientId)
                  ->with(['client', 'wallet'])
                  ->orderBy('created_at', 'desc')
                  ->paginate($perPage);
    }

    public static function getAllPaginated(int $perPage = 20)
    {
        return self::with(['client', 'wallet'])
                  ->orderBy('created_at', 'desc')
                  ->paginate($perPage);
    }
}
