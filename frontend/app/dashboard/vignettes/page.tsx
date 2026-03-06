'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';

const makeColumns = () => [
  { key: 'reference', label: 'Référence' },
  { key: 'dateEmission', label: 'Émission', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Expiration', render: (v: string) => formatDate(v) },
  { key: 'organisme', label: 'Organisme' },
  { key: 'montant', label: 'Montant', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export function VignettesPage() {
  return <GenericPage title="Vignettes" description="Gestion des vignettes fiscales" resource="administratif" columns={makeColumns()} createLabel="Nouvelle Vignette" searchPlaceholder="Rechercher une vignette..." />;
}
export default VignettesPage;
