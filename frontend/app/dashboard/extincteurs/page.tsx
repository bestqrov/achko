'use client';

import { useState } from 'react';
import {
  Plus, X, Flame, Hash, Weight,
  CalendarDays, Store, Paperclip, MessageSquare,
} from 'lucide-react';
import ValidatedInput from '@/components/Forms/ValidatedInput';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  reference: '',
  vehicle: '',
  volume: '',
  dateEmission: '',
  organisme: '',
  notes: '',
};

const COLUMNS = [
  { key: 'reference', label: 'Extincteur' },
  { key: 'volume',    label: 'Volume (KG)' },
  { key: 'dateEmission', label: "Date d'achat", render: (v: string) => formatDate(v) },
  { key: 'organisme', label: 'Fournisseur' },
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

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function ExtincteursPage() {
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [attachement, setAttachement] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const { data, isLoading } = useResource<any>('administratif', { page, search, type: 'extincteur' });
  const { data: vData } = useResource<any>('vehicles', { limit: 200 });
  const vehicles: any[] = vData?.data ?? [];
  const create              = useCreateResource('administratif');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleClose = () => { setModalOpen(false); setForm(EMPTY_FORM); setAttachement(null); };

  const handleSubmit = async () => {
    setFieldErrors({});
    const errs: Record<string,string> = {};
    if (!form.reference.trim()) errs.reference = 'Référence requise';
    if (!form.vehicle) errs.vehicle = 'Véhicule requis';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    await create.mutateAsync({ ...form, type: 'extincteur' });
    handleClose();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Extincteurs</h2>
          <p className="text-sm text-gray-500 mt-1">Suivi des extincteurs des véhicules</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 60%, #ef4444 100%)' }}>
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <SearchFilter onSearch={setSearch} placeholder="Rechercher un extincteur..." filters={[]} />
      <DataTable
        columns={COLUMNS} data={data?.data || []} loading={isLoading}
        total={data?.total || 0} page={page} pages={data?.pages || 1}
        onPageChange={setPage} emptyMessage="Aucun extincteur trouvé"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">

            {/* Red/fire gradient header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 40%, #dc2626 70%, #ef4444 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nouvel Extincteur</h3>
                  <p className="text-red-100 text-xs">Remplissez les informations ci-dessous</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[75vh] p-6 space-y-5">

              {/* Extincteur label */}
              <div>
                <ValidatedInput
                  icon={Flame} label="Extincteur" required
                  name="reference" value={form.reference} onChange={handleChange}
                  placeholder="Libellé de l'extincteur" className="w-full"
                  error={fieldErrors.reference}
                />
              </div>

              {/* Véhicule associé */}
              <div>
                <IconLabel icon={Car} color="#0891b2">Véhicule *</IconLabel>
                <select
                  name="vehicle" value={form.vehicle} onChange={handleChange}
                  className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white ${fieldErrors.vehicle ? 'border-red-500' : ''}`}
                >
                  <option value="">— Sélectionner un véhicule —</option>
                  {vehicles.map((v: any) => (
                    <option key={v._id} value={v._id}>{v.matricule || v.designation || v._id}</option>
                  ))}
                </select>
                {fieldErrors.vehicle && <p className="text-red-600 text-xs mt-1">{fieldErrors.vehicle}</p>}
              </div>

              {/* Informations */}
              <div className="border border-red-100 rounded-xl p-4 space-y-4 bg-red-50/30">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Informations</p>

                {/* Numéro + Volume */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={Hash} color="#7c3aed">Numéro</IconLabel>
                    <input type="text" name="reference" value={form.reference} onChange={handleChange}
                      placeholder="Numéro de série"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={Weight} color="#f59e0b">Volume</IconLabel>
                    <div className="relative">
                      <input type="number" name="volume" value={form.volume} onChange={handleChange}
                        min="0" step="0.1" placeholder="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">KG</span>
                    </div>
                  </div>
                </div>

                {/* Date d'achat + Fournisseur */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={CalendarDays} color="#16a34a">Date d'achat</IconLabel>
                    <input type="date" name="dateEmission" value={form.dateEmission} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={Store} color="#0891b2">Fournisseur</IconLabel>
                    <input type="text" name="organisme" value={form.organisme} onChange={handleChange}
                      placeholder="Nom du fournisseur"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" />
                  </div>
                </div>
              </div>

              {/* Attachement */}
              <div>
                <IconLabel icon={Paperclip} color="#dc2626">Attachement</IconLabel>
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-red-200 rounded-lg px-4 py-3 bg-red-50/40 hover:bg-red-50 transition-colors text-sm text-gray-500">
                  <Paperclip className="w-4 h-4 text-red-400" />
                  {attachement ? attachement.name : 'Choisir un fichier'}
                  <input type="file" className="hidden" onChange={(e) => setAttachement(e.target.files?.[0] || null)} />
                </label>
              </div>

              {/* Commentaire */}
              <div>
                <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  placeholder="Remarques..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 resize-none" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button className="btn-secondary" onClick={handleClose}>Annuler</button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)' }}
                onClick={handleSubmit}
                disabled={create.isPending || !form.reference}
              >
                {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
