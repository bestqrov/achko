'use client';

import { useState, useMemo } from 'react';
import {
  Plus, ArrowLeft, Receipt, FileText, Hash, CalendarDays, CalendarCheck,
  User, Truck, MessageSquare, Banknote, Percent, Globe, CreditCard,
  Filter, Search,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  numero: '',
  designation: '',
  reference: '',
  bonCommande: '',
  date: '',
  echeance: '',
  client: '',
  vehicle: '',
  notes: '',
  montantHT: '',
  montantTVA: '',
  devise: 'MAD',
  modePaiement: '',
};

const EMPTY_FILTER = {
  numeroSysteme: '',
  numeroDossier: '',
  categorieVehicule: '',
  dateDebut: '',
  dateFin: '',
};

const LIST_COLUMNS = [
  { key: 'numero',      label: 'N° système' },
  { key: 'client',      label: 'Client' },
  { key: 'designation', label: 'Désignation' },
  { key: 'date',        label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'echeance',    label: "D'échéance", render: (v: string) => formatDate(v) },
  { key: 'montantTTC',  label: 'Montant TTC', render: (v: number) => formatCurrency(v) },
  {
    key: 'statut', label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>{v}</span>
    ),
  },
];

const TRIPS_COLUMNS = [
  { key: 'numeroDossier',  label: 'N° dossier' },
  { key: 'numero',         label: 'N° système' },
  { key: 'vehicle',        label: 'Véhicule', render: (v: any) => v ? `${v.matricule}` : '—' },
  { key: 'numeroVoucher',  label: 'N° voucher' },
  { key: 'prix',           label: 'Prix', render: (v: number) => v ? `${v} DH` : '—' },
  { key: 'specification',  label: 'Spécification' },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function FacturesPage() {
  const [view, setView]         = useState<'list' | 'form'>('list');
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState(EMPTY_FORM);
  const [tripFilter, setTripFilter] = useState(EMPTY_FILTER);
  const [tripPage, setTripPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading }         = useResource<any>('factures', { page, search });
  const { data: vehiclesData }      = useResource<any>('vehicles', { limit: 200 });
  const { data: tripsData, isLoading: tripsLoading } = useResource<any>('trips', {
    page: tripPage,
    limit: 10,
    ...(tripFilter.numeroDossier   ? { numeroDossier: tripFilter.numeroDossier }   : {}),
    ...(tripFilter.numeroSysteme   ? { numero: tripFilter.numeroSysteme }           : {}),
    ...(tripFilter.categorieVehicule ? { categorieVehicule: tripFilter.categorieVehicule } : {}),
    ...(tripFilter.dateDebut       ? { dateDebut: tripFilter.dateDebut }           : {}),
    ...(tripFilter.dateFin         ? { dateFin: tripFilter.dateFin }               : {}),
  });
  const create = useCreateResource('factures');

  const montantTTC = useMemo(() => {
    const ht  = parseFloat(form.montantHT)  || 0;
    const tva = parseFloat(form.montantTVA) || 0;
    return ht + ht * (tva / 100);
  }, [form.montantHT, form.montantTVA]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTripFilter((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleTrip = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleReset = () => { setForm(EMPTY_FORM); setSelected(new Set()); setTripFilter(EMPTY_FILTER); };

  const handleCancel = () => { handleReset(); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      montantTTC,
      lignesSelectionnees: Array.from(selected),
    });
    handleCancel();
  };

  /* ── LIST VIEW ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Factures</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des factures clients</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #14532d 0%, #15803d 60%, #16a34a 100%)' }}
          >
            <Plus className="w-4 h-4" /> Nouvelle Facture
          </button>
        </div>
        <SearchFilter
          onSearch={setSearch}
          placeholder="Rechercher une facture..."
          filters={[
            { key: 'statut', label: 'Statut', options: [
              { value: 'brouillon', label: 'Brouillon' },
              { value: 'envoyée',  label: 'Envoyée' },
              { value: 'payée',    label: 'Payée' },
              { value: 'annulée',  label: 'Annulée' },
            ]},
          ]}
        />
        <DataTable
          columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune facture trouvée"
        />
      </div>
    );
  }

  /* ── FORM VIEW (in-page) ── */
  return (
    <div className="space-y-6">
      {/* Green gradient header bar */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #16a34a 80%, #22c55e 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvelle Facture</h3>
              <p className="text-green-100 text-xs">Remplissez les informations de la facture</p>
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

      {/* ── Main form card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

        {/* Row 1: Désignation + Référence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Receipt} color="#16a34a">Désignation</IconLabel>
            <input type="text" name="designation" value={form.designation} onChange={handleChange}
              placeholder="Désignation de la facture"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={FileText} color="#7c3aed">Référence</IconLabel>
            <input type="text" name="reference" value={form.reference} onChange={handleChange}
              placeholder="Référence"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
        </div>

        {/* Row 2: N° bon commande + N° système */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Hash} color="#0891b2">N° bon de commande</IconLabel>
            <input type="text" name="bonCommande" value={form.bonCommande} onChange={handleChange}
              placeholder="N° bon de commande"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Hash} color="#d97706">N° système *</IconLabel>
            <input type="text" name="numero" value={form.numero} onChange={handleChange}
              placeholder="Numéro unique"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
        </div>

        {/* Row 3: Date + Date échéance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={CalendarDays} color="#16a34a">Date</IconLabel>
            <input type="date" name="date" value={form.date} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={CalendarCheck} color="#dc2626">Date d'échéance</IconLabel>
            <input type="date" name="echeance" value={form.echeance} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
        </div>

        {/* Row 4: Client + Véhicule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#2563eb">Client *</IconLabel>
            <input type="text" name="client" value={form.client} onChange={handleChange}
              placeholder="Nom du client"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Truck} color="#0891b2">Véhicule</IconLabel>
            <select name="vehicle" value={form.vehicle} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              {(vehiclesData?.data || []).map((v: any) => (
                <option key={v._id} value={v._id}>{v.matricule} — {v.brand} {v.model}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
            placeholder="Remarques..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 resize-none" />
        </div>

        {/* Montants */}
        <div className="border border-green-100 rounded-xl p-4 space-y-4 bg-green-50/30">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Montants</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <IconLabel icon={Banknote} color="#16a34a">Montant HT</IconLabel>
              <div className="relative">
                <input type="number" name="montantHT" value={form.montantHT} onChange={handleChange}
                  min="0" step="0.01" placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
              </div>
            </div>
            <div>
              <IconLabel icon={Percent} color="#f59e0b">TVA</IconLabel>
              <div className="relative">
                <input type="number" name="montantTVA" value={form.montantTVA} onChange={handleChange}
                  min="0" max="100" step="0.1" placeholder="20"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">%</span>
              </div>
            </div>
            <div>
              <IconLabel icon={Banknote} color="#2563eb">Montant TTC</IconLabel>
              <div className="border border-green-200 rounded-lg px-3 py-2 text-sm bg-green-50 text-green-800 font-semibold">
                {montantTTC.toFixed(2)} DH
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <IconLabel icon={Globe} color="#0891b2">Devise</IconLabel>
              <select name="devise" value={form.devise} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="MAD">MAD — Dirham marocain</option>
                <option value="EUR">EUR — Euro</option>
                <option value="USD">USD — Dollar américain</option>
                <option value="GBP">GBP — Livre sterling</option>
              </select>
            </div>
            <div>
              <IconLabel icon={CreditCard} color="#7c3aed">Mode de paiement</IconLabel>
              <select name="modePaiement" value={form.modePaiement} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">— Sélectionner —</option>
                <option value="virement">Virement bancaire</option>
                <option value="cheque">Chèque</option>
                <option value="especes">Espèces</option>
                <option value="carte">Carte bancaire</option>
                <option value="traite">Traite</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filtre section ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Filter className="w-4 h-4 text-green-600" />
          <p className="text-sm font-semibold text-green-700 uppercase tracking-wider">Filtre</p>
        </div>

        {/* Filter inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">N° système</label>
            <input type="text" name="numeroSysteme" value={tripFilter.numeroSysteme} onChange={handleFilterChange}
              placeholder="Rechercher..."
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">N° dossier</label>
            <input type="text" name="numeroDossier" value={tripFilter.numeroDossier} onChange={handleFilterChange}
              placeholder="Rechercher..."
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Catégorie véhicule</label>
            <input type="text" name="categorieVehicule" value={tripFilter.categorieVehicule} onChange={handleFilterChange}
              placeholder="Rechercher..."
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date début</label>
            <input type="date" name="dateDebut" value={tripFilter.dateDebut} onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date fin</label>
            <input type="date" name="dateFin" value={tripFilter.dateFin} onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50" />
          </div>
        </div>

        {/* Selection counter */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Search className="w-4 h-4 text-green-500" />
          <span className="font-semibold text-green-700">{selected.size}</span>
          <span>Nombre d'enregistrements sélectionnés</span>
        </div>

        {/* Trips table */}
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-10 px-3 py-2.5"></th>
                {TRIPS_COLUMNS.map((col) => (
                  <th key={col.key} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tripsLoading ? (
                <tr><td colSpan={TRIPS_COLUMNS.length + 1} className="px-3 py-6 text-center text-gray-400 text-xs">Chargement...</td></tr>
              ) : (tripsData?.data || []).length === 0 ? (
                <tr><td colSpan={TRIPS_COLUMNS.length + 1} className="px-3 py-6 text-center text-gray-400 text-xs">Aucun enregistrement trouvé</td></tr>
              ) : (tripsData?.data || []).map((row: any) => {
                const isSelected = selected.has(row._id);
                return (
                  <tr
                    key={row._id}
                    onClick={() => toggleTrip(row._id)}
                    className={cn(
                      'border-b border-gray-50 cursor-pointer transition-colors hover:bg-green-50',
                      isSelected ? 'bg-green-50' : ''
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          'w-4 h-4 rounded border-2 inline-flex items-center justify-center transition-colors',
                          isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
                        )}
                      >
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </td>
                    {TRIPS_COLUMNS.map((col) => (
                      <td key={col.key} className="px-3 py-2.5 text-gray-700">
                        {col.render ? col.render((row as any)[col.key]) : ((row as any)[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(tripsData?.pages || 1) > 1 && (
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-100">
              <button disabled={tripPage <= 1} onClick={() => setTripPage((p) => p - 1)}
                className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Préc.</button>
              <span className="text-xs text-gray-500">{tripPage} / {tripsData?.pages}</span>
              <button disabled={tripPage >= (tripsData?.pages || 1)} onClick={() => setTripPage((p) => p + 1)}
                className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Suiv.</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.numero || !form.client}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
