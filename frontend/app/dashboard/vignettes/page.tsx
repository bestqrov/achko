'use client';

import { useState, useMemo } from 'react';
import { Plus, Paperclip } from 'lucide-react';
import Modal from '@/components/Forms/Modal';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  reference: '',
  vehicle: '',
  dateEmission: '',
  dateExpiration: '',
  montantPrincipal: '',
  penalite: '',
  majoration: '',
  fraisService: '',
  timbre: '',
  tvaFraisService: '',
  notes: '',
};

const COLUMNS = [
  { key: 'reference', label: 'Vignette' },
  {
    key: 'vehicle',
    label: 'Véhicule',
    render: (v: any) => v ? `${v.matricule} — ${v.brand} ${v.model}` : '—',
  },
  { key: 'dateEmission',   label: 'Date début', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Date fin',   render: (v: string) => formatDate(v) },
  { key: 'montant',        label: 'Montant Total', render: (v: number) => v != null ? `${Number(v).toFixed(2)} DH` : '—' },
  {
    key: 'statut',
    label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>
        {v}
      </span>
    ),
  },
];

function AmountField({
  label, name, value, onChange,
}: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.01"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="0.00"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">DH</span>
      </div>
    </div>
  );
}

export default function VignettesPage() {
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [attachement, setAttachement] = useState<File | null>(null);

  const { data, isLoading } = useResource<any>('administratif', { page, search, type: 'vignette' });
  const { data: vehiclesData }    = useResource<any>('vehicles', { limit: 200 });
  const create                    = useCreateResource('administratif');

  const total = useMemo(() => {
    return ['montantPrincipal', 'penalite', 'majoration', 'fraisService', 'timbre', 'tvaFraisService']
      .reduce((sum, k) => sum + (parseFloat((form as any)[k]) || 0), 0);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      type: 'vignette',
      montant: total,
      montantPrincipal: parseFloat(form.montantPrincipal) || 0,
      penalite:         parseFloat(form.penalite) || 0,
      majoration:       parseFloat(form.majoration) || 0,
      fraisService:     parseFloat(form.fraisService) || 0,
      timbre:           parseFloat(form.timbre) || 0,
      tvaFraisService:  parseFloat(form.tvaFraisService) || 0,
    });
    setModalOpen(false);
    setForm(EMPTY_FORM);
    setAttachement(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vignettes</h2>
          <p className="text-sm text-gray-500 mt-1">Historique et gestion des vignettes fiscales</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <SearchFilter onSearch={setSearch} placeholder="Rechercher une vignette..." filters={[]} />
      <DataTable
        columns={COLUMNS}
        data={data?.data || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        pages={data?.pages || 1}
        onPageChange={setPage}
        emptyMessage="Aucune vignette trouvée"
      />

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle Vignette" size="xl">
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">

          {/* Vignette + Véhicule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vignette <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="Numéro / référence"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule <span className="text-red-500">*</span></label>
              <select
                name="vehicle"
                value={form.vehicle}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">— Sélectionner —</option>
                {(vehiclesData?.data || []).map((v: any) => (
                  <option key={v._id} value={v._id}>{v.matricule} — {v.brand} {v.model}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section: Informations générales */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-1 border-b">Informations générales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                <input type="date" name="dateEmission" value={form.dateEmission} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </div>

          {/* Amount fields */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AmountField label="Montant principal" name="montantPrincipal" value={form.montantPrincipal} onChange={handleChange} />
            <AmountField label="Pénalité"          name="penalite"         value={form.penalite}         onChange={handleChange} />
            <AmountField label="Majoration"         name="majoration"       value={form.majoration}       onChange={handleChange} />
            <AmountField label="Frais service"      name="fraisService"     value={form.fraisService}     onChange={handleChange} />
            <AmountField label="Timbre"             name="timbre"           value={form.timbre}           onChange={handleChange} />
            <AmountField label="TVA frais service"  name="tvaFraisService"  value={form.tvaFraisService}  onChange={handleChange} />
          </div>

          {/* Total — read-only */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Montant Total</span>
            <span className="text-lg font-bold text-primary-700">{total.toFixed(2)} DH</span>
          </div>

          {/* Attachement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachement</label>
            <label className="flex items-center gap-2 cursor-pointer w-fit border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
              <Paperclip className="w-4 h-4" />
              {attachement ? attachement.name : 'Choisir un fichier'}
              <input type="file" className="hidden" onChange={(e) => setAttachement(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Remarques..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
          <button className="btn-secondary" onClick={() => { setModalOpen(false); setForm(EMPTY_FORM); }}>
            Annuler
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={create.isPending || !form.reference || !form.vehicle}
          >
            {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

