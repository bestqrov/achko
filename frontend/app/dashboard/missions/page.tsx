'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, STATUS_COLORS } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'reference', label: 'Référence' },
  { key: 'titre', label: 'Titre' },
  { key: 'depart', label: 'Départ' },
  { key: 'destination', label: 'Destination' },
  { key: 'dateDepart', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export default function MissionsPage() {
  return (
    <GenericPage
      title="Missions"
      description="Suivi des missions de transport"
      resource="missions"
      columns={COLUMNS}
      createLabel="Nouvelle Mission"
      searchPlaceholder="Rechercher une mission..."
      filters={[
        { key: 'statut', label: 'Statut', options: [
          { value: 'planifiée', label: 'Planifiée' },
          { value: 'en_cours', label: 'En cours' },
          { value: 'terminée', label: 'Terminée' },
        ]},
      ]}
    />
  );
}
