'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'titre', label: 'Titre' },
  { key: 'dateIntervention', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'prochainEntretien', label: 'Prochain', render: (v: string) => formatDate(v) },
  { key: 'cout', label: 'Coût', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export default function EntretienPage() {
  return (
    <GenericPage
      title="Entretien"
      description="Planning d'entretien préventif des véhicules"
      resource="maintenance"
      columns={COLUMNS}
      createLabel="Planifier Entretien"
      searchPlaceholder="Rechercher un entretien..."
    />
  );
}
