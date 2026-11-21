// apiUtils.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

interface FetchOptions extends AxiosRequestConfig {
  retries?: number;
}

export const axiosInstance = axios.create({
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { retries = MAX_RETRIES, ...axiosOptions } = options;
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axiosInstance({
        url,
        ...axiosOptions,
      });
      return response.data;
    } catch (error) {
      lastError = error as Error;
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        // Don't retry on client errors (4xx)
        if (axiosError.response && axiosError.response.status >= 400 && axiosError.response.status < 500) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === retries) {
          throw error;
        }
        
        // Add exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  
  throw lastError;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; details?: string }>;
    
    if (axiosError.code === 'ECONNABORTED' || axiosError.response?.status === 504) {
      return 'Request timed out. Please try again.';
    }
    
    return axiosError.response?.data?.details ||
           axiosError.response?.data?.error ||
           axiosError.message ||
           'An unexpected error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}