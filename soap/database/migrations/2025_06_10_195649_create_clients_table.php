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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('document', 20)->unique()->comment('Documento de identidad único');
            $table->string('names', 100)->comment('Nombres completos del cliente');
            $table->string('email', 150)->unique()->comment('Email único del cliente');
            $table->string('phone', 15)->comment('Número de celular');
            $table->timestamps();

            $table->index('document', 'idx_clients_document');
            $table->index('email', 'idx_clients_email');
            $table->index(['document', 'phone'], 'idx_clients_doc_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
