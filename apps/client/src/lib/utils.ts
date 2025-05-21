import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api` ||
    "http://localhost:3001/api",
  withCredentials: true,
});
