'use client';

import { useState, useMemo } from 'react';
import {
  Wrench, DollarSign, BarChart3, Filter, RefreshCw,
  Package, Calculator, TrendingUp, Layers,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource } from '@/hooks/useResource';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

/* ── KPI card ──────────────────────────────────────────────── */
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

/* ── columns ───────────────────────────────────────────────── */
const STATUT_STYLE: Record<string, string> = {
  planifiée:  'bg-blue-100 text-blue-700',
  en_cours:   'bg-amber-100 text-amber-700',
  terminée:   'bg-green-100 text-green-700',
  annulée:    'bg-red-100   text-red-700',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const COLS_DEMANDE: Col[] = [
  { key: 'titre',            label: 'Titre' },
  { key: 'dateIntervention', label: 'Date',       render: (v) => formatDate(v) },
  { key: 'prestataire',      label: 'Prestataire' },
  { key: 'kilometrage',      label: 'Kilométrage', render: (v) => v ? `${Number(v).toLocaleString('fr-FR')} km` : '—' },
  { key: 'statut',           label: 'Statut',      render: (v) => v ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[v] ?? 'bg-gray-100 text-gray-600'}`}>{v}</span> : '—' },
];
const COLS_INTERVENTION: Col[] = [
  { key: 'titre',              label: 'Titre' },
  { key: 'dateIntervention',   label: 'Date',           render: (v) => formatDate(v) },
  { key: 'prestataire',        label: 'Prestataire' },
  { key: 'montantMainOeuvreHT',label: 'MO HT',          render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'montantPiecesHT',    label: 'Pièces HT',      render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'montantTotalHT',     label: 'Total HT',       render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'montantTotalTTC',    label: 'Total TTC',      render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'statut',             label: 'Statut',         render: (v) => v ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLE[v] ?? 'bg-gray-100 text-gray-600'}`}>{v}</span> : '—' },
];

/* ── page ──────────────────────────────────────────────────── */
export default function InterventionsPage() {
  const [tab, setTab]       = useState<'demande' | 'intervention'>('demande');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');

  /* demandes = planifiées; interventions = en_cours | terminée | annulée */
  const demandeParams      = useMemo(() => ({ page, search, type: 'intervention', statut: 'planifiée' }), [page, search]);
  const interventionParams = useMemo(() => ({ page, search, type: 'intervention' }), [page, search]);

  const { data: dData, isLoading: dLoading, refetch, isFetching } =
    useResource<any>('maintenance', tab === 'demande' ? demandeParams : interventionParams);

  /* analytics always over all interventions */
  const { data: allData } = useResource<any>('maintenance', { type: 'intervention', limit: 9999 });
  const rows: any[] = allData?.data ?? [];

  const stats = useMemo(() => {
    const sum = (key: string) => rows.reduce((s, r) => s + (Number(r[key]) || 0), 0);
    const moHT  = sum('montantMainOeuvreHT');
    const moTTC = sum('montantMainOeuvreTTC');
    const pHT   = sum('montantPiecesHT');
    const pTTC  = sum('montantPiecesTTC');
    return {
      n:     allData?.total ?? rows.length,
      moHT,  moTTC,
      pHT,   pTTC,
      totHT:  moHT  + pHT,
      totTTC: moTTC + pTTC,
    };
  }, [rows, allData?.total]);

  const f2 = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fDH = (n: number) => `${f2(n)} DH`;

  const activeRows: any[] = dData?.data ?? [];

  const TABS = [
    { key: 'demande',       label: "Demande d'intervention" },
    { key: 'intervention',  label: 'Intervention' },
  ] as const;

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#3730a3 35%,#4f46e5 70%,#6366f1 100%)' }}>

          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none">
            <Wrench className="w-28 h-28 text-white" strokeWidth={0.7} />
          </div>
          {[{x:70,y:18},{x:82,y:55},{x:88,y:30}].map((p,i)=>(
            <div key={i} className="absolute w-2 h-2 rounded-full bg-indigo-300/25 pointer-events-none"
              style={{left:`${p.x}%`,top:`${p.y}%`}} />
          ))}

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Wrench className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Interventions</h2>
              <p className="text-indigo-200 text-xs mt-0.5">Analytique & suivi des interventions</p>
            </div>
          </div>

          <button onClick={() => refetch()}
            className="z-10 flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualiser
          </button>
        </div>
        <div className="flex h-1">
          {['#1e1b4b','#3730a3','#4f46e5','#6366f1','#818cf8','#a5b4fc'].map((c,i)=>(
            <div key={i} className="flex-1" style={{background:c}} />
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700">
          <Filter className="w-3.5 h-3.5" /> Filtre
        </div>
        <div className="flex-1 min-w-52">
          <SearchFilter onSearch={setSearch} placeholder="Rechercher par titre, prestataire..." filters={[]} />
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard icon={BarChart3}   label="Nombre d'enregistrements"       value={String(stats.n)}       accent="#4f46e5" iconBg="bg-indigo-50" />
        <StatCard icon={DollarSign}  label="Montant main d'oeuvre TTC"      value={fDH(stats.moTTC)}      accent="#0891b2" iconBg="bg-cyan-50" />
        <StatCard icon={Package}     label="Montant pièce TTC"              value={fDH(stats.pTTC)}       accent="#7c3aed" iconBg="bg-violet-50" />
        <StatCard icon={Calculator}  label="Montant total TTC"              value={fDH(stats.totTTC)}     accent="#059669" iconBg="bg-emerald-50" />
        <StatCard icon={TrendingUp}  label="Montant main d'oeuvre HT"      value={fDH(stats.moHT)}       accent="#d97706" iconBg="bg-amber-50" />
        <StatCard icon={Layers}      label="Montant pièces HT"             value={fDH(stats.pHT)}        accent="#dc2626" iconBg="bg-red-50" />
        <StatCard icon={DollarSign}  label="Montant total HT"              value={fDH(stats.totHT)}      accent="#0f766e" iconBg="bg-teal-50" />
      </div>

      {/* ── Tabbed table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
                tab === t.key
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50/60'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Table header strip */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-indigo-500" />
          <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">
            {tab === 'demande' ? "Demandes d'intervention" : 'Interventions'}
          </p>
          {dData?.total != null && (
            <span className="ml-auto text-xs text-gray-400">
              {dData.total} enregistrement{dData.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <DataTable
          columns={tab === 'demande' ? COLS_DEMANDE : COLS_INTERVENTION}
          data={activeRows}
          loading={dLoading}
          total={dData?.total || 0}
          page={page}
          pages={dData?.pages || 1}
          onPageChange={setPage}
          emptyMessage={tab === 'demande' ? "Aucune demande d'intervention" : 'Aucune intervention trouvée'}
        />
      </div>
    </div>
  );
}
