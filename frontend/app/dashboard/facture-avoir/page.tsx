'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, STATUS_COLORS } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'numero', label: 'Numéro' },
  { key: 'client', label: 'Client' },
  { key: 'date', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'montantTTC', label: 'Montant TTC' },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export default function FactureAvoirPage() {
  return (
    <GenericPage
      title="Factures Avoir"
      description="Gestion des avoirs et remboursements"
      resource="factures"
      columns={COLUMNS}
      createLabel="Nouvel Avoir"
      searchPlaceholder="Rechercher un avoir..."
      filters={[{ key: 'statut', label: 'Statut', options: [{ value: 'avoir', label: 'Avoir' }] }]}
    />
  );
}
