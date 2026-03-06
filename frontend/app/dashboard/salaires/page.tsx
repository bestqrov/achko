'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const COLS = [
  { key: 'mois', label: 'Mois', render: (v: number) => MONTHS[(v || 1) - 1] },
  { key: 'annee', label: 'Année' },
  { key: 'poste', label: 'Poste' },
  { key: 'salaireNet', label: 'Net à Payer', render: (v: number) => formatCurrency(v) },
  { key: 'salaireBrut', label: 'Brut', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];

export default function SalairesPage() {
  return <GenericPage title="Salaires" description="Gestion de la paie mensuelle" resource="gestion" columns={COLS} createLabel="Nouvelle Fiche de Paie" searchPlaceholder="Rechercher..." 
    filters={[{ key: 'statut', label: 'Statut', options: [{ value: 'payé', label: 'Payé' }, { value: 'en_attente', label: 'En attente' }] }]}
  />;
}
