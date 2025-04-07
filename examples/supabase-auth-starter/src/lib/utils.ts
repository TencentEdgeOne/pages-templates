import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

export function getURL(path: string) {
  let base = import.meta.env.DEV ? import.meta.env.VITE_PUBLIC_API_URL_DEV : '/';
  if (base.endsWith('/')) {
    base = base.split("");
    base.pop();
    base = base.join("");
  }
  return `${base}${path}`
}