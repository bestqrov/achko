'use client';

import { useState, useMemo } from 'react';
import {
  Clock, List, Plus, RefreshCw, Car, Calendar,
  Timer, LayoutGrid, MessageSquare, ArrowUpRight,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

/* ── helpers ─────────────────────────────────────────── */
const inputCls = (ring = 'focus:ring-violet-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

function FL({ icon: Icon, label, color = 'text-violet-500' }: {
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
          <Car className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <span className="font-medium text-gray-800">{name}</span>
        </div>
      );
    },
  },
  {
    key: 'indexeHoraireDate',
    label: 'Date indexe horaire',
    render: (v: any) => (
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <span>{formatDate(v)}</span>
      </div>
    ),
  },
  {
    key: 'heures',
    label: 'Indexe horaire',
    render: (v: any) => (
      <div className="flex items-center gap-1.5">
        <ArrowUpRight className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
        <span className="font-bold text-gray-900">{Number(v).toLocaleString('fr-FR')}</span>
        <span className="text-xs text-gray-400 font-semibold">H</span>
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
const EMPTY = { vehicleId: '', indexeHoraireDate: '', heures: '', commentaire: '' };

/* ════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════ */
export default function IndexeHorairePage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const params = useMemo(() => ({ page, search }), [page, search]);
  const { data, isLoading, refetch, isFetching } = useResource<any>('indexe-horaire', params);
  const { data: vData } = useResource<any>('vehicles', { page: 1, limit: 200 });
  const create = useCreateResource('indexe-horaire');

  const rows: any[]     = data?.data ?? [];
  const vehicles: any[] = vData?.data ?? [];

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await create.mutateAsync({
        ...form,
        heures: form.heures ? Number(form.heures) : 0,
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
          style={{ background: 'linear-gradient(135deg,#3b0764 0%,#6d28d9 40%,#7c3aed 75%,#a78bfa 100%)' }}>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
            <Clock className="w-32 h-32 text-white" strokeWidth={0.6} />
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Clock className="w-5 h-5 text-violet-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Indexe horaire</h2>
              <p className="text-violet-200 text-xs mt-0.5">Suivi de l&apos;indexe horaire de la flotte</p>
            </div>
          </div>

          <div className="z-10 flex items-center gap-2">
            {view === 'list' ? (
              <button onClick={() => setView('form')}
                className="flex items-center gap-2 text-sm font-bold text-violet-900 bg-white hover:bg-violet-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <Plus className="w-4 h-4" /> Nouvel indexe
              </button>
            ) : (
              <button onClick={() => { setView('list'); setForm(EMPTY); }}
                className="flex items-center gap-2 text-sm font-bold text-violet-900 bg-white hover:bg-violet-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <List className="w-4 h-4" /> Voir la liste
              </button>
            )}
            <button onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        {/* color bar */}
        <div className="flex h-1">
          {['#3b0764','#4c1d95','#6d28d9','#7c3aed','#8b5cf6','#a78bfa'].map((c, i) => (
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
              { icon: Clock,        label: 'Saisies totales', value: data?.total ?? 0,   bg: 'bg-violet-50',  iconBg: 'bg-violet-600',  text: 'text-violet-700' },
              { icon: Car,          label: 'Véhicules',       value: vehicles.length,     bg: 'bg-blue-50',    iconBg: 'bg-blue-500',    text: 'text-blue-700' },
              { icon: Timer,        label: 'Total heures',
                value: rows.reduce((s, r) => s + (r.heures || 0), 0).toLocaleString('fr-FR') + ' H',
                bg: 'bg-indigo-50', iconBg: 'bg-indigo-500', text: 'text-indigo-700' },
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

          <SearchFilter onSearch={setSearch} placeholder="Rechercher un indexe horaire..." filters={[]} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'linear-gradient(90deg,#6d28d9,#7c3aed)' }}>
              <LayoutGrid className="w-4 h-4 text-white/80" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Indexe horaires enregistrés</p>
              {data?.total != null && (
                <span className="ml-auto text-xs text-violet-200 font-semibold">{data.total} saisie{data.total !== 1 ? 's' : ''}</span>
              )}
            </div>
            <DataTable
              columns={COLS} data={rows} loading={isLoading}
              total={data?.total || 0} page={page} pages={data?.pages || 1}
              onPageChange={setPage} emptyMessage="Aucun indexe horaire enregistré"
            />
          </div>
        </>
      )}

      {/* ════ FORM VIEW ════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="rounded-2xl border border-violet-200 overflow-hidden shadow-sm">
            {/* Section header */}
            <div className="px-5 py-3 flex items-center gap-2.5 border-b border-violet-200"
              style={{ background: 'linear-gradient(90deg,#f5f3ff,#ede9fe)' }}>
              <div className="bg-violet-600 p-1.5 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-extrabold text-violet-800 uppercase tracking-widest">
                Saisie de l&apos;indexe horaire
              </h3>
            </div>

            <div className="bg-white p-6 space-y-5">

              {/* Véhicule */}
              <div>
                <FL icon={Car} label="Véhicule" color="text-blue-600" />
                <select
                  required
                  value={form.vehicleId}
                  onChange={e => set('vehicleId', e.target.value)}
                  className={inputCls('focus:ring-blue-400')}
                >
                  <option value="">— Sélectionner un véhicule —</option>
                  {vehicles.map((v: any) => (
                    <option key={v._id} value={v._id}>
                      {v.designation || v.matricule || v._id}
                      {v.immatricule ? ` — ${v.immatricule}` : v.matricule && v.designation ? ` — ${v.matricule}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date + Heures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FL icon={Calendar} label="Date indexe horaire" color="text-indigo-600" />
                  <input
                    type="date"
                    required
                    value={form.indexeHoraireDate}
                    onChange={e => set('indexeHoraireDate', e.target.value)}
                    className={inputCls('focus:ring-indigo-400')}
                  />
                </div>
                <div>
                  <FL icon={Clock} label="Indexe horaire" color="text-violet-600" />
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.1"
                      value={form.heures}
                      onChange={e => set('heures', e.target.value)}
                      placeholder="0"
                      className={`${inputCls('focus:ring-violet-400')} pr-10`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-violet-500">H</span>
                  </div>
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
              style={{ background: 'linear-gradient(135deg,#6d28d9,#7c3aed)' }}
            >
              {saving ? 'Enregistrement...' : '✓ Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

