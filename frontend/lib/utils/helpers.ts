import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, fmt = 'dd/MM/yyyy') {
  if (!date) return '—';
  return format(new Date(date), fmt, { locale: fr });
}

export function formatCurrency(amount: number, currency = 'MAD') {
  if (amount === undefined || amount === null) return '—';
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('fr-MA').format(num);
}

export function truncate(str: string, n: number) {
  return str?.length > n ? str.slice(0, n - 1) + '…' : str;
}

export const STATUS_COLORS: Record<string, string> = {
  payée: 'badge-green',
  valide: 'badge-green',
  terminée: 'badge-green',
  terminé: 'badge-green',
  actif: 'badge-green',
  planifiée: 'badge-blue',
  planifié: 'badge-blue',
  en_cours: 'badge-yellow',
  brouillon: 'badge-gray',
  envoyée: 'badge-blue',
  annulée: 'badge-red',
  annulé: 'badge-red',
  expire: 'badge-red',
  suspendu: 'badge-red',
};
