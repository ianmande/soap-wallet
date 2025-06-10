import { ApiResponse } from "../types/index";
import config from "../config/config";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    let url = `${this.baseUrl}${endpoint}`;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }
    return url;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const headers = new Headers(fetchOptions.headers);
    if (
      !headers.has("Content-Type") &&
      !(fetchOptions.body instanceof FormData)
    ) {
      headers.append("Content-Type", "application/json");
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const statusCode = response.status;
        let messageError = response.statusText;
        try {
          const errorBody = await response.json();
          messageError =
            errorBody?.message_error || errorBody?.message || messageError;
        } catch (_) {}
        const error = new Error(messageError) as Error & { statusCode: number };
        error.statusCode = statusCode;
        throw error;
      }

      if (response.status === 204) {
        return {
          success: true,
          cod_error: "00",
          message_error: "Sin contenido",
          data: null,
        } as ApiResponse<T>;
      }

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error) {
      console.error("Error HttpClient:", error);
      throw error;
    }
  }

  get<T>(endpoint: string, options: FetchOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options: FetchOptions = {}) {
    const payload =
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined;
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: payload as any,
    });
  }

  put<T>(endpoint: string, body?: unknown, options: FetchOptions = {}) {
    const payload =
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined;
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: payload as any,
    });
  }

  patch<T>(endpoint: string, body?: unknown, options: FetchOptions = {}) {
    const payload =
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined;
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: payload as any,
    });
  }

  delete<T>(endpoint: string, options: FetchOptions = {}) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const httpClient = new HttpClient(config.soapBaseUrl);
