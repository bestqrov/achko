'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Building2, Hash, Tag, AlignLeft,
  CalendarDays, Banknote, Clock, Percent,
  Gauge, Fuel, Car, Plus, List, X, Save,
  MapPin,
} from 'lucide-react';
import SearchFilter from '@/components/Forms/SearchFilter';
import DataTable    from '@/components/DataTable/DataTable';
import { useResource, useCreateResource } from '@/hooks/useResource';

/* ─── helpers ─── */
const inp = (ring = 'focus:ring-teal-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

function FL({ icon: Icon, label, color = 'text-teal-600' }: { icon: any; label: string; color?: string }) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
    </label>
  );
}

function Section({
  icon: Icon, title, gradient, border, iconBg, children,
}: {
  icon: any; title: string; gradient: string; border: string; iconBg: string; children: React.ReactNode;
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

function SuffixInput({ ring, suffix, suffixColor, ...props }: any) {
  return (
    <div className="relative">
      <input {...props} className={`${inp(ring)} pr-14`} />
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold ${suffixColor}`}>
        {suffix}
      </span>
    </div>
  );
}

/* ─── columns ─── */
const COLUMNS = [
  { key: 'numeroContrat', label: 'N° Contrat' },
  { key: 'fournisseur',   label: 'Fournisseur' },
  { key: 'typeContrat',   label: 'Type' },
  { key: 'dateDebut',     label: 'Date début',   render: (v: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  { key: 'dateFinPrevue', label: 'Date fin prév.', render: (v: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  { key: 'loyerMensuelTTC', label: 'Loyer TTC (DH)', render: (v: number) => v?.toLocaleString('fr-FR') ?? '—' },
];

/* ─── empty form state ─── */
const EMPTY = {
  vehicleId: '',
  fournisseur: '', numeroContrat: '', typeContrat: '', commentaire: '',
  dateDebut: '', dateFinPrevue: '', dateFinReelle: '',
  montantFranchise: '', dureePrevue: '', dureeReelle: '',
  loyerMensuelHT: '', tva: '20', loyerMensuelTTC: '', prixKmSupp: '',
  kilometrageDebut: '', kilometrageFin: '', kilometrageParcouru: '',
  carburantDebut: '', carburantFin: '', carburantConsomme: '',
  plafondKilometrique: '', plafondPneumatique: '',
};

/* ══════════════════════════════════════════════════════════════ */
export default function ContratsLocationPage() {
  const [view,   setView]   = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [form,   setForm]   = useState<Record<string, string>>(EMPTY);

  const { data: contratsData, isLoading, refetch } = useResource<any>('contrats-location', {});
  const { data: vehiclesData }                     = useResource<any>('vehicles', { page: 1, limit: 200 });
  const create                                     = useCreateResource('contrats-location');

  const contrats: any[] = contratsData?.data  ?? [];
  const vehicles: any[] = vehiclesData?.data  ?? [];

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  /* auto-compute TTC */
  useEffect(() => {
    const ht  = parseFloat(form.loyerMensuelHT) || 0;
    const tva = parseFloat(form.tva) || 0;
    setForm(p => ({ ...p, loyerMensuelTTC: ht > 0 ? (ht * (1 + tva / 100)).toFixed(2) : '' }));
  }, [form.loyerMensuelHT, form.tva]);

  /* auto-compute km parcouru */
  useEffect(() => {
    const debut = parseFloat(form.kilometrageDebut) || 0;
    const fin   = parseFloat(form.kilometrageFin)   || 0;
    if (fin > debut) setForm(p => ({ ...p, kilometrageParcouru: (fin - debut).toString() }));
  }, [form.kilometrageDebut, form.kilometrageFin]);

  /* auto-compute carburant consommé */
  useEffect(() => {
    const debut = parseFloat(form.carburantDebut) || 0;
    const fin   = parseFloat(form.carburantFin)   || 0;
    const diff  = debut - fin;
    setForm(p => ({ ...p, carburantConsomme: diff > 0 ? diff.toString() : '' }));
  }, [form.carburantDebut, form.carburantFin]);

  const filtered = contrats.filter((c: any) =>
    [c.numeroContrat, c.fournisseur, c.typeContrat].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync({ ...form });
    setForm(EMPTY);
    setView('list');
  };

  /* ── KPI strip ── */
  const total   = contrats.length;
  const actifs  = contrats.filter((c: any) => {
    if (!c.dateFinPrevue) return true;
    return new Date(c.dateFinPrevue) >= new Date();
  }).length;
  const avgLoyer = total
    ? Math.round(contrats.reduce((s: number, c: any) => s + (c.loyerMensuelTTC || 0), 0) / total)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-rose-50/20 p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700 via-teal-600 to-rose-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <Car className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">Parc automobile</p>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Contrats de Location</h1>
            <p className="text-teal-100 text-sm mt-1">Suivi des contrats de location longue durée</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'list' ? 'bg-white text-teal-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <List className="w-4 h-4" /> Liste
            </button>
            <button onClick={() => setView('form')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'form' ? 'bg-white text-rose-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
        </div>
        {/* color bar */}
        <div className="h-1 flex">
          {['bg-teal-400','bg-teal-500','bg-teal-600','bg-rose-400','bg-rose-500','bg-rose-600'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {/* ══════ LIST VIEW ══════ */}
      {view === 'list' && (
        <div className="space-y-5">
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total contrats',  value: total,              color: 'text-teal-700',  bg: 'from-teal-50  to-white', border: 'border-teal-200',  icon: FileText },
              { label: 'Contrats actifs', value: actifs,             color: 'text-emerald-700', bg: 'from-emerald-50 to-white', border: 'border-emerald-200', icon: Car },
              { label: 'Loyer moy. TTC',  value: `${avgLoyer.toLocaleString('fr-FR')} DH`, color: 'text-rose-700', bg: 'from-rose-50 to-white', border: 'border-rose-200', icon: Banknote },
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

          <SearchFilter onSearch={setSearch} placeholder="Rechercher un contrat…" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-rose-500 px-5 py-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Contrats de location</h2>
            </div>
            <DataTable columns={COLUMNS} data={filtered} loading={isLoading} />
          </div>
        </div>
      )}

      {/* ══════ FORM VIEW ══════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Véhicule – top level */}
          <div className="bg-white rounded-2xl border border-teal-200 shadow-sm p-5">
            <FL icon={Car} label="Véhicule" color="text-teal-600" />
            <select value={form.vehicleId} onChange={f('vehicleId')} className={inp('focus:ring-teal-400')}>
              <option value="">— Sélectionner un véhicule —</option>
              {(vehicles ?? []).map((v: any) => (
                <option key={v._id} value={v._id}>
                  {v.immatriculation} {v.marque ? `– ${v.marque}` : ''} {v.modele ?? ''}
                </option>
              ))}
            </select>
          </div>

          {/* Section 1 — Identification */}
          <Section icon={Building2} title="Identification"
            gradient="bg-gradient-to-r from-teal-50 to-white"
            border="border-teal-200" iconBg="bg-teal-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={Building2} label="Fournisseur" color="text-teal-600" />
                <input value={form.fournisseur} onChange={f('fournisseur')} placeholder="Nom du fournisseur"
                  className={inp('focus:ring-teal-400')} />
              </div>
              <div>
                <FL icon={Hash} label="Numéro de contrat" color="text-teal-600" />
                <input value={form.numeroContrat} onChange={f('numeroContrat')} placeholder="Ex : LOC-2024-001"
                  className={inp('focus:ring-teal-400')} />
              </div>
              <div>
                <FL icon={Tag} label="Type de contrat" color="text-teal-600" />
                <input value={form.typeContrat} onChange={f('typeContrat')} placeholder="Ex : LLD, LCD…"
                  className={inp('focus:ring-teal-400')} />
              </div>
              <div>
                <FL icon={AlignLeft} label="Commentaire" color="text-teal-600" />
                <textarea value={form.commentaire} onChange={f('commentaire') as any}
                  rows={2} placeholder="Observations…"
                  className={`${inp('focus:ring-teal-400')} resize-none`} />
              </div>
            </div>
          </Section>

          {/* Section 2 — Informations générales */}
          <Section icon={FileText} title="Informations générales"
            gradient="bg-gradient-to-r from-rose-50 to-white"
            border="border-rose-200" iconBg="bg-rose-500">
            {/* dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={CalendarDays} label="Date début" color="text-rose-600" />
                <input type="date" value={form.dateDebut} onChange={f('dateDebut')} className={inp('focus:ring-rose-400')} />
              </div>
              <div>
                <FL icon={CalendarDays} label="Date fin prévue" color="text-rose-600" />
                <input type="date" value={form.dateFinPrevue} onChange={f('dateFinPrevue')} className={inp('focus:ring-rose-400')} />
              </div>
              <div>
                <FL icon={CalendarDays} label="Date fin réelle" color="text-rose-600" />
                <input type="date" value={form.dateFinReelle} onChange={f('dateFinReelle')} className={inp('focus:ring-rose-400')} />
              </div>
            </div>
            {/* montant + durées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={Banknote} label="Montant de franchise" color="text-rose-600" />
                <SuffixInput type="number" value={form.montantFranchise} onChange={f('montantFranchise')}
                  placeholder="0" ring="focus:ring-rose-400" suffix="DH" suffixColor="text-rose-500" />
              </div>
              <div>
                <FL icon={Clock} label="Durée prévue" color="text-rose-600" />
                <SuffixInput type="number" value={form.dureePrevue} onChange={f('dureePrevue')}
                  placeholder="0" ring="focus:ring-rose-400" suffix="Mois" suffixColor="text-rose-500" />
              </div>
              <div>
                <FL icon={Clock} label="Durée réelle" color="text-rose-600" />
                <SuffixInput type="number" value={form.dureeReelle} onChange={f('dureeReelle')}
                  placeholder="0" ring="focus:ring-rose-400" suffix="Mois" suffixColor="text-rose-500" />
              </div>
            </div>
            {/* loyers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={Banknote} label="Loyer mensuel HT" color="text-rose-600" />
                <SuffixInput type="number" value={form.loyerMensuelHT} onChange={f('loyerMensuelHT')}
                  placeholder="0.00" ring="focus:ring-rose-400" suffix="DH" suffixColor="text-rose-500" />
              </div>
              <div>
                <FL icon={Percent} label="TVA" color="text-rose-600" />
                <SuffixInput type="number" value={form.tva} onChange={f('tva')}
                  placeholder="20" ring="focus:ring-rose-400" suffix="%" suffixColor="text-rose-500" />
              </div>
              <div>
                <FL icon={Banknote} label="Loyer mensuel TTC" color="text-rose-600" />
                <SuffixInput type="number" value={form.loyerMensuelTTC} onChange={f('loyerMensuelTTC')}
                  placeholder="calculé auto" ring="focus:ring-rose-300" suffix="DH" suffixColor="text-rose-400"
                  readOnly style={{ background: '#fff7f7' }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={MapPin} label="Prix km supplémentaire" color="text-rose-600" />
                <SuffixInput type="number" value={form.prixKmSupp} onChange={f('prixKmSupp')}
                  placeholder="0.00" ring="focus:ring-rose-400" suffix="DH" suffixColor="text-rose-500" />
              </div>
            </div>
          </Section>

          {/* Section 3 — Kilométrage & Carburant */}
          <Section icon={Gauge} title="Kilométrage & Carburant"
            gradient="bg-gradient-to-r from-emerald-50 to-white"
            border="border-emerald-200" iconBg="bg-emerald-600">
            {/* kilométrage */}
            <p className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest">Kilométrage</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={Gauge} label="Kilométrage début" color="text-emerald-600" />
                <SuffixInput type="number" value={form.kilometrageDebut} onChange={f('kilometrageDebut')}
                  placeholder="0" ring="focus:ring-emerald-400" suffix="Km" suffixColor="text-emerald-600" />
              </div>
              <div>
                <FL icon={Gauge} label="Kilométrage fin" color="text-emerald-600" />
                <SuffixInput type="number" value={form.kilometrageFin} onChange={f('kilometrageFin')}
                  placeholder="0" ring="focus:ring-emerald-400" suffix="Km" suffixColor="text-emerald-600" />
              </div>
              <div>
                <FL icon={Gauge} label="Kilométrage parcouru" color="text-emerald-600" />
                <SuffixInput type="number" value={form.kilometrageParcouru} onChange={f('kilometrageParcouru')}
                  placeholder="auto" ring="focus:ring-emerald-300" suffix="Km" suffixColor="text-emerald-500"
                  readOnly style={{ background: '#f0fdf4' }} />
              </div>
            </div>
            {/* carburant */}
            <p className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest pt-1">Carburant</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FL icon={Fuel} label="Carburant début" color="text-emerald-600" />
                <SuffixInput type="number" value={form.carburantDebut} onChange={f('carburantDebut')}
                  placeholder="0" ring="focus:ring-emerald-400" suffix="%" suffixColor="text-emerald-600" />
              </div>
              <div>
                <FL icon={Fuel} label="Carburant fin" color="text-emerald-600" />
                <SuffixInput type="number" value={form.carburantFin} onChange={f('carburantFin')}
                  placeholder="0" ring="focus:ring-emerald-400" suffix="%" suffixColor="text-emerald-600" />
              </div>
              <div>
                <FL icon={Fuel} label="Carburant consommé" color="text-emerald-600" />
                <SuffixInput type="number" value={form.carburantConsomme} onChange={f('carburantConsomme')}
                  placeholder="auto" ring="focus:ring-emerald-300" suffix="%" suffixColor="text-emerald-500"
                  readOnly style={{ background: '#f0fdf4' }} />
              </div>
            </div>
            {/* plafonds */}
            <p className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest pt-1">Plafonds</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={Gauge} label="Plafond kilométrique" color="text-emerald-600" />
                <SuffixInput type="number" value={form.plafondKilometrique} onChange={f('plafondKilometrique')}
                  placeholder="0" ring="focus:ring-emerald-400" suffix="Km" suffixColor="text-emerald-600" />
              </div>
              <div>
                <FL icon={Gauge} label="Plafond pneumatique" color="text-emerald-600" />
                <SuffixInput type="number" value={form.plafondPneumatique} onChange={f('plafondPneumatique')}
                  placeholder="0" ring="focus:ring-emerald-400" suffix="Km" suffixColor="text-emerald-600" />
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-rose-500 text-white text-sm font-bold shadow-md hover:opacity-90 transition disabled:opacity-60">
              <Save className="w-4 h-4" /> {create.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

