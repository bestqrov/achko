'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'date', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'troncon', label: 'Tronçon' },
  { key: 'montant', label: 'Montant', render: (v: number) => formatCurrency(v) },
  { key: 'description', label: 'Notes' },
];

export default function AutoroutesPage() {
  return (
    <GenericPage
      title="Autoroutes"
      description="Suivi des péages autoroutiers"
      resource="consommation"
      columns={COLUMNS}
      createLabel="Nouveau Péage"
      searchPlaceholder="Rechercher un péage..."
    />
  );
}
