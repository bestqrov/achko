'use client';

import { useState, useMemo } from 'react';
import {
  Plus, ArrowLeft, Bus, Hash, User, Route, CalendarDays, Clock,
  MapPin, Truck, Tag, Banknote, Users, Plane, Globe, Trash2, PlusCircle,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const today = new Date().toISOString().slice(0, 16);

const EMPTY_FORM = {
  reference: '',
  numeroAtlasVoyage: '',
  numeroDossier: '',
  client: '',
  typeTrajet: '',
  depart: '',
  destination: '',
  dateDebut: today,
  dateFin: today,
  dateMiseEnPlace: today,
  lieuMiseEnPlace: '',
  vehicle: '',
  typeVehicule: '',
  prix: '',
  prixAchat: '',
  chargeCompte: '',
  pax: '',
  numeroVol: '',
  dateVol: '',
  ville: '',
  nomsTouristes: '',
};

const LIST_COLUMNS = [
  { key: 'numeroDossier',     label: 'N° dossier' },
  { key: 'numeroAtlasVoyage', label: 'Atlas Voyage' },
  { key: 'client',            label: 'Client' },
  { key: 'typeTrajet',        label: 'Type trajet' },
  { key: 'depart',            label: 'Trajet', render: (_: any, row: any) => row ? `${row.depart} → ${row.destination}` : '—' },
  { key: 'dateDebut',         label: 'Date début', render: (v: string) => formatDate(v) },
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

export default function DemandesTransportPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);
  const [specs, setSpecs]   = useState<{ specification: string; montantHT: string }[]>([]);

  const { data, isLoading }    = useResource<any>('trips', { page, search });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const create                 = useCreateResource('trips');

  const ecart = useMemo(() => {
    const prix  = parseFloat(form.prix)      || 0;
    const achat = parseFloat(form.prixAchat) || 0;
    return prix - achat;
  }, [form.prix, form.prixAchat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const addSpec = () => setSpecs((s) => [...s, { specification: '', montantHT: '' }]);
  const removeSpec = (i: number) => setSpecs((s) => s.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: string, val: string) =>
    setSpecs((s) => s.map((sp, idx) => idx === i ? { ...sp, [field]: val } : sp));

  const handleCancel = () => { setForm(EMPTY_FORM); setSpecs([]); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      specifications: specs.map((s) => ({ specification: s.specification, montantHT: parseFloat(s.montantHT) || 0 })),
      ecart,
    });
    handleCancel();
  };

  /* ── LIST VIEW ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Demandes Transport</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des demandes de transport clients</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)' }}
          >
            <Plus className="w-4 h-4" /> Nouvelle Demande
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher une demande..." filters={[]} />
        <DataTable
          columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune demande trouvée"
        />
      </div>
    );
  }

  /* ── FORM VIEW ── */
  return (
    <div className="space-y-6">
      {/* Sky-blue gradient header */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0284c7 70%, #0ea5e9 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvelle Demande Transport</h3>
              <p className="text-sky-100 text-xs">Remplissez les informations ci-dessous</p>
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
        <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Informations générales</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Hash} color="#0284c7">Numero Atlas Voyage</IconLabel>
            <input type="text" name="numeroAtlasVoyage" value={form.numeroAtlasVoyage} onChange={handleChange}
              placeholder="N° Atlas Voyage"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Hash} color="#7c3aed">N° dossier</IconLabel>
            <input type="text" name="numeroDossier" value={form.numeroDossier} onChange={handleChange}
              placeholder="N° dossier"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#2563eb">Client *</IconLabel>
            <input type="text" name="client" value={form.client} onChange={handleChange}
              placeholder="Nom du client"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Tag} color="#d97706">Type trajet</IconLabel>
            <select name="typeTrajet" value={form.typeTrajet} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="local">Local</option>
              <option value="regional">Régional</option>
              <option value="international">International</option>
              <option value="aeroport">Aéroport</option>
              <option value="circuit">Circuit</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Route} color="#16a34a">Départ</IconLabel>
            <input type="text" name="depart" value={form.depart} onChange={handleChange}
              placeholder="Ville / lieu de départ"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Route} color="#dc2626">Destination</IconLabel>
            <input type="text" name="destination" value={form.destination} onChange={handleChange}
              placeholder="Ville / lieu de destination"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Spécifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Spécifications</p>
          <button onClick={addSpec}
            className="flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-800 transition-colors">
            <PlusCircle className="w-4 h-4" /> Ajouter
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Spécification</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Montant HT</th>
                <th className="w-10 px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-400 text-xs">Aucune spécification — cliquez « Ajouter »</td></tr>
              ) : specs.map((sp, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-3 py-2">
                    <input type="text" value={sp.specification}
                      onChange={(e) => updateSpec(i, 'specification', e.target.value)}
                      placeholder="Description"
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="relative">
                      <input type="number" value={sp.montantHT}
                        onChange={(e) => updateSpec(i, 'montantHT', e.target.value)}
                        placeholder="0.00" min="0" step="0.01"
                        className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 pr-9 text-sm focus:outline-none focus:ring-1 focus:ring-sky-400" />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">DH</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Détails */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Détails</p>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={CalendarDays} color="#16a34a">Date début</IconLabel>
            <input type="datetime-local" name="dateDebut" value={form.dateDebut} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={CalendarDays} color="#dc2626">Date fin</IconLabel>
            <input type="datetime-local" name="dateFin" value={form.dateFin} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Clock} color="#7c3aed">Date mise en place</IconLabel>
            <input type="datetime-local" name="dateMiseEnPlace" value={form.dateMiseEnPlace} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
        </div>

        {/* Lieu mise en place + Flotte + Type véhicule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={MapPin} color="#d97706">Lieu mise en place</IconLabel>
            <input type="text" name="lieuMiseEnPlace" value={form.lieuMiseEnPlace} onChange={handleChange}
              placeholder="Adresse / lieu"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Truck} color="#0891b2">Flotte</IconLabel>
            <select name="vehicle" value={form.vehicle} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              {(vehiclesData?.data || []).map((v: any) => (
                <option key={v._id} value={v._id}>{v.matricule} — {v.brand} {v.model}</option>
              ))}
            </select>
          </div>
          <div>
            <IconLabel icon={Tag} color="#64748b">Type véhicule</IconLabel>
            <input type="text" name="typeVehicule" value={form.typeVehicule} onChange={handleChange}
              placeholder="Ex: Bus, Minibus, Voiture..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
        </div>

        {/* Prix / Prix d'achat / Écart */}
        <div className="border border-sky-100 rounded-xl p-4 space-y-4 bg-sky-50/30">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Prix</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <IconLabel icon={Banknote} color="#16a34a">Prix</IconLabel>
              <div className="relative">
                <input type="number" name="prix" value={form.prix} onChange={handleChange}
                  min="0" step="0.01" placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
              </div>
            </div>
            <div>
              <IconLabel icon={Banknote} color="#d97706">Prix d'achat</IconLabel>
              <div className="relative">
                <input type="number" name="prixAchat" value={form.prixAchat} onChange={handleChange}
                  min="0" step="0.01" placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
              </div>
            </div>
            <div>
              <IconLabel icon={Banknote} color={ecart >= 0 ? '#16a34a' : '#dc2626'}>Écart</IconLabel>
              <div className={cn(
                'border rounded-lg px-3 py-2 text-sm font-semibold',
                ecart >= 0 ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
              )}>
                {ecart.toFixed(2)} DH
              </div>
            </div>
          </div>
        </div>

        {/* Chargé compte + PAX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#7c3aed">Chargé compte</IconLabel>
            <input type="text" name="chargeCompte" value={form.chargeCompte} onChange={handleChange}
              placeholder="Nom du chargé de compte"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Users} color="#0891b2">PAX</IconLabel>
            <input type="number" name="pax" value={form.pax} onChange={handleChange}
              min="0" placeholder="Nombre de passagers"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
        </div>

        {/* Numéro de vol + Date de vol + Ville */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IconLabel icon={Plane} color="#2563eb">Numéro de vol</IconLabel>
            <input type="text" name="numeroVol" value={form.numeroVol} onChange={handleChange}
              placeholder="Ex: AT215"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={CalendarDays} color="#0891b2">Date de vol</IconLabel>
            <input type="datetime-local" name="dateVol" value={form.dateVol} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Globe} color="#16a34a">Ville</IconLabel>
            <input type="text" name="ville" value={form.ville} onChange={handleChange}
              placeholder="Ville"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50" />
          </div>
        </div>

        {/* Noms des touristes */}
        <div>
          <IconLabel icon={Users} color="#64748b">Noms des touristes</IconLabel>
          <textarea name="nomsTouristes" value={form.nomsTouristes} onChange={handleChange} rows={4}
            placeholder="Un nom par ligne..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-50 resize-none" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.client}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
