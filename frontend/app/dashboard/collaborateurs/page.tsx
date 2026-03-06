'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Phone, Mail, MapPin, Calendar,
  Briefcase, Hash, Flag, Paperclip, MessageSquare, Users2,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  nom: '',
  prenom: '',
  cin: '',
  dateNaissance: '',
  lieuNaissance: '',
  nationalite: '',
  adresse: '',
  telephone: '',
  email: '',
  poste: '',
  departement: '',
  dateEmbauche: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'nom',          label: 'Nom' },
  { key: 'prenom',       label: 'Prénom' },
  { key: 'cin',          label: 'CIN' },
  { key: 'poste',        label: 'Poste' },
  { key: 'telephone',    label: 'Téléphone' },
  { key: 'dateEmbauche', label: 'Embauche', render: (v: string) => formatDate(v) },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function CollaborateursPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'collaborateur' });
  const create              = useCreateResource('gestion');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync({ ...form, type: 'collaborateur' });
    handleCancel();
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Collaborateurs</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des collaborateurs</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%)' }}
          >
            <Plus className="w-4 h-4" /> Nouveau Collaborateur
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un collaborateur..." filters={[]} />
        <DataTable
          columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun collaborateur trouvé"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 40%, #2563eb 70%, #3b82f6 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2"><Users2 className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouveau Collaborateur</h3>
              <p className="text-blue-100 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      {/* Identité */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Identité</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#1d4ed8">Nom *</IconLabel>
            <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Nom de famille"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={User} color="#2563eb">Prénom</IconLabel>
            <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={Hash} color="#7c3aed">CIN</IconLabel>
            <input type="text" name="cin" value={form.cin} onChange={handleChange} placeholder="N° CIN"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#0891b2">Date de naissance</IconLabel>
            <input type="date" name="dateNaissance" value={form.dateNaissance} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={MapPin} color="#16a34a">Lieu de naissance</IconLabel>
            <input type="text" name="lieuNaissance" value={form.lieuNaissance} onChange={handleChange} placeholder="Ville"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Flag} color="#d97706">Nationalité</IconLabel>
            <input type="text" name="nationalite" value={form.nationalite} onChange={handleChange} placeholder="Nationalité"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={MapPin} color="#64748b">Adresse</IconLabel>
            <input type="text" name="adresse" value={form.adresse} onChange={handleChange} placeholder="Adresse complète"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Phone} color="#16a34a">Téléphone</IconLabel>
            <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+212 6xx xxx xxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Mail} color="#2563eb">Email</IconLabel>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@exemple.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Emploi */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Emploi</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={Briefcase} color="#1d4ed8">Poste</IconLabel>
            <input type="text" name="poste" value={form.poste} onChange={handleChange} placeholder="Intitulé du poste"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Briefcase} color="#7c3aed">Département</IconLabel>
            <input type="text" name="departement" value={form.departement} onChange={handleChange} placeholder="Département"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#059669">Date d'embauche</IconLabel>
            <input type="date" name="dateEmbauche" value={form.dateEmbauche} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
        </div>
        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange} placeholder="Lien ou référence du document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
        </div>
        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={3} placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.nom}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
