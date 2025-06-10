<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->decimal('balance', 15, 2)->default(0.00)->comment('Saldo actual de la billetera');
            $table->boolean('active')->default(true)->comment('Estado activo/inactivo de la billetera');
            $table->timestamps();

            $table->index('client_id', 'idx_wallets_client');
            $table->unique('client_id', 'unique_wallet_client');
            $table->index('active', 'idx_wallets_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
