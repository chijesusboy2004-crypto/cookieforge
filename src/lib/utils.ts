import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatCook(amount: number, decimals = 4): string {
  if (isNaN(amount) || amount === 0) return '0.0000';
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatMs(ms: number): string {
  return `${Math.round(ms)}ms`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    textArea.remove();
    return Promise.resolve(true);
  } catch (error) {
    textArea.remove();
    return Promise.resolve(false);
  }
}
