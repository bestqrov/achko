'use client';

import { useState } from 'react';
import {
  Archive, Car, CalendarDays, Tag, Banknote, AlignLeft,
  List, Plus, X, Save, FileText,
} from 'lucide-react';
import SearchFilter from '@/components/Forms/SearchFilter';
import DataTable    from '@/components/DataTable/DataTable';
import { useResource, useCreateResource } from '@/hooks/useResource';

/* ─── helpers ─── */
const inp = (ring = 'focus:ring-slate-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

function FL({ icon: Icon, label, color = 'text-slate-600' }: {
  icon: React.ElementType; label: string; color?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
    </label>
  );
}

/* ─── table columns ─── */
const COLUMNS = [
  { key: 'vehicleId',   label: 'Véhicule',       render: (v: any) => v?.immatriculation ?? '—' },
  { key: 'dateReforme', label: 'Date de réforme', render: (v: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  { key: 'typeReforme', label: 'Type de réforme' },
  { key: 'montant',     label: 'Montant (DH)',
    render: (v: number) => v != null ? <span className="font-bold text-slate-700">{Number(v).toLocaleString('fr-FR')} DH</span> : '—' },
  { key: 'commentaire', label: 'Commentaire' },
];

/* ─── empty form ─── */
const EMPTY = {
  vehicleId: '', dateReforme: '', typeReforme: '', montant: '', commentaire: '',
};

/* ════════════════════════════════════════════════════════════ */
export default function VehiculeRefomesPage() {
  const [view,   setView]   = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [form,   setForm]   = useState<Record<string, string>>(EMPTY);

  const { data: reformesData, isLoading } = useResource<any>('vehicules-reformes', {});
  const { data: vehiclesData }            = useResource<any>('vehicles', { page: 1, limit: 200 });
  const create                            = useCreateResource('vehicules-reformes');

  const reformes: any[] = reformesData?.data ?? [];
  const vehicles: any[] = vehiclesData?.data ?? [];

  const f = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const filtered = reformes.filter((r: any) =>
    [r.typeReforme, r.commentaire].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync({ ...form });
    setForm(EMPTY);
    setView('list');
  };

  const total = reformes.length;
  const totalMontant = reformes.reduce((s: number, r: any) => s + (r.montant || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/40 to-zinc-50/20 p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-gray-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <Archive className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-slate-300 text-xs font-semibold uppercase tracking-widest mb-1">Parc automobile</p>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Véhicules réformés</h1>
            <p className="text-slate-200 text-sm mt-1">Gestion des véhicules mis en réforme</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'list' ? 'bg-white text-slate-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <List className="w-4 h-4" /> Liste
            </button>
            <button onClick={() => setView('form')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'form' ? 'bg-white text-gray-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
        </div>
        <div className="h-1 flex">
          {['bg-slate-400','bg-slate-500','bg-gray-400','bg-gray-500','bg-zinc-400','bg-zinc-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {/* ══════ LIST VIEW ══════ */}
      {view === 'list' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total réformés',  value: total,    color: 'text-slate-700', bg: 'from-slate-50 to-white', border: 'border-slate-200', icon: Archive },
              { label: 'Montant total',   value: `${totalMontant.toLocaleString('fr-FR')} DH`, color: 'text-gray-700', bg: 'from-gray-50 to-white', border: 'border-gray-200', icon: Banknote },
            ].map(({ label, value, color, bg, border, icon: Icon }) => (
              <div key={label} className={`bg-gradient-to-br ${bg} rounded-2xl border ${border} p-4 flex items-center gap-4 shadow-sm`}>
                <div className={`p-2.5 rounded-xl bg-white shadow-sm border ${border}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <SearchFilter onSearch={setSearch} placeholder="Rechercher un véhicule réformé…" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 to-gray-500 px-5 py-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Véhicules réformés</h2>
            </div>
            <DataTable columns={COLUMNS} data={filtered} loading={isLoading} />
          </div>
        </div>
      )}

      {/* ══════ FORM VIEW ══════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Véhicule */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <FL icon={Car} label="Véhicule" color="text-slate-600" />
            <select value={form.vehicleId} onChange={f('vehicleId')} className={inp('focus:ring-slate-400')}>
              <option value="">— Sélectionner un véhicule —</option>
              {vehicles.map((v: any) => (
                <option key={v._id} value={v._id}>
                  {v.immatriculation} {v.marque ? `– ${v.marque}` : ''} {v.modele ?? ''}
                </option>
              ))}
            </select>
          </div>

          {/* Informations générales */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-3 flex items-center gap-2.5 border-b border-slate-200">
              <div className="bg-slate-600 p-1.5 rounded-lg flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Informations générales</h3>
            </div>
            <div className="bg-white p-5 space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FL icon={CalendarDays} label="Date de réforme" color="text-slate-600" />
                  <input type="date" value={form.dateReforme} onChange={f('dateReforme')} className={inp('focus:ring-slate-400')} />
                </div>
                <div>
                  <FL icon={Tag} label="Type de réforme" color="text-slate-600" />
                  <input value={form.typeReforme} onChange={f('typeReforme')}
                    placeholder="Ex : Cession, Destruction, Don…" className={inp('focus:ring-slate-400')} />
                </div>
              </div>

              <div>
                <FL icon={Banknote} label="Montant" color="text-slate-600" />
                <div className="relative">
                  <input type="number" value={form.montant} onChange={f('montant')}
                    placeholder="0.00" className={`${inp('focus:ring-slate-400')} pr-12`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500">DH</span>
                </div>
              </div>

              <div>
                <FL icon={AlignLeft} label="Commentaire" color="text-slate-600" />
                <textarea value={form.commentaire} onChange={f('commentaire') as any}
                  rows={3} placeholder="Observations, motif de réforme…"
                  className={`${inp('focus:ring-slate-400')} resize-none`} />
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => { setForm(EMPTY); setView('list'); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition shadow-sm">
              <X className="w-4 h-4" /> Annuler
            </button>
            <button type="submit" disabled={create.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-600 to-gray-500 text-white text-sm font-bold shadow-md hover:opacity-90 transition disabled:opacity-60">
              <Save className="w-4 h-4" /> {create.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

