'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLS = [
  { key: 'reference', label: 'N° Série' },
  { key: 'dateEmission', label: 'Mise en service', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Vérification', render: (v: string) => formatDate(v) },
  { key: 'montant', label: 'Coût', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function ExtincteursPage() {
  return <GenericPage title="Extincteurs" description="Suivi des extincteurs des véhicules" resource="administratif" columns={COLS} createLabel="Nouvel Extincteur" searchPlaceholder="Rechercher un extincteur..." />;
}
