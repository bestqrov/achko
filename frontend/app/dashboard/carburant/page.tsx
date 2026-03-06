'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'date', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'station', label: 'Station' },
  { key: 'quantite', label: 'Quantité (L)', render: (v: number) => v ? `${v} L` : '—' },
  { key: 'prixUnitaire', label: 'Prix/L', render: (v: number) => formatCurrency(v) },
  { key: 'montant', label: 'Montant', render: (v: number) => formatCurrency(v) },
  { key: 'kilometrage', label: 'KM', render: (v: number) => v ? `${v.toLocaleString()} km` : '—' },
];

export default function CarburantPage() {
  return (
    <GenericPage
      title="Carburant"
      description="Suivi des pleins de carburant"
      resource="consommation"
      columns={COLUMNS}
      createLabel="Enregistrer Plein"
      searchPlaceholder="Rechercher..."
    />
  );
}
