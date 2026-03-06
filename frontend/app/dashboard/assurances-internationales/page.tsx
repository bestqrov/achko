'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLS = [
  { key: 'reference', label: 'N° Police' }, { key: 'organisme', label: 'Assureur' },
  { key: 'dateEmission', label: 'Début', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Fin', render: (v: string) => formatDate(v) },
  { key: 'montant', label: 'Prime', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function AssurancesIntlPage() {
  return <GenericPage title="Assurances Internationales" description="Assurances pour le transport international" resource="administratif" columns={COLS} createLabel="Nouvelle Assurance Intl." searchPlaceholder="Rechercher..." />;
}
