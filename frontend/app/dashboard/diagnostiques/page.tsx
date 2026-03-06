'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, STATUS_COLORS } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'titre', label: 'Titre' },
  { key: 'description', label: 'Détails' },
  { key: 'dateIntervention', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'prestataire', label: 'Prestataire' },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export default function DiagnostiquesPage() {
  return (
    <GenericPage
      title="Diagnostiques"
      description="Rapports de diagnostique des véhicules"
      resource="maintenance"
      columns={COLUMNS}
      createLabel="Nouveau Diagnostique"
      searchPlaceholder="Rechercher un diagnostique..."
    />
  );
}
