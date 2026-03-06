'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, STATUS_COLORS } from '@/lib/utils/helpers';
const COLS = [
  { key: 'reference', label: 'Référence' }, { key: 'organisme', label: 'Organisme' },
  { key: 'dateEmission', label: 'Émission', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Expiration', render: (v: string) => formatDate(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function AutorisationsPage() {
  return <GenericPage title="Autorisations de Circulation" description="Gestion des autorisations de circulation" resource="administratif" columns={COLS} createLabel="Nouvelle Autorisation" searchPlaceholder="Rechercher..." />;
}
