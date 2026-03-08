'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar,
  Paperclip, MessageSquare, Umbrella, Hash,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'conge',
  collaborateur: '',
  dateDebut: '',
  dateFin: '',
  exclureDimanches: false,
  exclureJoursRepos: false,
  exclureJoursFeries: false,
  nombreJours: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur',       label: 'Collaborateur' },
  { key: 'dateDebut',           label: 'Du',    render: (v: string) => formatDate(v) },
  { key: 'dateFin',             label: 'Au',    render: (v: string) => formatDate(v) },
  { key: 'nombreJours',         label: 'Jours' },
  { key: 'exclureDimanches',    label: 'Dim.', render: (v: boolean) => v ? 'Oui' : 'Non' },
  { key: 'exclureJoursFeries',  label: 'Fériés', render: (v: boolean) => v ? 'Oui' : 'Non' },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function CongesPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'conge' });
  const create              = useCreateResource('gestion');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setForm((f) => ({ ...f, [target.name]: target.type === 'checkbox' ? target.checked : target.value }));
  };

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync(form);
    handleCancel();
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Congés</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des congés des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0d9488 60%, #14b8a6 100%)' }}>
            <Plus className="w-4 h-4" /> Nouveau Congé
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un congé..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun congé trouvé" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0d9488 40%, #0f9d8f 70%, #14b8a6 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2"><Umbrella className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouveau Congé</h3>
              <p className="text-teal-100 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      {/* Collaborateur */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-4">Collaborateur</p>
        <div>
          <IconLabel icon={User} color="#0d9488">Collaborateur *</IconLabel>
          <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange}
            placeholder="Nom du collaborateur"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Informations générales</p>

        {/* Date début | Date fin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#16a34a">Date début</IconLabel>
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#dc2626">Date fin</IconLabel>
            <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
          </div>
        </div>

        {/* Exclusions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'exclureDimanches',   label: 'Exclure les dimanches',       checked: form.exclureDimanches },
            { name: 'exclureJoursRepos',  label: 'Exclure les jours de repos',  checked: form.exclureJoursRepos },
            { name: 'exclureJoursFeries', label: 'Exclure les jours fériés',    checked: form.exclureJoursFeries },
          ].map(({ name, label, checked }) => (
            <label key={name}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:border-teal-400 transition-colors select-none">
              <div className="relative flex-shrink-0">
                <input type="checkbox" name={name} checked={checked} onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-5 rounded-full bg-gray-300 peer-checked:bg-teal-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        {/* Nombre de jours */}
        <div className="max-w-xs">
          <IconLabel icon={Hash} color="#0891b2">Nombre de jours</IconLabel>
          <input type="number" name="nombreJours" value={form.nombreJours} onChange={handleChange}
            min="0" step="0.5" placeholder="0"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
        </div>

        {/* Attachement */}
        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange}
            placeholder="Lien ou référence document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
        </div>

        {/* Commentaire */}
        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={3}
            placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 resize-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)' }}
          onClick={handleSubmit} disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
