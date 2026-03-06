'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLS = [
  { key: 'reference', label: 'Référence' }, { key: 'description', label: 'Description' },
  { key: 'dateEmission', label: 'Date Sinistre', render: (v: string) => formatDate(v) },
  { key: 'organisme', label: 'Assureur' },
  { key: 'montant', label: 'Estimation', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function SinistresPage() {
  return <GenericPage title="Sinistres" description="Gestion des sinistres et accidents" resource="administratif" columns={COLS} createLabel="Nouveau Sinistre" searchPlaceholder="Rechercher un sinistre..." />;
}
