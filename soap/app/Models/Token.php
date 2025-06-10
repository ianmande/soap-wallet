<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Token extends Model
{
    use HasFactory;

  
    protected $fillable = [
        'session_id',
        'client_id',
        'token',
        'amount',
        'status',
        'expires_at',
        'confirmed_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expires_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_EXPIRED = 'expired';

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeNotExpired($query)
    {
        return $query->where('expires_at', '>', now());
    }

    public static function createPaymentToken(int $clientId, float $amount, int $expirationMinutes = 10): self
    {
        //TODO: guardar token hashed
        return self::create([
            'session_id' => Str::uuid(),
            'client_id' => $clientId,
            'token' => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'amount' => $amount,
            'status' => self::STATUS_PENDING,
            'expires_at' => Carbon::now()->addMinutes($expirationMinutes)
        ]);
    }

    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    public function isValid(): bool
    {
        return $this->status === self::STATUS_PENDING && !$this->isExpired();
    }

    public function confirm(): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        return $this->update([
            'status' => self::STATUS_CONFIRMED,
            'confirmed_at' => now()
        ]);
    }

    public function expire(): bool
    {
        return $this->update(['status' => self::STATUS_EXPIRED]);
    }

    public static function validateSessionToken(string $sessionId, string $token): ?self
    {
        return self::where('session_id', $sessionId)
                  ->where('token', $token)
                  ->pending()
                  ->notExpired()
                  ->first();
    }

    protected static function boot()
    {
        parent::boot();

        static::retrieved(function ($token) {
            if ($token->isExpired() && $token->status === self::STATUS_PENDING) {
                $token->expire();
            }
        });
    }
}
