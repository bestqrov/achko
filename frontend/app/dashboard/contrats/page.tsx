'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
import { cn, formatDate, formatCurrency, STATUS_COLORS } from '@/lib/utils/helpers';
const COLS = [
  { key: 'poste', label: 'Poste' },
  { key: 'typeContrat', label: 'Type' },
  { key: 'dateDebut', label: 'Début', render: (v: string) => formatDate(v) },
  { key: 'dateFin', label: 'Fin', render: (v: string) => formatDate(v) },
  { key: 'salaireBrut', label: 'Salaire Brut', render: (v: number) => formatCurrency(v) },
  { key: 'statut', label: 'Statut', render: (v: string) => <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span> },
];
export default function ContratsPage() {
  return <GenericPage title="Contrats" description="Gestion des contrats de travail" resource="gestion" columns={COLS} createLabel="Nouveau Contrat" searchPlaceholder="Rechercher un contrat..." 
    filters={[{ key: 'typeContrat', label: 'Type', options: [{ value: 'CDI', label: 'CDI' }, { value: 'CDD', label: 'CDD' }, { value: 'interim', label: 'Intérim' }, { value: 'stage', label: 'Stage' }] }]}
  />;
}
