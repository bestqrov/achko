'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLS = [
  { key: 'reference', label: 'N° Agrément' }, { key: 'organisme', label: 'Organisme' },
  { key: 'dateEmission', label: 'Émission', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Expiration', render: (v: string) => formatDate(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function AgrémentsPage() {
  return <GenericPage title="Agréments" description="Gestion des agréments officiels" resource="administratif" columns={COLS} createLabel="Nouvel Agrément" searchPlaceholder="Rechercher un agrément..." />;
}
