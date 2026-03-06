'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar, Hash,
  Flag, MapPin, Paperclip, MessageSquare, BookMarked,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'passeport',
  collaborateur: '',
  numeroPasseport: '',
  nationalite: '',
  lieuDelivrance: '',
  dateDelivrance: '',
  dateExpiration: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur',    label: 'Collaborateur' },
  { key: 'numeroPasseport',  label: 'N° Passeport' },
  { key: 'nationalite',      label: 'Nationalité' },
  { key: 'dateDelivrance',   label: 'Délivrance',  render: (v: string) => formatDate(v) },
  { key: 'dateExpiration',   label: 'Expiration',  render: (v: string) => formatDate(v) },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function PasseportsPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'passeport' });
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
            <h2 className="text-2xl font-bold text-gray-900">Passeports</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des passeports des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #1c1917 0%, #57534e 60%, #78716c 100%)' }}>
            <Plus className="w-4 h-4" /> Nouveau Passeport
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un passeport..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun passeport trouvé" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #1c1917 0%, #44403c 40%, #57534e 70%, #78716c 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2"><BookMarked className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouveau Passeport</h3>
              <p className="text-stone-200 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Informations générales</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#57534e">Collaborateur *</IconLabel>
            <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange} placeholder="Nom du collaborateur"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Hash} color="#7c3aed">Numéro de passeport</IconLabel>
            <input type="text" name="numeroPasseport" value={form.numeroPasseport} onChange={handleChange} placeholder="N° passeport"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Flag} color="#d97706">Nationalité</IconLabel>
            <input type="text" name="nationalite" value={form.nationalite} onChange={handleChange} placeholder="Nationalité"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={MapPin} color="#0891b2">Lieu de délivrance</IconLabel>
            <input type="text" name="lieuDelivrance" value={form.lieuDelivrance} onChange={handleChange} placeholder="Ville / bureau"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#16a34a">Date de délivrance</IconLabel>
            <input type="date" name="dateDelivrance" value={form.dateDelivrance} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#dc2626">Date d'expiration</IconLabel>
            <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50" />
          </div>
        </div>

        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange} placeholder="Lien ou référence document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50" />
        </div>

        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={3} placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50 resize-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #1c1917 0%, #57534e 100%)' }}
          onClick={handleSubmit} disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
