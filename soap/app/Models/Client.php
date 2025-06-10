<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

   
    protected $fillable = [
        'document',
        'names',
        'email',
        'phone'
    ];

  
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

   
    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function tokens(): HasMany
    {
        return $this->hasMany(Token::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
    
    public function scopeByDocument($query, $document)
    {
        return $query->where('document', $document);
    }

    public function scopeByDocumentAndPhone($query, $document, $phone)
    {
        return $query->where('document', $document)
                    ->where('phone', $phone);
    }

    public function hasActiveWallet(): bool
    {
        return $this->wallet && $this->wallet->active;
    }

    public function getCurrentBalance(): float
    {
        return $this->wallet ? $this->wallet->balance : 0.00;
    }
}
