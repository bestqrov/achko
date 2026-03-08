'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import Modal from '@/components/Forms/Modal';
import { useResource } from '@/hooks/useResource';
import { formatDate, formatCurrency, STATUS_COLORS, cn } from '@/lib/utils/helpers';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Filter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface GenericPageProps {
  title: string;
  description?: string;
  resource: string;
  columns: Column[];
  filters?: Filter[];
  createLabel?: string;
  searchPlaceholder?: string;
}

export default function GenericPage({
  title,
  description,
  resource,
  columns,
  filters = [],
  createLabel = 'Nouveau',
  searchPlaceholder = 'Rechercher...',
}: GenericPageProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useResource<any>(resource, { page, search });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> {createLabel}
        </button>
      </div>

      <SearchFilter onSearch={setSearch} placeholder={searchPlaceholder} filters={filters} />

      <DataTable
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pages={data?.pages || 1}
        onPageChange={setPage}
        emptyMessage={`Aucun(e) ${title.toLowerCase()} trouvé(e)`}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={createLabel} size="lg">
        <p className="text-sm text-gray-500">Formulaire de création...</p>
        <div className="mt-4 flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
          <button className="btn-primary">Enregistrer</button>
        </div>
      </Modal>
    </div>
  );
}
