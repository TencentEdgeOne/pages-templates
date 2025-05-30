import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGeo = async () => {
  const host =
    process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_API_URL : '';
  const res = await fetch(`${host}/geo`);
  return res.json();
};
