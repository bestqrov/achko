'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, Hash, Calendar, CreditCard, Banknote,
  User, Users, MapPin, Plane, Globe, Bus, Tag, MessageSquare,
  FileText, Briefcase, ClipboardList,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const nowLocal = (() => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
})();

const EMPTY_FORM = {
  reference: '',
  numero: '',
  titre: '',
  dateDepart: nowLocal,
  modePaiement: '',
  montant: '',
  client: '',
  pax: '',
  nomsClients: '',
  infosClients: '',
  depart: '',
  destination: '',
  mep: '',
  numeroVol: '',
  villeDepart: '',
  typeParc: '',
  vehicle: '',
  typeVehicule: '',
  chauffeur: '',
  designation: '',
  extrat: '',
  commentaireChauffeur: '',
  remarques: '',
};

const LIST_COLUMNS = [
  { key: 'reference', label: 'Code' },
  { key: 'titre',     label: 'Activité' },
  { key: 'client',    label: 'Client' },
  { key: 'dateDepart', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'pax',      label: 'PAX' },
  {
    key: 'statut', label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>{v}</span>
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

export default function MissionsPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading }    = useResource<any>('missions', { page, search });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const create                 = useCreateResource('missions');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync(form);
    handleCancel();
  };

  /* ── LIST VIEW ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Missions</h2>
            <p className="text-sm text-gray-500 mt-1">Suivi des missions de transport</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #6366f1 100%)' }}
          >
            <Plus className="w-4 h-4" /> Nouvelle Mission
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher une mission..." filters={[]} />
        <DataTable
          columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune mission trouvée"
        />
      </div>
    );
  }

  /* ── FORM VIEW ── */
  return (
    <div className="space-y-6">
      {/* Indigo gradient header */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 40%, #4f46e5 70%, #6366f1 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvelle Mission</h3>
              <p className="text-indigo-200 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Informations générales</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={Hash} color="#4f46e5">Code</IconLabel>
            <input type="text" name="reference" value={form.reference} onChange={handleChange}
              placeholder="Code mission"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Hash} color="#7c3aed">Numéro</IconLabel>
            <input type="text" name="numero" value={form.numero} onChange={handleChange}
              placeholder="Numéro"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={ClipboardList} color="#6366f1">Activité</IconLabel>
            <input type="text" name="titre" value={form.titre} onChange={handleChange}
              placeholder="Activité / titre de mission"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#0891b2">Date création</IconLabel>
            <input type="datetime-local" name="dateDepart" value={form.dateDepart} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={CreditCard} color="#d97706">Mode de paiement</IconLabel>
            <select name="modePaiement" value={form.modePaiement} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="espèces">Espèces</option>
              <option value="virement">Virement bancaire</option>
              <option value="chèque">Chèque</option>
              <option value="carte">Carte bancaire</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <IconLabel icon={Banknote} color="#16a34a">Montant</IconLabel>
            <div className="relative">
              <input type="number" name="montant" value={form.montant} onChange={handleChange}
                min="0" step="0.01" placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Client</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#2563eb">Client</IconLabel>
            <input type="text" name="client" value={form.client} onChange={handleChange}
              placeholder="Nom du client"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Users} color="#0891b2">PAX</IconLabel>
            <input type="number" name="pax" value={form.pax} onChange={handleChange}
              min="0" placeholder="Nombre de passagers"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Users} color="#7c3aed">Noms des clients</IconLabel>
            <textarea name="nomsClients" value={form.nomsClients} onChange={handleChange} rows={3}
              placeholder="Un nom par ligne..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none" />
          </div>
          <div>
            <IconLabel icon={FileText} color="#64748b">Infos clients</IconLabel>
            <textarea name="infosClients" value={form.infosClients} onChange={handleChange} rows={3}
              placeholder="Informations complémentaires..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none" />
          </div>
        </div>
      </div>

      {/* Informations départ et arrivée */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Informations départ et arrivée</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={MapPin} color="#16a34a">Lieu de départ</IconLabel>
            <input type="text" name="depart" value={form.depart} onChange={handleChange}
              placeholder="Lieu de départ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={MapPin} color="#dc2626">Destination</IconLabel>
            <input type="text" name="destination" value={form.destination} onChange={handleChange}
              placeholder="Lieu de destination"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={MapPin} color="#d97706">MEP</IconLabel>
            <input type="text" name="mep" value={form.mep} onChange={handleChange}
              placeholder="Mise en place"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Plane} color="#2563eb">Numéro de vol</IconLabel>
            <input type="text" name="numeroVol" value={form.numeroVol} onChange={handleChange}
              placeholder="Ex: AT215"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Globe} color="#0891b2">Ville de départ</IconLabel>
            <input type="text" name="villeDepart" value={form.villeDepart} onChange={handleChange}
              placeholder="Ville"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Affectation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Affectation</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Tag} color="#d97706">Type parc</IconLabel>
            <select name="typeParc" value={form.typeParc} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="autocar">Autocar</option>
              <option value="minibus">Minibus</option>
              <option value="voiture">Voiture</option>
              <option value="suv">SUV</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <IconLabel icon={Bus} color="#0891b2">Véhicule</IconLabel>
            <select name="vehicle" value={form.vehicle} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              {(vehiclesData?.data || []).map((v: any) => (
                <option key={v._id} value={v._id}>{v.matricule} — {v.brand} {v.model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Tag} color="#64748b">Type véhicule</IconLabel>
            <input type="text" name="typeVehicule" value={form.typeVehicule} onChange={handleChange}
              placeholder="Ex: Bus, Minibus, Voiture..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={User} color="#2563eb">Chauffeur</IconLabel>
            <input type="text" name="chauffeur" value={form.chauffeur} onChange={handleChange}
              placeholder="Nom du chauffeur"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Désignation */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Désignation</p>

        <div>
          <IconLabel icon={FileText} color="#4f46e5">Désignation</IconLabel>
          <input type="text" name="designation" value={form.designation} onChange={handleChange}
            placeholder="Désignation de la mission"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
        </div>

        <div>
          <IconLabel icon={FileText} color="#6366f1">Extrat</IconLabel>
          <textarea name="extrat" value={form.extrat} onChange={handleChange} rows={3}
            placeholder="Extrat de la mission..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={MessageSquare} color="#d97706">Commentaire chauffeur</IconLabel>
            <textarea name="commentaireChauffeur" value={form.commentaireChauffeur} onChange={handleChange} rows={3}
              placeholder="Commentaire pour le chauffeur..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none" />
          </div>
          <div>
            <IconLabel icon={MessageSquare} color="#64748b">Remarques</IconLabel>
            <textarea name="remarques" value={form.remarques} onChange={handleChange} rows={3}
              placeholder="Remarques supplémentaires..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.reference || !form.titre || !form.depart || !form.destination}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
