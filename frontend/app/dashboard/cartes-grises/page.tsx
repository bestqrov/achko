'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLUMNS = [
  { key: 'reference', label: 'N° Carte Grise' },
  { key: 'dateEmission', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'organisme', label: 'Organisme' },
  { key: 'montant', label: 'Montant', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function CartesGrisesPage() {
  return <GenericPage title="Cartes Grises" description="Gestion des cartes grises des véhicules" resource="administratif" columns={COLUMNS} createLabel="Nouvelle Carte Grise" searchPlaceholder="Rechercher..." />;
}
