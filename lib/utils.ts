import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeDate(date: Date | string): Date {
  // Create date in local timezone
  const localDate = new Date(date);
  
  // Create a date string in YYYY-MM-DD format
  const dateString = localDate.toISOString().split('T')[0];
  
  // Create new Date object at midnight UTC
  return new Date(`${dateString}T00:00:00.000Z`);
}

type QueryParamValue = string | number | boolean | Date | null | undefined;

export function formatQueryParams(params: Record<string, QueryParamValue | QueryParamValue[]>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v !== null && v !== undefined) {
          searchParams.append(key, v.toString());
        }
      });
    } else if (value instanceof Date) {
      // Always convert dates to UTC midnight
      const utcDate = normalizeDate(value);
      searchParams.append(key, utcDate.toISOString());
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
}