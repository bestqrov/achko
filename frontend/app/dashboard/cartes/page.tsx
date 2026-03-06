'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'numeroCarte', label: 'N° Carte' },
  { key: 'date', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'montant', label: 'Montant', render: (v: number) => formatCurrency(v) },
  { key: 'station', label: 'Station' },
];

export default function CartesPage() {
  return (
    <GenericPage
      title="Cartes Carburant"
      description="Gestion des cartes carburant"
      resource="consommation"
      columns={COLUMNS}
      createLabel="Nouvelle Transaction"
      searchPlaceholder="Rechercher par carte..."
    />
  );
}
