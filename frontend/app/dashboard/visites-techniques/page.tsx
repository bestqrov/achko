'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLUMNS = [
  { key: 'reference', label: 'Référence' },
  { key: 'dateEmission', label: 'Date Visite', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Prochaine Visite', render: (v: string) => formatDate(v) },
  { key: 'organisme', label: 'Centre' },
  { key: 'montant', label: 'Coût', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function VisitesTechniquesPage() {
  return <GenericPage title="Visites Techniques" description="Suivi des visites techniques périodiques" resource="administratif" columns={COLUMNS} createLabel="Nouvelle Visite" searchPlaceholder="Rechercher une visite..." />;
}
