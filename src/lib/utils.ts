import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ImageInfo {
  name: string;
  extension: string;
}

export const getImageInfo:(url: string) => ImageInfo = (url) => {
  try {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const filename = pathname.split('/').pop();

    if (!filename) {
      return {
        name: '',
        extension: '',
      };
    }

    const lastDotIndex = filename.lastIndexOf('.');

    if (lastDotIndex === -1) {
      return { name: filename, extension: '' };
    }

    const name = filename.slice(0, lastDotIndex);
    const extension = filename.slice(lastDotIndex + 1).toLowerCase();

    return { name, extension };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {
      name: '',
      extension: '',
    };
  }
}