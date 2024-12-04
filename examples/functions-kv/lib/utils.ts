import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getVisitCount() {
  const host =
    process.env.NODE_ENV === 'development' ? 'http://localhost:8088' : '';

  return fetch(`${host}/visit`, )
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }

      return data.visitCount;
    });
}
