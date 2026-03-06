'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar, Hash,
  Paperclip, MessageSquare, HeartPulse, Tag, CheckCircle,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'visite_medicale',
  collaborateur: '',
  typeVisite: '',
  dateVisite: '',
  dateProchaine: '',
  medecin: '',
  resultat: '',
  apte: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur',  label: 'Collaborateur' },
  { key: 'typeVisite',     label: 'Type visite' },
  { key: 'dateVisite',     label: 'Date',          render: (v: string) => formatDate(v) },
  { key: 'dateProchaine',  label: 'Prochaine',     render: (v: string) => formatDate(v) },
  { key: 'apte',           label: 'Aptitude' },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function VisiteMedicalePage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'visite_medicale' });
  const create              = useCreateResource('gestion');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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
            <h2 className="text-2xl font-bold text-gray-900">Visites Médicales</h2>
            <p className="text-sm text-gray-500 mt-1">Suivi des visites médicales des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #701a75 0%, #a21caf 60%, #d946ef 100%)' }}>
            <Plus className="w-4 h-4" /> Nouvelle Visite
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher une visite..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune visite médicale trouvée" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #701a75 0%, #a21caf 40%, #c026d3 70%, #d946ef 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2"><HeartPulse className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvelle Visite Médicale</h3>
              <p className="text-fuchsia-100 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-fuchsia-700 uppercase tracking-wider">Informations générales</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#a21caf">Collaborateur *</IconLabel>
            <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange} placeholder="Nom du collaborateur"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Tag} color="#d97706">Type de visite</IconLabel>
            <select name="typeVisite" value={form.typeVisite} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="embauche">À l'embauche</option>
              <option value="periodique">Périodique</option>
              <option value="reprise">Reprise de travail</option>
              <option value="spontanée">Spontanée</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#16a34a">Date de visite</IconLabel>
            <input type="date" name="dateVisite" value={form.dateVisite} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#d97706">Prochaine visite</IconLabel>
            <input type="date" name="dateProchaine" value={form.dateProchaine} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#0891b2">Médecin</IconLabel>
            <input type="text" name="medecin" value={form.medecin} onChange={handleChange} placeholder="Nom du médecin"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={CheckCircle} color="#16a34a">Aptitude</IconLabel>
            <select name="apte" value={form.apte} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50">
              <option value="">— Résultat —</option>
              <option value="apte">Apte</option>
              <option value="apte_restrictions">Apte avec restrictions</option>
              <option value="inapte">Inapte</option>
            </select>
          </div>
        </div>

        <div>
          <IconLabel icon={Hash} color="#64748b">Résultat / Observations</IconLabel>
          <input type="text" name="resultat" value={form.resultat} onChange={handleChange} placeholder="Résultat de la visite"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50" />
        </div>

        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange} placeholder="Lien ou référence document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50" />
        </div>

        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={3} placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 bg-gray-50 resize-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #701a75 0%, #a21caf 100%)' }}
          onClick={handleSubmit} disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
