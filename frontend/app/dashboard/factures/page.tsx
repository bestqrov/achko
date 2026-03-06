'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import Modal from '@/components/Forms/Modal';
import { useResource } from '@/hooks/useResource';
import { formatDate, formatCurrency, STATUS_COLORS, cn } from '@/lib/utils/helpers';

const COLUMNS = [
  { key: 'numero', label: 'Numéro' },
  { key: 'client', label: 'Client' },
  { key: 'date', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'montantTTC', label: 'Montant TTC', render: (v: number) => formatCurrency(v) },
  {
    key: 'statut',
    label: 'Statut',
    render: (v: string) => (
      <span className={cn(STATUS_COLORS[v] || 'badge-gray')}>{v}</span>
    ),
  },
];

export default function FacturesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useResource<any>('factures', { page, search });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Factures</h2>
          <p className="text-sm text-gray-500 mt-1">Gestion des factures clients</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle Facture
        </button>
      </div>

      <SearchFilter
        onSearch={setSearch}
        placeholder="Rechercher une facture..."
        filters={[
          { key: 'statut', label: 'Statut', options: [
            { value: 'brouillon', label: 'Brouillon' },
            { value: 'envoyée', label: 'Envoyée' },
            { value: 'payée', label: 'Payée' },
            { value: 'annulée', label: 'Annulée' },
          ]},
        ]}
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pages={data?.pages || 1}
        onPageChange={setPage}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle Facture">
        <p className="text-sm text-gray-500">Formulaire de création de facture...</p>
        <div className="mt-4 flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
          <button className="btn-primary">Créer</button>
        </div>
      </Modal>
    </div>
  );
}
