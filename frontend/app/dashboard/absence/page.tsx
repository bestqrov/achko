'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar,
  Tag, Paperclip, MessageSquare, UserX, Type, Clock, CheckSquare,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'absence',
  collaborateur: '',
  libelle: '',
  dateDebut: '',
  typeAbsence: '',
  dateFin: '',
  justifiee: '',
  dureeJours: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur', label: 'Collaborateur' },
  { key: 'libelle',       label: 'Libellé' },
  { key: 'typeAbsence',   label: 'Type' },
  { key: 'dateDebut',     label: 'Du',  render: (v: string) => formatDate(v) },
  { key: 'dateFin',       label: 'Au',  render: (v: string) => formatDate(v) },
  { key: 'dureeJours',    label: 'Durée (j)' },
  { key: 'justifiee',     label: 'Justifiée' },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function AbsencePage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'absence' });
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
            <h2 className="text-2xl font-bold text-gray-900">Absences</h2>
            <p className="text-sm text-gray-500 mt-1">Suivi des absences des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 60%, #f97316 100%)' }}>
            <Plus className="w-4 h-4" /> Nouvelle Absence
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher une absence..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune absence trouvée" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #ea580c 70%, #f97316 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2"><UserX className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvelle Absence</h3>
              <p className="text-orange-100 text-xs">Remplissez les informations ci-dessous</p>
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
        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-4">Collaborateur</p>
        <div>
          <IconLabel icon={User} color="#c2410c">Collaborateur *</IconLabel>
          <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange}
            placeholder="Nom du collaborateur"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Informations générales</p>

        {/* Libellé | Date début | Type absence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={Type} color="#c2410c">Libellé</IconLabel>
            <input type="text" name="libelle" value={form.libelle} onChange={handleChange}
              placeholder="Libellé de l'absence"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#16a34a">Date début</IconLabel>
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Tag} color="#d97706">Type absence *</IconLabel>
            <select name="typeAbsence" value={form.typeAbsence} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="Maladie">Maladie</option>
              <option value="Injustifiée">Injustifiée</option>
              <option value="Accident de travail">Accident de travail</option>
              <option value="Événement familial">Événement familial</option>
              <option value="Congé sans solde">Congé sans solde</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        {/* Date fin | Justifiée | Durée */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#dc2626">Date fin</IconLabel>
            <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={CheckSquare} color="#7c3aed">Justifiée</IconLabel>
            <select name="justifiee" value={form.justifiee} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
            </select>
          </div>
          <div>
            <IconLabel icon={Clock} color="#0891b2">Durée (Jours)</IconLabel>
            <input type="number" name="dureeJours" value={form.dureeJours} onChange={handleChange}
              min="0" step="0.5" placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
          </div>
        </div>

        {/* Attachement */}
        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange}
            placeholder="Lien ou référence document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" />
        </div>

        {/* Commentaire */}
        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={3}
            placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 resize-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)' }}
          onClick={handleSubmit} disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
