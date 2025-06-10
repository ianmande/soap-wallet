<?php

namespace App\Traits;

trait ApiResponseTrait
{
    protected function formatResponse(bool $success, string $codError = '00', string $messageError = '', $data = null): array
    {
        return [
            'success' => $success,
            'cod_error' => $codError,
            'message_error' => $messageError,
            'data' => $data
        ];
    }

    protected function successResponse(string $message = 'Operación exitosa', $data = null): array
    {
        return $this->formatResponse(true, '00', $message, $data);
    }

    protected function errorResponse(string $code, string $message, $data = null): array
    {
        return $this->formatResponse(false, $code, $message, $data);
    }

    protected function validationErrorResponse(string $validationError): array
    {
        return $this->errorResponse('01', 'Datos de entrada inválidos: ' . $validationError);
    }

    protected function serverErrorResponse(string $message = 'Error interno del servidor'): array
    {
        return $this->errorResponse('99', $message);
    }
    const ERROR_CODES = [
        '00' => 'Operación exitosa',
        '01' => 'Datos de entrada inválidos',
        '02' => 'Error al registrar cliente',
        '03' => 'Cliente no encontrado',
        '04' => 'Billetera no activa',
        '05' => 'Error al recargar billetera',
        '06' => 'Saldo insuficiente',
        '07' => 'Error al iniciar pago',
        '08' => 'Token inválido o expirado',
        '09' => 'Error al confirmar pago',
        '10' => 'Error al consultar saldo',
        '99' => 'Error interno del servidor'
    ];
} 