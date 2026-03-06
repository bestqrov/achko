'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, STATUS_COLORS } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'reference', label: 'Référence' },
  { key: 'client', label: 'Client' },
  { key: 'depart', label: 'Départ' },
  { key: 'destination', label: 'Destination' },
  { key: 'dateDepart', label: 'Date départ', render: (v: string) => formatDate(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export default function DemandesTransportPage() {
  return (
    <GenericPage
      title="Demandes Transport"
      description="Gestion des demandes de transport clients"
      resource="trips"
      columns={COLUMNS}
      createLabel="Nouvelle Demande"
      searchPlaceholder="Rechercher une demande..."
    />
  );
}
