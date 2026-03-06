'use client';

import { useState, useMemo } from 'react';
import {
  Fuel, TrendingUp, DollarSign, Gauge, Navigation,
  BarChart3, Droplets, Calculator, MapPin, Filter, RefreshCw,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource } from '@/hooks/useResource';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

/* ── columns ──────────────────────────────────────────────── */
type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'numero',           label: 'Numéro' },
  { key: 'date',             label: 'Date',              render: (v) => formatDate(v) },
  { key: 'vehicule',         label: 'Véhicule' },
  { key: 'codeVehicule',     label: 'Code véhicule' },
  { key: 'categorieVehicule',label: 'Catégorie véhicule' },
  { key: 'collaborateur',    label: 'Collaborateur' },
  { key: 'carte',            label: 'Carte' },
  { key: 'typeCarburant',    label: 'Type carburant' },
  { key: 'kilometrage',      label: 'Kilométrage',       render: (v) => v ? `${Number(v).toLocaleString('fr-FR')} km` : '—' },
  { key: 'distanceParcourue',label: 'Distance parcourue',render: (v) => v ? `${Number(v).toLocaleString('fr-FR')} km` : '—' },
  { key: 'pourcentageConso', label: '% conso',           render: (v) => v != null ? `${Number(v).toFixed(2)} %` : '—' },
  { key: 'quantite',         label: 'Quantité',          render: (v) => v != null ? `${Number(v).toFixed(2)} L` : '—' },
  { key: 'prixUnitaire',     label: 'Prix unitaire',     render: (v) => formatCurrency(v) },
  { key: 'montantHT',        label: 'Montant HT',        render: (v) => formatCurrency(v) },
  { key: 'tva',              label: 'TVA',               render: (v) => v != null ? `${Number(v).toFixed(2)} %` : '—' },
  { key: 'montantTTC',       label: 'Montant TTC',       render: (v) => formatCurrency(v) },
  { key: 'plein',            label: 'Plein',             render: (v) => v ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Oui</span> : <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Non</span> },
  { key: 'attachement',      label: 'Attachement' },
  { key: 'utilisateur',      label: 'Utilisateur' },
];

/* ── stat card ─────────────────────────────────────────────── */
function StatCard({
  icon: Icon, label, value, sub, accent, iconBg,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  accent: string; iconBg: string;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden flex items-start gap-3">
      <div className={`flex-shrink-0 rounded-xl p-2.5 ${iconBg}`}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
        <p className="text-lg font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {/* subtle accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: accent }} />
    </div>
  );
}

/* ── page ──────────────────────────────────────────────────── */
export default function CarburantPage() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch, isFetching } = useResource<any>('consommation', { page, search });
  const rows: any[] = data?.data ?? [];

  /* ── analytics ─────────────────────────────────────────── */
  const stats = useMemo(() => {
    const n    = rows.length;
    const sumHT      = rows.reduce((s, r) => s + (Number(r.montantHT)         || 0), 0);
    const sumTTC     = rows.reduce((s, r) => s + (Number(r.montantTTC)        || 0), 0);
    const sumQte     = rows.reduce((s, r) => s + (Number(r.quantite)          || 0), 0);
    const sumDist    = rows.reduce((s, r) => s + (Number(r.distanceParcourue) || 0), 0);
    const avgPrix    = sumQte   > 0 ? sumHT / sumQte   : 0;
    const avgConso   = rows.filter(r => r.pourcentageConso != null).length > 0
      ? rows.reduce((s, r) => s + (Number(r.pourcentageConso) || 0), 0) / rows.filter(r => r.pourcentageConso != null).length
      : 0;
    const coutKm     = sumDist  > 0 ? sumHT / sumDist  : 0;
    const distH      = sumDist;   // km / H is shown as plain km sum here since hours aren't stored
    return { n, sumHT, sumTTC, sumQte, sumDist, distH, avgPrix, avgConso, coutKm };
  }, [rows]);

  const fmt2 = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 65%, #059669 100%)' }}>

          {/* fuel-drop watermark */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
            <Fuel className="w-24 h-24 text-white" strokeWidth={1} />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Fuel className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Carburant</h2>
              <p className="text-emerald-200 text-xs mt-0.5">Analytique & suivi de consommation</p>
            </div>
          </div>

          <button onClick={() => refetch()}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualiser
          </button>
        </div>

        {/* colour band */}
        <div className="flex h-1">
          {['#064e3b','#047857','#059669','#10b981','#34d399','#6ee7b7'].map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
          <Filter className="w-3.5 h-3.5" /> Filtre
        </div>
        <div className="flex-1 min-w-52">
          <SearchFilter onSearch={setSearch} placeholder="Rechercher par véhicule, collaborateur..." filters={[]} />
        </div>
      </div>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard icon={BarChart3}   label="Nombre d'enregistrements"  value={String(stats.n)}               accent="#047857" iconBg="bg-emerald-50" />
        <StatCard icon={DollarSign}  label="Montant total HT"           value={`${fmt2(stats.sumHT)} DH`}    accent="#0891b2" iconBg="bg-cyan-50" />
        <StatCard icon={DollarSign}  label="Montant total TTC"          value={`${fmt2(stats.sumTTC)} DH`}   accent="#7c3aed" iconBg="bg-violet-50" />
        <StatCard icon={Droplets}    label="Quantité totale (L)"        value={fmt2(stats.sumQte)}            accent="#f59e0b" iconBg="bg-amber-50" />
        <StatCard icon={Navigation}  label="Distance parcourue (Km)"    value={fmt2(stats.sumDist)}           accent="#16a34a" iconBg="bg-green-50" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={MapPin}      label="Distance parcourue KM / H"  value={fmt2(stats.distH)}             accent="#0891b2" iconBg="bg-sky-50" />
        <StatCard icon={TrendingUp}  label="Prix unitaire moyen HT"     value={`${fmt2(stats.avgPrix)} DH`}  accent="#dc2626" iconBg="bg-red-50" />
        <StatCard icon={Gauge}       label="Taux de consommation moy."  value={fmt2(stats.avgConso)}          accent="#d97706" iconBg="bg-orange-50" />
        <StatCard icon={Calculator}  label="Coût par kilomètre"         value={fmt2(stats.coutKm)}            accent="#7c3aed" iconBg="bg-purple-50" />
      </div>

      {/* ── Data table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-emerald-500" />
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Enregistrements</p>
          {data?.total != null && (
            <span className="ml-auto text-xs text-gray-400">{data.total} entrée{data.total !== 1 ? 's' : ''}</span>
          )}
        </div>
        <DataTable
          columns={LIST_COLUMNS}
          data={rows}
          loading={isLoading}
          total={data?.total || 0}
          page={page}
          pages={data?.pages || 1}
          onPageChange={setPage}
          emptyMessage="Aucun enregistrement de carburant trouvé"
        />
      </div>
    </div>
  );
}

