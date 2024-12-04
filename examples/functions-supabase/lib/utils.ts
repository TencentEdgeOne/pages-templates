import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUsers() {
  const host =
    process.env.NODE_ENV === 'development' ? 'http://localhost:8088' : '';

  return fetch(`${host}/users`).then((res) => res.json());
}
