'use client';

import { useState, useEffect } from 'react';
import {
  RotateCcw, Car, CalendarDays, FileText, AlertTriangle,
  Hash, MapPin, Gauge, Fuel, AlignLeft, Paperclip,
  List, Plus, X, Save,
} from 'lucide-react';
import SearchFilter from '@/components/Forms/SearchFilter';
import DataTable    from '@/components/DataTable/DataTable';
import { useResource, useCreateResource } from '@/hooks/useResource';

/* ─── helpers ─── */
const inp = (ring = 'focus:ring-indigo-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

function FL({ icon: Icon, label, color = 'text-indigo-600' }: {
  icon: React.ElementType; label: string; color?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
    </label>
  );
}

function Section({ icon: Icon, title, gradient, border, iconBg, children }: {
  icon: React.ElementType; title: string; gradient: string; border: string;
  iconBg: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border ${border} overflow-hidden shadow-sm`}>
      <div className={`${gradient} px-5 py-3 flex items-center gap-2.5 border-b ${border}`}>
        <div className={`${iconBg} p-1.5 rounded-lg flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="bg-white p-5 space-y-4">{children}</div>
    </div>
  );
}

function SuffixInput({ ring, suffix, suffixColor, readOnly, ...props }: any) {
  return (
    <div className="relative">
      <input {...props} readOnly={readOnly}
        className={`${inp(ring)} pr-14 ${readOnly ? 'bg-indigo-50/60 cursor-default' : ''}`} />
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold ${suffixColor}`}>
        {suffix}
      </span>
    </div>
  );
}

const CARBURANT_OPTIONS = ['0', '1/4', '1/2', '3/4', '4/4'];

/* ─── table columns ─── */
const COLUMNS = [
  { key: 'vehiculeRemplacement', label: 'Véhicule rempl.' },
  { key: 'dateDemande',   label: 'Date demande',  render: (v: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  { key: 'dateDebut',     label: 'Date début',     render: (v: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  { key: 'dateFinPrevue', label: 'Fin prévue',     render: (v: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  { key: 'marqueType',    label: 'Marque / Type' },
  { key: 'distance',      label: 'Distance (Km)',  render: (v: number) => v != null ? `${Number(v).toLocaleString('fr-FR')} Km` : '—' },
];

/* ─── empty form ─── */
const EMPTY = {
  vehicleId: '', dateDemande: '', vehiculeRemplacement: '',
  contrat: '', sinistre: '',
  dateDebut: '', dateFinPrevue: '', dateRestitution: '',
  marqueType: '', modeFormule: '',
  kilometrageDepart: '', kilometrageRetour: '', distance: '',
  lieuDepart: '', lieuArrivee: '',
  carburantDebut: '0', carburantFin: '0',
  motif: '', attachement: '',
};

/* ════════════════════════════════════════════════════════════ */
export default function VehiculeRemplacementPage() {
  const [view,   setView]   = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [form,   setForm]   = useState<Record<string, string>>(EMPTY);

  const { data: remplacementsData, isLoading } = useResource<any>('vehicules-remplacement', {});
  const { data: vehiclesData }                 = useResource<any>('vehicles', { page: 1, limit: 200 });
  const create                                 = useCreateResource('vehicules-remplacement');

  const remplacements: any[] = remplacementsData?.data ?? [];
  const vehicles: any[]      = vehiclesData?.data      ?? [];

  const f = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  /* auto-compute distance */
  useEffect(() => {
    const dep = parseFloat(form.kilometrageDepart) || 0;
    const ret = parseFloat(form.kilometrageRetour) || 0;
    if (ret > dep) setForm(p => ({ ...p, distance: (ret - dep).toString() }));
  }, [form.kilometrageDepart, form.kilometrageRetour]);

  const filtered = remplacements.filter((r: any) =>
    [r.vehiculeRemplacement, r.marqueType, r.contrat, r.sinistre].join(' ')
      .toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync({ ...form });
    setForm(EMPTY);
    setView('list');
  };

  const total = remplacements.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <RotateCcw className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Parc automobile</p>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Véhicules de remplacement</h1>
            <p className="text-indigo-100 text-sm mt-1">Suivi des demandes de véhicules de remplacement</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'list' ? 'bg-white text-indigo-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <List className="w-4 h-4" /> Liste
            </button>
            <button onClick={() => setView('form')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'form' ? 'bg-white text-violet-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
        </div>
        <div className="h-1 flex">
          {['bg-indigo-400','bg-indigo-500','bg-violet-400','bg-violet-500','bg-purple-400','bg-purple-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {/* ══════ LIST VIEW ══════ */}
      {view === 'list' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total demandes', value: total, color: 'text-indigo-700', bg: 'from-indigo-50 to-white', border: 'border-indigo-200', icon: RotateCcw },
              { label: 'Véhicules',      value: total, color: 'text-violet-700', bg: 'from-violet-50 to-white', border: 'border-violet-200', icon: Car },
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
          <SearchFilter onSearch={setSearch} placeholder="Rechercher…" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Véhicules de remplacement</h2>
            </div>
            <DataTable columns={COLUMNS} data={filtered} loading={isLoading} />
          </div>
        </div>
      )}

      {/* ══════ FORM VIEW ══════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Véhicule principal */}
          <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5">
            <FL icon={Car} label="Véhicule" color="text-indigo-600" />
            <select value={form.vehicleId} onChange={f('vehicleId')} className={inp('focus:ring-indigo-400')}>
              <option value="">— Sélectionner un véhicule —</option>
              {vehicles.map((v: any) => (
                <option key={v._id} value={v._id}>
                  {v.immatriculation} {v.marque ? `– ${v.marque}` : ''} {v.modele ?? ''}
                </option>
              ))}
            </select>
          </div>

          {/* Section — Informations générales */}
          <Section icon={FileText} title="Informations générales"
            gradient="bg-gradient-to-r from-indigo-50 to-white"
            border="border-indigo-200" iconBg="bg-indigo-600">

            {/* row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={CalendarDays} label="Date demande" color="text-indigo-600" />
                <input type="date" value={form.dateDemande} onChange={f('dateDemande')} className={inp('focus:ring-indigo-400')} />
              </div>
              <div>
                <FL icon={Car} label="Véhicule de remplacement" color="text-indigo-600" />
                <input value={form.vehiculeRemplacement} onChange={f('vehiculeRemplacement')}
                  placeholder="Immatriculation / désignation" className={inp('focus:ring-indigo-400')} />
              </div>
            </div>

            {/* row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={Hash} label="Contrat" color="text-indigo-600" />
                <input value={form.contrat} onChange={f('contrat')}
                  placeholder="N° contrat" className={inp('focus:ring-indigo-400')} />
              </div>
              <div>
                <FL icon={AlertTriangle} label="Sinistre" color="text-indigo-600" />
                <input value={form.sinistre} onChange={f('sinistre')}
                  placeholder="Référence sinistre" className={inp('focus:ring-indigo-400')} />
              </div>
            </div>

            {/* dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={CalendarDays} label="Date début" color="text-indigo-600" />
                <input type="date" value={form.dateDebut} onChange={f('dateDebut')} className={inp('focus:ring-indigo-400')} />
              </div>
              <div>
                <FL icon={CalendarDays} label="Date fin prévue" color="text-indigo-600" />
                <input type="date" value={form.dateFinPrevue} onChange={f('dateFinPrevue')} className={inp('focus:ring-indigo-400')} />
              </div>
              <div>
                <FL icon={CalendarDays} label="Date restitution" color="text-indigo-600" />
                <input type="date" value={form.dateRestitution} onChange={f('dateRestitution')} className={inp('focus:ring-indigo-400')} />
              </div>
            </div>

            {/* marque + formule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={Car} label="Marque et type" color="text-indigo-600" />
                <input value={form.marqueType} onChange={f('marqueType')}
                  placeholder="Ex : Dacia Logan, Renault Clio…" className={inp('focus:ring-indigo-400')} />
              </div>
              <div>
                <FL icon={FileText} label="Mode formule" color="text-indigo-600" />
                <input value={form.modeFormule} onChange={f('modeFormule')}
                  placeholder="Ex : LLD, LCD, journalier…" className={inp('focus:ring-indigo-400')} />
              </div>
            </div>
          </Section>

          {/* Section — Kilométrage */}
          <Section icon={Gauge} title="Kilométrage"
            gradient="bg-gradient-to-r from-violet-50 to-white"
            border="border-violet-200" iconBg="bg-violet-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={Gauge} label="Kilométrage de départ" color="text-violet-600" />
                <SuffixInput type="number" value={form.kilometrageDepart} onChange={f('kilometrageDepart')}
                  placeholder="0" ring="focus:ring-violet-400" suffix="Km" suffixColor="text-violet-600" />
              </div>
              <div>
                <FL icon={Gauge} label="Kilométrage de retour" color="text-violet-600" />
                <SuffixInput type="number" value={form.kilometrageRetour} onChange={f('kilometrageRetour')}
                  placeholder="0" ring="focus:ring-violet-400" suffix="Km" suffixColor="text-violet-600" />
              </div>
              <div>
                <FL icon={Gauge} label="Distance" color="text-violet-600" />
                <SuffixInput type="number" value={form.distance} onChange={f('distance')}
                  placeholder="auto" ring="focus:ring-violet-200" suffix="Km" suffixColor="text-violet-400"
                  readOnly />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={MapPin} label="Lieu de départ" color="text-violet-600" />
                <input value={form.lieuDepart} onChange={f('lieuDepart')}
                  placeholder="Ville / adresse de départ" className={inp('focus:ring-violet-400')} />
              </div>
              <div>
                <FL icon={MapPin} label="Lieu d'arrivée" color="text-violet-600" />
                <input value={form.lieuArrivee} onChange={f('lieuArrivee')}
                  placeholder="Ville / adresse d'arrivée" className={inp('focus:ring-violet-400')} />
              </div>
            </div>
          </Section>

          {/* Section — Carburant */}
          <Section icon={Fuel} title="Carburant"
            gradient="bg-gradient-to-r from-purple-50 to-white"
            border="border-purple-200" iconBg="bg-purple-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={Fuel} label="Carburant début" color="text-purple-600" />
                <div className="flex gap-2 flex-wrap">
                  {CARBURANT_OPTIONS.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setForm(p => ({ ...p, carburantDebut: opt }))}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all
                        ${form.carburantDebut === opt
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                          : 'bg-white text-purple-700 border-purple-200 hover:border-purple-400'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FL icon={Fuel} label="Carburant fin" color="text-purple-600" />
                <div className="flex gap-2 flex-wrap">
                  {CARBURANT_OPTIONS.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setForm(p => ({ ...p, carburantFin: opt }))}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all
                        ${form.carburantFin === opt
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                          : 'bg-white text-purple-700 border-purple-200 hover:border-purple-400'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Section — Motif & Attachement */}
          <Section icon={AlignLeft} title="Motif & Attachement"
            gradient="bg-gradient-to-r from-indigo-50 to-white"
            border="border-indigo-200" iconBg="bg-indigo-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={AlignLeft} label="Motif" color="text-indigo-600" />
                <textarea value={form.motif} onChange={f('motif') as any}
                  rows={3} placeholder="Motif de la demande…"
                  className={`${inp('focus:ring-indigo-400')} resize-none`} />
              </div>
              <div>
                <FL icon={Paperclip} label="Attachement" color="text-indigo-600" />
                <textarea value={form.attachement} onChange={f('attachement') as any}
                  rows={3} placeholder="Référence document / PJ…"
                  className={`${inp('focus:ring-indigo-400')} resize-none`} />
              </div>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => { setForm(EMPTY); setView('list'); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition shadow-sm">
              <X className="w-4 h-4" /> Annuler
            </button>
            <button type="submit" disabled={create.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-bold shadow-md hover:opacity-90 transition disabled:opacity-60">
              <Save className="w-4 h-4" /> {create.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

