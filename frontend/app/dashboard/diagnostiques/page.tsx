'use client';

import { useState, useMemo } from 'react';
import { Activity, BarChart3, Filter, RefreshCw } from 'lucide-react';
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
  { key: 'kilometrage',      label: 'Numéro',     render: (v) => v ? v.toLocaleString('fr-FR') : '—' },
  { key: 'dateIntervention', label: 'Date',       render: (v) => formatDate(v) },
  { key: 'prestataire',      label: 'Utilisateur' },
  { key: 'statut',           label: 'Statut',     render: badge },
];

/* ── page ───────────────────────────────────────────── */
export default function DiagnostiquesPage() {
  const [tab, setTab]       = useState<'demande' | 'diagnostic'>('demande');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');

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

          <button onClick={() => refetch()}
            className="z-10 flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualiser
          </button>
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
