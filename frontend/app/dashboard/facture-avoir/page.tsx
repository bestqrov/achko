'use client';

import { useState, useMemo } from 'react';
import {
  Plus, ArrowLeft, FileX, FileText, Hash,
  CalendarDays, User, Truck, MessageSquare, Banknote, Percent, Globe,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  designation: '',
  numeroFacture: '',
  date: '',
  reference: '',
  client: '',
  vehicle: '',
  notes: '',
  montantHT: '',
  montantTVA: '',
  devise: 'MAD',
};

const LIST_COLUMNS = [
  { key: 'numero',      label: 'Numéro' },
  { key: 'client',      label: 'Client' },
  { key: 'date',        label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'montantTTC',  label: 'Montant TTC', render: (v: number) => formatCurrency(v) },
  {
    key: 'statut', label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>{v}</span>
    ),
  },
];

const FACTURES_COLUMNS = [
  { key: 'numero',        label: 'Numéro' },
  { key: 'date',          label: 'Date',          render: (v: string) => formatDate(v) },
  { key: 'montantTTC',    label: 'Montant',        render: (v: number) => formatCurrency(v) },
  { key: 'montantPaye',   label: 'Montant payé',   render: (v: number) => v != null ? formatCurrency(v) : '—' },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function FactureAvoirPage() {
  const [view, setView]         = useState<'list' | 'form'>('list');
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState(EMPTY_FORM);
  const [facturePage, setFacturePage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading }         = useResource<any>('factures', { page, search, type: 'avoir' });
  const { data: vehiclesData }      = useResource<any>('vehicles', { limit: 200 });
  const { data: facturesData, isLoading: facturesLoading } = useResource<any>('factures', {
    page: facturePage,
    limit: 10,
    type: 'facture',
  });
  const create = useCreateResource('factures');

  const montantTTC = useMemo(() => {
    const ht  = parseFloat(form.montantHT)  || 0;
    const tva = parseFloat(form.montantTVA) || 0;
    return ht + ht * (tva / 100);
  }, [form.montantHT, form.montantTVA]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleFacture = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleCancel = () => { setForm(EMPTY_FORM); setSelected(new Set()); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      type: 'avoir',
      montantTTC,
      factures: Array.from(selected),
    });
    handleCancel();
  };

  /* ── LIST VIEW ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Factures Avoir</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des avoirs et remboursements</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #581c87 0%, #7e22ce 60%, #9333ea 100%)' }}
          >
            <Plus className="w-4 h-4" /> Nouvel Avoir
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un avoir..." filters={[]} />
        <DataTable
          columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun avoir trouvé"
        />
      </div>
    );
  }

  /* ── FORM VIEW (in-page) ── */
  return (
    <div className="space-y-6">
      {/* Purple gradient header */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #3b0764 0%, #581c87 40%, #7e22ce 75%, #9333ea 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <FileX className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvel Avoir</h3>
              <p className="text-purple-100 text-xs">Remplissez les informations de l'avoir</p>
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

      {/* Main form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

        {/* Désignation + N° de facture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={FileX} color="#9333ea">Désignation</IconLabel>
            <input type="text" name="designation" value={form.designation} onChange={handleChange}
              placeholder="Désignation de l'avoir"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Hash} color="#7c3aed">N° de facture</IconLabel>
            <input type="text" name="numeroFacture" value={form.numeroFacture} onChange={handleChange}
              placeholder="N° de la facture d'origine"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" />
          </div>
        </div>

        {/* Date + Référence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={CalendarDays} color="#16a34a">Date</IconLabel>
            <input type="date" name="date" value={form.date} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={FileText} color="#0891b2">Référence</IconLabel>
            <input type="text" name="reference" value={form.reference} onChange={handleChange}
              placeholder="Référence"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" />
          </div>
        </div>

        {/* Client + Flotte / Véhicule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={User} color="#2563eb">Client *</IconLabel>
            <input type="text" name="client" value={form.client} onChange={handleChange}
              placeholder="Nom du client"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Truck} color="#0891b2">Flotte</IconLabel>
            <select name="vehicle" value={form.vehicle} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50">
              <option value="">— Sélectionner un véhicule —</option>
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
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 resize-none" />
        </div>

        {/* Montants */}
        <div className="border border-purple-100 rounded-xl p-4 space-y-4 bg-purple-50/30">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Montants</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <IconLabel icon={Banknote} color="#16a34a">Montant HT</IconLabel>
              <div className="relative">
                <input type="number" name="montantHT" value={form.montantHT} onChange={handleChange}
                  min="0" step="0.01" placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
              </div>
            </div>
            <div>
              <IconLabel icon={Percent} color="#f59e0b">TVA</IconLabel>
              <div className="relative">
                <input type="number" name="montantTVA" value={form.montantTVA} onChange={handleChange}
                  min="0" max="100" step="0.1" placeholder="20"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
              </div>
            </div>
            <div>
              <IconLabel icon={Banknote} color="#9333ea">Montant TTC</IconLabel>
              <div className="border border-purple-200 rounded-lg px-3 py-2 text-sm bg-purple-50 text-purple-800 font-semibold">
                {montantTTC.toFixed(2)} DH
              </div>
            </div>
          </div>
          <div className="sm:w-1/2">
            <IconLabel icon={Globe} color="#0891b2">Devise</IconLabel>
            <select name="devise" value={form.devise} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              <option value="MAD">MAD — Dirham marocain</option>
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — Dollar américain</option>
              <option value="GBP">GBP — Livre sterling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Factures liées */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Factures liées</p>

        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-10 px-3 py-2.5"></th>
                {FACTURES_COLUMNS.map((col) => (
                  <th key={col.key} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facturesLoading ? (
                <tr><td colSpan={FACTURES_COLUMNS.length + 1} className="px-3 py-6 text-center text-gray-400 text-xs">Chargement...</td></tr>
              ) : (facturesData?.data || []).length === 0 ? (
                <tr><td colSpan={FACTURES_COLUMNS.length + 1} className="px-3 py-6 text-center text-gray-400 text-xs">Aucune facture disponible</td></tr>
              ) : (facturesData?.data || []).map((row: any) => {
                const isSel = selected.has(row._id);
                return (
                  <tr
                    key={row._id}
                    onClick={() => toggleFacture(row._id)}
                    className={cn(
                      'border-b border-gray-50 cursor-pointer transition-colors hover:bg-purple-50',
                      isSel ? 'bg-purple-50' : ''
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <span className={cn(
                        'w-4 h-4 rounded border-2 inline-flex items-center justify-center transition-colors',
                        isSel ? 'border-purple-500 bg-purple-500' : 'border-gray-300 bg-white'
                      )}>
                        {isSel && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </td>
                    {FACTURES_COLUMNS.map((col) => (
                      <td key={col.key} className="px-3 py-2.5 text-gray-700">
                        {col.render ? col.render((row as any)[col.key]) : ((row as any)[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(facturesData?.pages || 1) > 1 && (
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-100">
              <button disabled={facturePage <= 1} onClick={() => setFacturePage((p) => p - 1)}
                className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Préc.</button>
              <span className="text-xs text-gray-500">{facturePage} / {facturesData?.pages}</span>
              <button disabled={facturePage >= (facturesData?.pages || 1)} onClick={() => setFacturePage((p) => p + 1)}
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
          style={{ background: 'linear-gradient(135deg, #581c87 0%, #9333ea 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.client}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
