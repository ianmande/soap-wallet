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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('wallet_id')->constrained('wallets')->onDelete('cascade');
            $table->string('type', 20)->comment('recharge, payment, discount');
            $table->decimal('amount', 15, 2)->comment('Monto de la transacción');
            $table->decimal('previous_balance', 15, 2)->comment('Saldo anterior');
            $table->decimal('new_balance', 15, 2)->comment('Saldo después de la transacción');
            $table->string('description', 255)->comment('Descripción de la transacción');
            $table->string('reference', 50)->nullable()->comment('Referencia externa (session_id, etc.)');
            $table->string('status', 20)->default('completed')->comment('completed, failed, pending');
            $table->timestamps();

            $table->index('client_id', 'idx_transactions_client');
            $table->index('wallet_id', 'idx_transactions_wallet');
            $table->index('type', 'idx_transactions_type');
            $table->index('reference', 'idx_transactions_reference');
            $table->index('status', 'idx_transactions_status');
            $table->index('created_at', 'idx_transactions_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
