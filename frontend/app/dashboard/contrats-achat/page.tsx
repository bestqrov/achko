'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart, Car, Building2, CalendarDays, Hash,
  ShieldCheck, Banknote, Percent, List, Plus, X, Save,
  FileText,
} from 'lucide-react';
import SearchFilter from '@/components/Forms/SearchFilter';
import DataTable    from '@/components/DataTable/DataTable';
import { useResource, useCreateResource } from '@/hooks/useResource';

/* ─── helpers ─── */
const inp = (ring = 'focus:ring-amber-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

function FL({ icon: Icon, label, color = 'text-amber-600' }: {
  icon: React.ElementType; label: string; color?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
    </label>
  );
}

function SuffixInput({ ring, suffix, suffixColor, readOnly, ...props }: any) {
  return (
    <div className="relative">
      <input {...props} readOnly={readOnly}
        className={`${inp(ring)} pr-14 ${readOnly ? 'bg-amber-50/60 cursor-default' : ''}`} />
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold ${suffixColor}`}>
        {suffix}
      </span>
    </div>
  );
}

/* ─── table columns ─── */
const COLUMNS = [
  { key: 'numeroContrat', label: 'N° Contrat' },
  { key: 'fournisseur',   label: 'Fournisseur' },
  { key: 'dateAchat',     label: "Date d'achat", render: (v: string) => v ? new Date(v).toLocaleDateString('fr-FR') : '—' },
  { key: 'garantie',      label: 'Garantie' },
  { key: 'montantTTC',    label: 'Montant TTC (DH)', render: (v: number) => v != null ? <span className="font-bold text-amber-700">{Number(v).toLocaleString('fr-FR')} DH</span> : '—' },
];

/* ─── empty form ─── */
const EMPTY = {
  vehicleId: '', fournisseur: '', dateAchat: '',
  numeroContrat: '', garantie: '',
  montantHT: '', tva: '20', montantTTC: '',
};

/* ════════════════════════════════════════════════════════════ */
export default function ContratsAchatPage() {
  const [view,   setView]   = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [form,   setForm]   = useState<Record<string, string>>(EMPTY);

  const { data: contratsData, isLoading } = useResource<any>('contrats-achat', {});
  const { data: vehiclesData }            = useResource<any>('vehicles', { page: 1, limit: 200 });
  const create                            = useCreateResource('contrats-achat');

  const contrats: any[] = contratsData?.data ?? [];
  const vehicles: any[] = vehiclesData?.data ?? [];

  const f = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  /* auto-compute TTC */
  useEffect(() => {
    const ht  = parseFloat(form.montantHT) || 0;
    const tva = parseFloat(form.tva) || 0;
    setForm(p => ({ ...p, montantTTC: ht > 0 ? (ht * (1 + tva / 100)).toFixed(2) : '' }));
  }, [form.montantHT, form.tva]);

  const filtered = contrats.filter((c: any) =>
    [c.numeroContrat, c.fournisseur, c.garantie].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync({ ...form });
    setForm(EMPTY);
    setView('list');
  };

  /* KPI */
  const total    = contrats.length;
  const avgTTC   = total ? Math.round(contrats.reduce((s: number, c: any) => s + (c.montantTTC || 0), 0) / total) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <ShoppingCart className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-xs font-semibold uppercase tracking-widest mb-1">Parc automobile</p>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Contrats d&apos;achat</h1>
            <p className="text-amber-100 text-sm mt-1">Suivi des contrats d&apos;achat de véhicules</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'list' ? 'bg-white text-amber-700' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <List className="w-4 h-4" /> Liste
            </button>
            <button onClick={() => setView('form')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md
                ${view === 'form' ? 'bg-white text-orange-600' : 'bg-white/20 text-white hover:bg-white/30'}`}>
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
        </div>
        <div className="h-1 flex">
          {['bg-amber-400','bg-amber-500','bg-orange-400','bg-orange-500','bg-yellow-400','bg-yellow-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {/* ══════ LIST VIEW ══════ */}
      {view === 'list' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total contrats', value: total,    color: 'text-amber-700',  bg: 'from-amber-50  to-white',  border: 'border-amber-200',  icon: FileText },
              { label: 'Véhicules',      value: total,    color: 'text-orange-700', bg: 'from-orange-50 to-white',  border: 'border-orange-200', icon: Car },
              { label: 'Montant moy. TTC', value: `${avgTTC.toLocaleString('fr-FR')} DH`, color: 'text-yellow-700', bg: 'from-yellow-50 to-white', border: 'border-yellow-200', icon: Banknote },
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
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Contrats d&apos;achat</h2>
            </div>
            <DataTable columns={COLUMNS} data={filtered} loading={isLoading} />
          </div>
        </div>
      )}

      {/* ══════ FORM VIEW ══════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Véhicule */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5">
            <FL icon={Car} label="Véhicule" color="text-amber-600" />
            <select value={form.vehicleId} onChange={f('vehicleId')} className={inp('focus:ring-amber-400')}>
              <option value="">— Sélectionner un véhicule —</option>
              {vehicles.map((v: any) => (
                <option key={v._id} value={v._id}>
                  {v.immatriculation} {v.marque ? `– ${v.marque}` : ''} {v.modele ?? ''}
                </option>
              ))}
            </select>
          </div>

          {/* Informations générales */}
          <div className="rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-amber-50 to-white px-5 py-3 flex items-center gap-2.5 border-b border-amber-200">
              <div className="bg-amber-500 p-1.5 rounded-lg flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Informations générales</h3>
            </div>
            <div className="bg-white p-5 space-y-4">

              {/* row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FL icon={Building2} label="Fournisseur" color="text-amber-600" />
                  <input value={form.fournisseur} onChange={f('fournisseur')}
                    placeholder="Nom du fournisseur" className={inp('focus:ring-amber-400')} />
                </div>
                <div>
                  <FL icon={CalendarDays} label="Date d'achat" color="text-amber-600" />
                  <input type="date" value={form.dateAchat} onChange={f('dateAchat')} className={inp('focus:ring-amber-400')} />
                </div>
              </div>

              {/* row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FL icon={Hash} label="Numéro contrat" color="text-amber-600" />
                  <input value={form.numeroContrat} onChange={f('numeroContrat')}
                    placeholder="Ex : ACH-2024-001" className={inp('focus:ring-amber-400')} />
                </div>
                <div>
                  <FL icon={ShieldCheck} label="Garantie" color="text-amber-600" />
                  <input value={form.garantie} onChange={f('garantie')}
                    placeholder="Ex : 3 ans / 100 000 km" className={inp('focus:ring-amber-400')} />
                </div>
              </div>

              {/* row 3 — amounts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FL icon={Banknote} label="Montant HT" color="text-amber-600" />
                  <SuffixInput type="number" value={form.montantHT} onChange={f('montantHT')}
                    placeholder="0.00" ring="focus:ring-amber-400" suffix="DH" suffixColor="text-amber-500" />
                </div>
                <div>
                  <FL icon={Percent} label="TVA" color="text-amber-600" />
                  <SuffixInput type="number" value={form.tva} onChange={f('tva')}
                    placeholder="20" ring="focus:ring-amber-400" suffix="%" suffixColor="text-amber-500" />
                </div>
                <div>
                  <FL icon={Banknote} label="Montant TTC" color="text-amber-600" />
                  <SuffixInput type="number" value={form.montantTTC} onChange={f('montantTTC')}
                    placeholder="calculé auto" ring="focus:ring-amber-200" suffix="DH" suffixColor="text-amber-400"
                    readOnly />
                </div>
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md hover:opacity-90 transition disabled:opacity-60">
              <Save className="w-4 h-4" /> {create.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

