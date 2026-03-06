'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'titre', label: 'Titre' },
  { key: 'dateIntervention', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'kilometrage', label: 'KM', render: (v: number) => v ? `${v.toLocaleString()} km` : '—' },
  { key: 'cout', label: 'Coût', render: (v: number) => formatCurrency(v) },
  { key: 'prestataire', label: 'Prestataire' },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export default function InterventionsPage() {
  return (
    <GenericPage
      title="Interventions"
      description="Historique des interventions mécaniques"
      resource="maintenance"
      columns={COLUMNS}
      createLabel="Nouvelle Intervention"
      searchPlaceholder="Rechercher une intervention..."
    />
  );
}
