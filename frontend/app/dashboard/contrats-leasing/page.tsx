'use client';

import { useState, useMemo } from 'react';
import {
  FileSignature, List, Plus, RefreshCw, Car, Calendar,
  Building2, Hash, DollarSign, Percent, Clock, MessageSquare,
  LayoutGrid, BadgeDollarSign, ArrowRightLeft, FileEdit,
  Banknote, Layers,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

/* ── helpers ─────────────────────────────────────────── */
const inp = (ring = 'focus:ring-cyan-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

function FL({ icon: Icon, label, color = 'text-cyan-600' }: {
  icon: React.ElementType; label: string; color?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
    </label>
  );
}

/* coloured section card */
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

/* DH / % suffix input */
function AmountInput({ value, onChange, placeholder = '0.00', suffix = 'DH', ring }: {
  value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string; ring?: string;
}) {
  return (
    <div className="relative">
      <input type="number" min="0" step="0.01" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className={`${inp(ring)} pr-10`} />
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold ${suffix === '%' ? 'text-teal-500' : 'text-emerald-600'}`}>
        {suffix}
      </span>
    </div>
  );
}

/* ── columns ─────────────────────────────────────────── */
const COLS = [
  { key: 'numeroContrat', label: 'N° Contrat',
    render: (v: any) => <span className="font-mono font-bold text-cyan-700">{v || '—'}</span> },
  { key: 'vehicleId', label: 'Véhicule',
    render: (v: any) => v?.designation || v?.matricule || '—' },
  { key: 'societeLesing', label: 'Société leasing',
    render: (v: any) => v || '—' },
  { key: 'dateContrat', label: 'Date contrat',
    render: (v: any) => formatDate(v) },
  { key: 'dateFinContrat', label: 'Fin contrat',
    render: (v: any) => formatDate(v) },
  { key: 'montantContratTTC', label: 'Montant TTC',
    render: (v: any) => v != null ? <span className="font-bold text-emerald-700">{Number(v).toLocaleString('fr-FR')} DH</span> : '—' },
];

/* ── empty form ─────────────────────────────────────── */
const EMPTY = {
  vehicleId: '', numeroContrat: '', dateContrat: '', concessionnaire: '',
  datePremierPrelevement: '', societeLesing: '', dateFinContrat: '',
  dureeContrat: '', dateReception: '', commentaire: '',
  montantContratHT: '', tva: '20', montantContratTTC: '',
  montantPrelevementHT: '', montantPrelevementTTC: '',
  montantFinanceHT: '', montantFinanceTTC: '',
  valeurResiduelleHT: '', valeurResiduelleTTC: '',
  dureeReport: '',
  avenantPrelevementHT: '', avenantPrelevementTTC: '',
  avenantDateDebut: '', avenantDateFin: '',
};

type F = keyof typeof EMPTY;

/* ════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════ */
export default function ContratsLeasingPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const params = useMemo(() => ({ page, search }), [page, search]);
  const { data, isLoading, refetch, isFetching } = useResource<any>('contrats-leasing', params);
  const { data: vData } = useResource<any>('vehicles', { page: 1, limit: 200 });
  const create = useCreateResource('contrats-leasing');

  const rows: any[]     = data?.data ?? [];
  const vehicles: any[] = vData?.data ?? [];

  const set = (f: F, v: string) => setForm(p => ({ ...p, [f]: v }));

  const nums = (...keys: F[]) =>
    Object.fromEntries(keys.map(k => [k, form[k] ? Number(form[k]) : 0]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await create.mutateAsync({
        ...form,
        ...nums('dureeContrat','montantContratHT','tva','montantContratTTC',
          'montantPrelevementHT','montantPrelevementTTC','montantFinanceHT','montantFinanceTTC',
          'valeurResiduelleHT','valeurResiduelleTTC','dureeReport',
          'avenantPrelevementHT','avenantPrelevementTTC'),
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
          style={{ background: 'linear-gradient(135deg,#0c4a6e 0%,#0369a1 40%,#0284c7 70%,#38bdf8 100%)' }}>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
            <FileSignature className="w-32 h-32 text-white" strokeWidth={0.6} />
          </div>
          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <FileSignature className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Contrats de leasing</h2>
              <p className="text-sky-200 text-xs mt-0.5">Gestion des contrats de leasing de la flotte</p>
            </div>
          </div>
          <div className="z-10 flex items-center gap-2">
            {view === 'list' ? (
              <button onClick={() => setView('form')}
                className="flex items-center gap-2 text-sm font-bold text-sky-900 bg-white hover:bg-sky-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <Plus className="w-4 h-4" /> Nouveau contrat
              </button>
            ) : (
              <button onClick={() => { setView('list'); setForm(EMPTY); }}
                className="flex items-center gap-2 text-sm font-bold text-sky-900 bg-white hover:bg-sky-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <List className="w-4 h-4" /> Voir la liste
              </button>
            )}
            <button onClick={() => refetch()}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <div className="flex h-1">
          {['#0c4a6e','#075985','#0369a1','#0284c7','#0ea5e9','#38bdf8'].map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ════ LIST VIEW ════ */}
      {view === 'list' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: FileSignature, label: 'Contrats totaux', value: data?.total ?? 0,   bg: 'bg-sky-50',    iconBg: 'bg-sky-500',    text: 'text-sky-700' },
              { icon: Car,           label: 'Véhicules',       value: vehicles.length,     bg: 'bg-blue-50',   iconBg: 'bg-blue-500',   text: 'text-blue-700' },
              { icon: Banknote,      label: 'Actifs',          value: 0,                   bg: 'bg-emerald-50',iconBg: 'bg-emerald-500',text: 'text-emerald-700' },
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

          <SearchFilter onSearch={setSearch} placeholder="Rechercher un contrat..." filters={[]} />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'linear-gradient(90deg,#0369a1,#0284c7)' }}>
              <LayoutGrid className="w-4 h-4 text-white/80" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Contrats de leasing</p>
              {data?.total != null && (
                <span className="ml-auto text-xs text-sky-200 font-semibold">{data.total} contrat{data.total !== 1 ? 's' : ''}</span>
              )}
            </div>
            <DataTable columns={COLS} data={rows} loading={isLoading}
              total={data?.total || 0} page={page} pages={data?.pages || 1}
              onPageChange={setPage} emptyMessage="Aucun contrat de leasing trouvé" />
          </div>
        </>
      )}

      {/* ════ FORM VIEW ════ */}
      {view === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Informations générales ── */}
          <Section icon={FileSignature} title="Informations générales"
            gradient="bg-gradient-to-r from-sky-50 to-cyan-50"
            border="border-sky-200" iconBg="bg-sky-600">

            {/* row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FL icon={Hash} label="Numéro du contrat" color="text-sky-700" />
                <input required type="text" value={form.numeroContrat} onChange={e => set('numeroContrat', e.target.value)}
                  placeholder="N° contrat" className={inp('focus:ring-sky-400')} />
              </div>
              <div>
                <FL icon={Calendar} label="Date du contrat" color="text-sky-700" />
                <input type="date" value={form.dateContrat} onChange={e => set('dateContrat', e.target.value)}
                  className={inp('focus:ring-sky-400')} />
              </div>
              <div>
                <FL icon={Building2} label="Concessionnaire" color="text-cyan-700" />
                <input type="text" value={form.concessionnaire} onChange={e => set('concessionnaire', e.target.value)}
                  placeholder="Nom du concessionnaire" className={inp('focus:ring-cyan-400')} />
              </div>
            </div>

            {/* row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FL icon={Calendar} label="Date du 1er prélèvement" color="text-violet-600" />
                <input type="date" value={form.datePremierPrelevement} onChange={e => set('datePremierPrelevement', e.target.value)}
                  className={inp('focus:ring-violet-400')} />
              </div>
              <div>
                <FL icon={Building2} label="Société de leasing" color="text-sky-700" />
                <input type="text" value={form.societeLesing} onChange={e => set('societeLesing', e.target.value)}
                  placeholder="Société de leasing" className={inp('focus:ring-sky-400')} />
              </div>
              <div>
                <FL icon={Car} label="Véhicule" color="text-blue-600" />
                <select value={form.vehicleId} onChange={e => set('vehicleId', e.target.value)}
                  className={inp('focus:ring-blue-400')}>
                  <option value="">— Sélectionner —</option>
                  {vehicles.map((v: any) => (
                    <option key={v._id} value={v._id}>
                      {v.designation || v.matricule || v._id}
                      {v.immatricule ? ` — ${v.immatricule}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <FL icon={Calendar} label="Date fin du contrat" color="text-rose-600" />
                <input type="date" value={form.dateFinContrat} onChange={e => set('dateFinContrat', e.target.value)}
                  className={inp('focus:ring-rose-400')} />
              </div>
              <div>
                <FL icon={Clock} label="Durée (Mois)" color="text-indigo-600" />
                <div className="relative">
                  <input type="number" min="0" value={form.dureeContrat} onChange={e => set('dureeContrat', e.target.value)}
                    placeholder="0" className={`${inp('focus:ring-indigo-400')} pr-14`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-indigo-500">Mois</span>
                </div>
              </div>
              <div>
                <FL icon={Calendar} label="Date de réception" color="text-teal-600" />
                <input type="date" value={form.dateReception} onChange={e => set('dateReception', e.target.value)}
                  className={inp('focus:ring-teal-400')} />
              </div>
              <div>
                <FL icon={MessageSquare} label="Commentaire" color="text-gray-500" />
                <textarea rows={1} value={form.commentaire} onChange={e => set('commentaire', e.target.value)}
                  placeholder="Remarques..." className={`${inp('focus:ring-gray-400')} resize-none`} />
              </div>
            </div>
          </Section>

          {/* ── Coûts ── */}
          <Section icon={BadgeDollarSign} title="Coûts"
            gradient="bg-gradient-to-r from-emerald-50 to-teal-50"
            border="border-emerald-200" iconBg="bg-emerald-600">

            {/* contrat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FL icon={DollarSign} label="Montant contrat HT" color="text-emerald-700" />
                <AmountInput value={form.montantContratHT} onChange={v => set('montantContratHT', v)} ring="focus:ring-emerald-400" />
              </div>
              <div>
                <FL icon={Percent} label="TVA" color="text-teal-700" />
                <AmountInput value={form.tva} onChange={v => set('tva', v)} suffix="%" ring="focus:ring-teal-400" />
              </div>
              <div>
                <FL icon={Banknote} label="Montant contrat TTC" color="text-emerald-700" />
                <AmountInput value={form.montantContratTTC} onChange={v => set('montantContratTTC', v)} ring="focus:ring-emerald-400" />
              </div>
            </div>

            {/* prélèvement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={ArrowRightLeft} label="Montant prélèvement HT" color="text-cyan-700" />
                <AmountInput value={form.montantPrelevementHT} onChange={v => set('montantPrelevementHT', v)} ring="focus:ring-cyan-400" />
              </div>
              <div>
                <FL icon={ArrowRightLeft} label="Montant prélèvement TTC" color="text-cyan-700" />
                <AmountInput value={form.montantPrelevementTTC} onChange={v => set('montantPrelevementTTC', v)} ring="focus:ring-cyan-400" />
              </div>
            </div>

            {/* financé */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={Layers} label="Montant financé HT" color="text-blue-700" />
                <AmountInput value={form.montantFinanceHT} onChange={v => set('montantFinanceHT', v)} ring="focus:ring-blue-400" />
              </div>
              <div>
                <FL icon={Layers} label="Montant financé TTC" color="text-blue-700" />
                <AmountInput value={form.montantFinanceTTC} onChange={v => set('montantFinanceTTC', v)} ring="focus:ring-blue-400" />
              </div>
            </div>

            {/* résiduelle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={Banknote} label="Valeur résiduelle HT" color="text-violet-700" />
                <AmountInput value={form.valeurResiduelleHT} onChange={v => set('valeurResiduelleHT', v)} ring="focus:ring-violet-400" />
              </div>
              <div>
                <FL icon={Banknote} label="Valeur résiduelle TTC" color="text-violet-700" />
                <AmountInput value={form.valeurResiduelleTTC} onChange={v => set('valeurResiduelleTTC', v)} ring="focus:ring-violet-400" />
              </div>
            </div>

            {/* durée de report */}
            <div className="sm:w-1/3">
              <FL icon={Clock} label="Durée de report (Mois)" color="text-indigo-600" />
              <div className="relative">
                <input type="number" min="0" value={form.dureeReport} onChange={e => set('dureeReport', e.target.value)}
                  placeholder="0" className={`${inp('focus:ring-indigo-400')} pr-14`} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-indigo-500">Mois</span>
              </div>
            </div>
          </Section>

          {/* ── Avenant ── */}
          <Section icon={FileEdit} title="Avenant"
            gradient="bg-gradient-to-r from-amber-50 to-orange-50"
            border="border-amber-200" iconBg="bg-amber-500">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={ArrowRightLeft} label="Montant prélèvement HT" color="text-amber-700" />
                <AmountInput value={form.avenantPrelevementHT} onChange={v => set('avenantPrelevementHT', v)} ring="focus:ring-amber-400" />
              </div>
              <div>
                <FL icon={ArrowRightLeft} label="Montant prélèvement TTC" color="text-amber-700" />
                <AmountInput value={form.avenantPrelevementTTC} onChange={v => set('avenantPrelevementTTC', v)} ring="focus:ring-amber-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={Calendar} label="Date début" color="text-orange-600" />
                <input type="date" value={form.avenantDateDebut} onChange={e => set('avenantDateDebut', e.target.value)}
                  className={inp('focus:ring-orange-400')} />
              </div>
              <div>
                <FL icon={Calendar} label="Date fin" color="text-rose-600" />
                <input type="date" value={form.avenantDateFin} onChange={e => set('avenantDateFin', e.target.value)}
                  className={inp('focus:ring-rose-400')} />
              </div>
            </div>
          </Section>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => { setView('list'); setForm(EMPTY); }}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="px-7 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#0369a1,#0284c7)' }}>
              {saving ? 'Enregistrement...' : '✓ Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

