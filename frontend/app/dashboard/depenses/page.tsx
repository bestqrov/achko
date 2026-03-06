'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'date', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'categorie', label: 'Catégorie' },
  { key: 'description', label: 'Description' },
  { key: 'montant', label: 'Montant', render: (v: number) => formatCurrency(v) },
];

export default function DepensesPage() {
  return (
    <GenericPage
      title="Dépenses"
      description="Suivi des dépenses diverses"
      resource="consommation"
      columns={COLUMNS}
      createLabel="Nouvelle Dépense"
      searchPlaceholder="Rechercher une dépense..."
    />
  );
}
