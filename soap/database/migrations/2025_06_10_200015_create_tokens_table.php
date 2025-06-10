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
        Schema::create('tokens', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 36)->unique()->comment('UUID único de la sesión');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('token', 6)->comment('Token de 6 dígitos para confirmación');
            $table->decimal('amount', 15, 2)->comment('Monto del pago a confirmar');
            $table->string('status', 20)->default('pending')->comment('pending, confirmed, expired');
            $table->timestamp('expires_at')->comment('Fecha y hora de expiración del token');
            $table->timestamp('confirmed_at')->nullable()->comment('Fecha y hora de confirmación');
            $table->timestamps();

            $table->index('session_id', 'idx_tokens_session');
            $table->index('client_id', 'idx_tokens_client');
            $table->index(['session_id', 'token'], 'idx_tokens_session_token');
            $table->index('status', 'idx_tokens_status');
            $table->index('expires_at', 'idx_tokens_expires');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens');
    }
};
