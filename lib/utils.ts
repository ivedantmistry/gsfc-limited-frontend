import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A utility to trigger a browser download from a Blob.
 * @param blob - The file blob (e.g., the PDF from the API).
 * @param filename - The desired name for the downloaded file.
 */
export const triggerBrowserDownload = (blob: Blob, filename: string) => {
  // 1. Create a hidden <a> element
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';

  // 2. Create a URL for the blob
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename; // This sets the downloaded file's name

  // 3. Trigger a click on the link and clean up
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};