'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLS = [
  { key: 'reference', label: 'Référence' }, { key: 'description', label: 'Description' },
  { key: 'dateExpiration', label: 'Échéance', render: (v: string) => formatDate(v) },
  { key: 'montant', label: 'Montant', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function TaxesPage() {
  return <GenericPage title="Taxes" description="Gestion des taxes et redevances" resource="administratif" columns={COLS} createLabel="Nouvelle Taxe" searchPlaceholder="Rechercher une taxe..." />;
}
