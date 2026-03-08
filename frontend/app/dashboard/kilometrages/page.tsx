'use client';

import { useState, useMemo } from 'react';
import {
  Gauge, List, Plus, RefreshCw, Car, Calendar,
  ArrowUpRight, LayoutGrid, MessageSquare,
} from 'lucide-react';
import ValidatedInput from '@/components/Forms/ValidatedInput';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

/* ── helpers ─────────────────────────────────────────── */
const inputCls = (ring = 'focus:ring-orange-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

function FL({ icon: Icon, label, color = 'text-orange-500' }: {
  icon: React.ElementType; label: string; color?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
    </label>
  );
}

/* ── columns ─────────────────────────────────────────── */
const COLS = [
  {
    key: 'vehicleId',
    label: 'Véhicule',
    render: (v: any) => {
      const name = v?.designation || v?.matricule || (typeof v === 'string' ? v : '—');
      return (
        <div className="flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <span className="font-medium text-gray-800">{name}</span>
        </div>
      );
    },
  },
  {
    key: 'kilometrageDate',
    label: 'Date kilométrage',
    render: (v: any) => (
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        <span>{formatDate(v)}</span>
      </div>
    ),
  },
  {
    key: 'kilometres',
    label: 'Kilomètres',
    render: (v: any) => (
      <div className="flex items-center gap-1.5">
        <ArrowUpRight className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        <span className="font-bold text-gray-900">{Number(v).toLocaleString('fr-FR')}</span>
        <span className="text-xs text-gray-400 font-semibold">km</span>
      </div>
    ),
  },
  {
    key: 'commentaire',
    label: 'Commentaire',
    render: (v: any) => v || <span className="text-gray-300">—</span>,
  },
];

/* ── empty form ─────────────────────────────────────── */
const EMPTY = { vehicleId: '', kilometrageDate: '', kilometres: '', commentaire: '' };

/* ════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════ */
export default function KilometragesPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const params = useMemo(() => ({ page, search }), [page, search]);
  const { data, isLoading, refetch, isFetching } = useResource<any>('kilometrages', params);
  const { data: vData } = useResource<any>('vehicles', { page: 1, limit: 200 });
  const create = useCreateResource('kilometrages');

  const rows: any[]     = data?.data ?? [];
  const vehicles: any[] = vData?.data ?? [];

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const errs: Record<string,string> = {};
    if (!form.vehicleId) errs.vehicleId = 'Véhicule requis';
    if (!form.kilometrageDate) errs.kilometrageDate = 'Date requise';
    if (!form.kilometres) errs.kilometres = 'Kilométrage requis';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await create.mutateAsync({
        ...form,
        kilometres: form.kilometres ? Number(form.kilometres) : 0,
      });
      setForm(EMPTY);
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#7c2d12 0%,#c2410c 40%,#ea580c 75%,#fb923c 100%)' }}>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
            <Gauge className="w-32 h-32 text-white" strokeWidth={0.6} />
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Gauge className="w-5 h-5 text-orange-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Kilométrage</h2>
              <p className="text-orange-200 text-xs mt-0.5">Suivi des kilométrages de la flotte</p>
            </div>
          </div>

          <div className="z-10 flex items-center gap-2">
            {view === 'list' ? (
              <button onClick={() => setView('form')}
                className="flex items-center gap-2 text-sm font-bold text-orange-900 bg-white hover:bg-orange-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <Plus className="w-4 h-4" /> Nouveau kilométrage
              </button>
            ) : (
              <button onClick={() => { setView('list'); setForm(EMPTY); }}
                className="flex items-center gap-2 text-sm font-bold text-orange-900 bg-white hover:bg-orange-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <List className="w-4 h-4" /> Voir la liste
              </button>
            )}
            <button onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        {/* rainbow bar */}
        <div className="flex h-1">
          {['#7c2d12','#9a3412','#c2410c','#ea580c','#f97316','#fb923c'].map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ════ LIST VIEW ════ */}
      {view === 'list' && (
        <>
          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Gauge,        label: 'Saisies totales', value: data?.total ?? 0, bg: 'bg-orange-50',  iconBg: 'bg-orange-500',  text: 'text-orange-700' },
              { icon: Car,          label: 'Véhicules',       value: vehicles.length,  bg: 'bg-blue-50',    iconBg: 'bg-blue-500',    text: 'text-blue-700' },
              { icon: ArrowUpRight, label: 'Total km saisis', value: rows.reduce((s, r) => s + (r.kilometres || 0), 0).toLocaleString('fr-FR') + ' km',
                bg: 'bg-green-50', iconBg: 'bg-green-500', text: 'text-green-700' },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-3.5 flex items-center gap-3 border border-white shadow-sm`}>
                <div className={`${k.iconBg} p-2 rounded-xl flex-shrink-0`}>
                  <k.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className={`text-xl font-black ${k.text}`}>{k.value}</p>
                  <p className="text-[11px] text-gray-500 font-semibold leading-tight">{k.label}</p>
                </div>
              </div>
            ))}
          </div>

          <SearchFilter onSearch={setSearch} placeholder="Rechercher un kilométrage..." filters={[]} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'linear-gradient(90deg,#ea580c,#f97316)' }}>
              <LayoutGrid className="w-4 h-4 text-white/80" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Kilométrages enregistrés</p>
              {data?.total != null && (
                <span className="ml-auto text-xs text-orange-200 font-semibold">{data.total} saisie{data.total !== 1 ? 's' : ''}</span>
              )}
            </div>
            <DataTable
              columns={COLS} data={rows} loading={isLoading}
              total={data?.total || 0} page={page} pages={data?.pages || 1}
              onPageChange={setPage} emptyMessage="Aucun kilométrage enregistré"
            />
          </div>
        </>
      )}

      {/* ════ FORM VIEW ════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Form card */}
          <div className="rounded-2xl border border-orange-200 overflow-hidden shadow-sm">
            {/* Section header */}
            <div className="px-5 py-3 flex items-center gap-2.5 border-b border-orange-200"
              style={{ background: 'linear-gradient(90deg,#fff7ed,#ffedd5)' }}>
              <div className="bg-orange-500 p-1.5 rounded-lg flex-shrink-0">
                <Gauge className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-extrabold text-orange-800 uppercase tracking-widest">
                Saisie du kilométrage
              </h3>
            </div>

            <div className="bg-white p-6 space-y-5">

              {/* Véhicule */}
              <div>
                <FL icon={Car} label="Véhicule" color="text-blue-600" />
                <select
                  value={form.vehicleId}
                  onChange={e => set('vehicleId', e.target.value)}
                  className={`${inputCls('focus:ring-blue-400')} ${fieldErrors.vehicleId ? 'border-red-500' : ''}`}
                >
                  <option value="">— Sélectionner un véhicule —</option>
                  {vehicles.map((v: any) => (
                    <option key={v._id} value={v._id}>
                      {v.designation || v.matricule || v._id}
                      {v.immatricule ? ` — ${v.immatricule}` : v.matricule && v.designation ? ` — ${v.matricule}` : ''}
                    </option>
                  ))}
                </select>
                {fieldErrors.vehicleId && <p className="text-red-600 text-xs mt-1">{fieldErrors.vehicleId}</p>}
              </div>

              {/* Date + Kilomètres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <ValidatedInput
                    icon={Calendar} label="Date kilométrage" type="date" required
                    value={form.kilometrageDate}
                    onChange={e => set('kilometrageDate', e.target.value)}
                    error={fieldErrors.kilometrageDate}
                    className={inputCls('focus:ring-violet-400')}
                  />
                </div>
                <div>
                  <FL icon={Gauge} label="Kilomètres" color="text-orange-600" />
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={form.kilometres}
                      onChange={e => set('kilometres', e.target.value)}
                      placeholder="0"
                      className={`${inputCls('focus:ring-orange-400')} pr-12 ${fieldErrors.kilometres ? 'border-red-500' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-orange-500">km</span>
                  </div>
                  {fieldErrors.kilometres && <p className="text-red-600 text-xs mt-1">{fieldErrors.kilometres}</p>}
                </div>
              </div>

              {/* Commentaire */}
              <div>
                <FL icon={MessageSquare} label="Commentaire" color="text-gray-500" />
                <textarea
                  rows={3}
                  value={form.commentaire}
                  onChange={e => set('commentaire', e.target.value)}
                  placeholder="Remarques, observations..."
                  className={`${inputCls('focus:ring-gray-400')} resize-none`}
                />
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setView('list'); setForm(EMPTY); }}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}
            >
              {saving ? 'Enregistrement...' : '✓ Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

