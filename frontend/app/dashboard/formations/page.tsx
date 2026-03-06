'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar,
  Paperclip, MessageSquare, GraduationCap, Tag, Star, Building2,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'formation',
  collaborateur: '',
  libelle: '',
  typeFormation: '',
  centreFormation: '',
  dateDebut: '',
  dateFin: '',
  evaluation: 0,
  evaluationCentre: 0,
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur',   label: 'Collaborateur' },
  { key: 'libelle',         label: 'Libellé' },
  { key: 'typeFormation',   label: 'Type' },
  { key: 'centreFormation', label: 'Centre' },
  { key: 'dateDebut',       label: 'Du',  render: (v: string) => formatDate(v) },
  { key: 'dateFin',         label: 'Au',  render: (v: string) => formatDate(v) },
  { key: 'evaluation',      label: 'Éval.' },
];

function StarRating({ name, value, onChange }: { name: string; value: number; onChange: (name: string, val: number) => void }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(name, star)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none">
          <Star
            className="w-7 h-7"
            fill={star <= value ? '#f59e0b' : 'none'}
            stroke={star <= value ? '#f59e0b' : '#d1d5db'}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {value > 0 && (
        <button type="button" onClick={() => onChange(name, 0)}
          className="ml-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ✕
        </button>
      )}
    </div>
  );
}

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function FormationsPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'formation' });
  const create              = useCreateResource('gestion');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleStar = (name: string, val: number) =>
    setForm((f) => ({ ...f, [name]: val }));

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
            <h2 className="text-2xl font-bold text-gray-900">Formations</h2>
            <p className="text-sm text-gray-500 mt-1">Suivi des formations des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 60%, #6366f1 100%)' }}>
            <Plus className="w-4 h-4" /> Nouvelle Formation
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher une formation..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune formation trouvée" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #4f46e5 70%, #6366f1 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2"><GraduationCap className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvelle Formation</h3>
              <p className="text-indigo-100 text-xs">Remplissez les informations ci-dessous</p>
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
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-4">Collaborateur</p>
        <div>
          <IconLabel icon={User} color="#4338ca">Collaborateur *</IconLabel>
          <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange}
            placeholder="Nom du collaborateur"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
        </div>
      </div>

      {/* Formation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Formation</p>

        {/* Libellé | Type formation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={GraduationCap} color="#4f46e5">Libellé</IconLabel>
            <input type="text" name="libelle" value={form.libelle} onChange={handleChange}
              placeholder="Intitulé de la formation"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Tag} color="#d97706">Type formation</IconLabel>
            <select name="typeFormation" value={form.typeFormation} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="Interne">Interne</option>
              <option value="Externe">Externe</option>
              <option value="E-learning">E-learning</option>
              <option value="Certifiante">Certifiante</option>
              <option value="Réglementaire">Réglementaire</option>
            </select>
          </div>
        </div>

        {/* Centre formation */}
        <div>
          <IconLabel icon={Building2} color="#0891b2">Centre formation</IconLabel>
          <input type="text" name="centreFormation" value={form.centreFormation} onChange={handleChange}
            placeholder="Nom du centre ou organisme de formation"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
        </div>

        {/* Date début | Date fin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#16a34a">Date début</IconLabel>
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#dc2626">Date fin</IconLabel>
            <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
        </div>

        {/* Évaluations — star rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 text-amber-400" /> Évaluation
            </p>
            <StarRating name="evaluation" value={form.evaluation} onChange={handleStar} />
            <p className="text-xs text-gray-400 mt-2">Note de la formation ({form.evaluation}/5)</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 text-amber-400" /> Évaluation centre
            </p>
            <StarRating name="evaluationCentre" value={form.evaluationCentre} onChange={handleStar} />
            <p className="text-xs text-gray-400 mt-2">Note du centre ({form.evaluationCentre}/5)</p>
          </div>
        </div>

        {/* Attachement */}
        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange}
            placeholder="Lien ou référence document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
        </div>

        {/* Commentaire */}
        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={3}
            placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)' }}
          onClick={handleSubmit} disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
