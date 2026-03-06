'use client';

import { useState, useMemo } from 'react';
import { Activity, BarChart3, Filter, RefreshCw, Plus } from 'lucide-react';
import Modal from '@/components/Forms/Modal';
import { useCreateResource } from '@/hooks/useResource';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

/* ── KPI card ───────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent, iconBg }: {
  icon: React.ElementType; label: string; value: string;
  accent: string; iconBg: string;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden flex items-start gap-3">
      <div className={`flex-shrink-0 rounded-xl p-2.5 ${iconBg}`}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium leading-tight">{label}</p>
        <p className="text-base font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: accent }} />
    </div>
  );
}

/* ── statut badge ───────────────────────────────────── */
const STATUT_STYLE: Record<string, string> = {
  planifiée:  'bg-blue-100 text-blue-700',
  en_cours:   'bg-amber-100 text-amber-700',
  terminée:   'bg-green-100 text-green-700',
  annulée:    'bg-red-100   text-red-700',
};
const badge = (v: any) => v
  ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[v] ?? 'bg-gray-100 text-gray-600'}`}>{v}</span>
  : '—';

/* ── columns ────────────────────────────────────────── */
type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };

const COLS_DEMANDE: Col[] = [
  { key: 'titre',            label: 'N° système' },
  { key: 'description',      label: 'Description' },
  { key: 'vehicle',          label: 'Véhicule',   render: (v) => v?.immatriculation ?? v?.marque ?? '—' },
  { key: 'statut',           label: 'Statut',     render: badge },
];

const COLS_DIAGNOSTIC: Col[] = [
  { key: 'titre',            label: 'N° système' },
  { key: 'numero',           label: 'Numéro' },
  { key: 'dateIntervention', label: 'Date',       render: (v) => formatDate(v) },
  { key: 'chauffeur',        label: 'Utilisateur' },
  { key: 'statut',           label: 'Statut',     render: badge },
];

/* ── empty form ──────────────────────────────────────── */
const EMPTY = {
  vehicle: '', chauffeur: '', titre: '', numero: '',
  dateIntervention: new Date().toISOString().slice(0, 10),
  kilometrage: '', immobiliser: false,
  description: '', notes: '',
  categorie: '', sousType: '', degreGravite: '', degreUrgence: '',
};

const TYPES_OPTIONS   = ['Mécanique', 'Électrique', 'Électronique', 'Carrosserie', 'Autre'];
const CATS_OPTIONS    = ['Préventif', 'Curatif', 'Réglementaire', 'Autre'];
const GRAVITE_OPTIONS = ['faible', 'modérée', 'élevée', 'critique'];
const URGENCE_OPTIONS = ['faible', 'normale', 'urgente', 'critique'];

/* ── page ───────────────────────────────────────────── */
export default function DiagnostiquesPage() {
  const [tab, setTab]       = useState<'demande' | 'diagnostic'>('demande');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving]     = useState(false);

  const { data: vehicleData } = useResource<any>('vehicles', { limit: 999 });
  const vehicles: any[] = vehicleData?.data ?? [];
  const create = useCreateResource('maintenance');

  const set = (field: string, val: any) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await create.mutateAsync({
        ...form,
        type: 'diagnostique',
        statut: 'planifiée',
        kilometrage: form.kilometrage ? Number(form.kilometrage) : undefined,
      });
      setShowForm(false);
      setForm(EMPTY);
    } finally {
      setSaving(false);
    }
  };

  const demandeParams    = useMemo(() => ({ page, search, type: 'diagnostique', statut: 'planifiée' }), [page, search]);
  const diagParams       = useMemo(() => ({ page, search, type: 'diagnostique' }), [page, search]);

  const { data: activeData, isLoading, refetch, isFetching } =
    useResource<any>('maintenance', tab === 'demande' ? demandeParams : diagParams);

  /* total count over all diagnostiques */
  const { data: allData } = useResource<any>('maintenance', { type: 'diagnostique', limit: 9999 });
  const totalCount = allData?.total ?? 0;

  const activeRows: any[] = activeData?.data ?? [];

  const TABS = [
    { key: 'demande',     label: "Demande d'intervention" },
    { key: 'diagnostic',  label: 'Diagnostic' },
  ] as const;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 40%,#0284c7 70%,#38bdf8 100%)' }}>

          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none">
            <Activity className="w-28 h-28 text-white" strokeWidth={0.7} />
          </div>
          {[{x:70,y:18},{x:83,y:55},{x:89,y:30}].map((p,i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-sky-300/25 pointer-events-none"
              style={{ left:`${p.x}%`, top:`${p.y}%` }} />
          ))}

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Activity className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Diagnostiques</h2>
              <p className="text-sky-200 text-xs mt-0.5">Suivi des diagnostiques véhicules</p>
            </div>
          </div>

          <div className="z-10 flex items-center gap-2">
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-sm font-semibold text-sky-900 bg-white hover:bg-sky-50 px-3 py-1.5 rounded-lg shadow transition-all">
              <Plus className="w-4 h-4" /> Demande d&apos;intervention
            </button>
            <button onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualiser
            </button>
          </div>
        </div>
        <div className="flex h-1">
          {['#0c4a6e','#075985','#0369a1','#0284c7','#0ea5e9','#38bdf8'].map((c,i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold text-sky-700">
          <Filter className="w-3.5 h-3.5" /> Filtre
        </div>
        <div className="flex-1 min-w-52">
          <SearchFilter onSearch={setSearch} placeholder="Rechercher par titre, prestataire..." filters={[]} />
        </div>
      </div>

      {/* ── KPI card ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={BarChart3} label="Nombre d'enregistrements" value={String(totalCount)} accent="#0284c7" iconBg="bg-sky-50" />
      </div>

      {/* ── Create form modal ── */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setForm(EMPTY); }}
        title="Demande d'intervention" size="xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Véhicule */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Véhicule <span className="text-red-500">*</span></label>
            <select required value={form.vehicle} onChange={e => set('vehicle', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50">
              <option value="">Sélectionner un véhicule</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>
                  {v.immatriculation ?? v.marque ?? v._id}
                </option>
              ))}
            </select>
          </div>

          {/* Chauffeur */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Chauffeur <span className="text-red-500">*</span></label>
            <input required type="text" value={form.chauffeur} onChange={e => set('chauffeur', e.target.value)}
              placeholder="Nom du chauffeur"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50" />
          </div>

          {/* Row: Désignation | Numéro | Date | Kilométrage */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Désignation</label>
              <input type="text" value={form.titre} onChange={e => set('titre', e.target.value)}
                placeholder="Désignation"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Numéro</label>
              <input type="text" value={form.numero} onChange={e => set('numero', e.target.value)}
                placeholder="Numéro"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Date <span className="text-red-500">*</span></label>
              <input required type="date" value={form.dateIntervention} onChange={e => set('dateIntervention', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Kilométrage</label>
              <div className="relative">
                <input type="number" min="0" value={form.kilometrage} onChange={e => set('kilometrage', e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">KM</span>
              </div>
            </div>
          </div>

          {/* Immobiliser toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => set('immobiliser', !form.immobiliser)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.immobiliser ? 'bg-sky-500' : 'bg-gray-200'
              }`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                form.immobiliser ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className="text-sm font-medium text-gray-700">Immobiliser</span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea required rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Description de la demande"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 resize-none" />
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Commentaire</label>
            <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Commentaire optionnel"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 resize-none" />
          </div>

          {/* Informations générales */}
          <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4 space-y-3">
            <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">Informations générales</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Catégories</label>
                <select value={form.categorie} onChange={e => set('categorie', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                  <option value="">—</option>
                  {CATS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Type <span className="text-red-500">*</span></label>
                <select required value={form.sousType} onChange={e => set('sousType', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                  <option value="">Sélectionner</option>
                  {TYPES_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Degré de gravité</label>
                <select value={form.degreGravite} onChange={e => set('degreGravite', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                  <option value="">—</option>
                  {GRAVITE_OPTIONS.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Degré d&apos;urgence</label>
                <select value={form.degreUrgence} onChange={e => set('degreUrgence', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white">
                  <option value="">—</option>
                  {URGENCE_OPTIONS.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); }}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow transition-all disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Tabbed table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
                tab === t.key
                  ? 'border-sky-500 text-sky-700 bg-sky-50/60'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Table header strip */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-sky-50 to-cyan-50 border-b border-sky-100 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-sky-500" />
          <p className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
            {tab === 'demande' ? "Demandes d'intervention" : 'Diagnostiques'}
          </p>
          {activeData?.total != null && (
            <span className="ml-auto text-xs text-gray-400">
              {activeData.total} enregistrement{activeData.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <DataTable
          columns={tab === 'demande' ? COLS_DEMANDE : COLS_DIAGNOSTIC}
          data={activeRows}
          loading={isLoading}
          total={activeData?.total || 0}
          page={page}
          pages={activeData?.pages || 1}
          onPageChange={setPage}
          emptyMessage={tab === 'demande' ? "Aucune demande d'intervention" : 'Aucun diagnostique trouvé'}
        />
      </div>
    </div>
  );
}
