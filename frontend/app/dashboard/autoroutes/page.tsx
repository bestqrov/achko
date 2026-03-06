'use client';

import { useState, useMemo } from 'react';
import {
  Plus, ArrowLeft, Car, User, Tag, Hash, Calendar,
  MapPin, Navigation, CreditCard, Paperclip,
  DollarSign, Calculator, RotateCcw,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

/* ── theme ─────────────────────────────────────────────────── */
const ORANGE = '#c2410c';
const AMBER  = '#b45309';

/* ── helpers ───────────────────────────────────────────────── */
function IL({ icon: Icon, color, children }: { icon: React.ElementType; color?: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: color ?? ORANGE }} />
      {children}
    </label>
  );
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50';
const numInp = 'flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50';

function NumField({ label, icon: Icon, name, value, onChange, suffix, readOnly = false }: {
  label: string; icon: React.ElementType; name: string; value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; suffix: string; readOnly?: boolean;
}) {
  return (
    <div>
      <IL icon={Icon} color={ORANGE}>{label}</IL>
      <div className="flex">
        <input type="number" step="0.01" name={name} value={value} onChange={onChange}
          readOnly={readOnly}
          className={readOnly ? `${numInp} bg-orange-50 text-orange-700 font-semibold cursor-default` : numInp} />
        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-xs font-semibold text-gray-500">{suffix}</span>
      </div>
    </div>
  );
}

function SectionCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b flex items-center gap-2"
        style={{ background: `linear-gradient(to right, ${color}12, ${color}06)`, borderColor: `${color}22` }}>
        <div className="w-1 h-4 rounded-full" style={{ background: color }} />
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ── columns ───────────────────────────────────────────────── */
type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'numero',       label: 'Numéro' },
  { key: 'date',         label: 'Date',          render: (v) => formatDate(v) },
  { key: 'vehicule',     label: 'Véhicule' },
  { key: 'collaborateur',label: 'Collaborateur' },
  { key: 'peageDepart',  label: 'Péage départ' },
  { key: 'peageArrivee', label: 'Péage arrivée' },
  { key: 'typePaiement', label: 'Type paiement' },
  { key: 'montantHT',    label: 'Montant HT',    render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'tva',          label: 'TVA',           render: (v) => v != null ? `${Number(v).toFixed(2)} %` : '—' },
  { key: 'montant',      label: 'Montant TTC',   render: (v) => v != null ? formatCurrency(v) : '—' },
];

/* ── form defaults ─────────────────────────────────────────── */
const makeEmpty = () => ({
  vehicule: '',
  collaborateur: '',
  designation: '',
  numero: '',
  date: new Date().toISOString().slice(0, 16),
  peageDepart: '',
  peageArrivee: '',
  typePaiement: '',
  attachement: '',
  montantHT: '',
  tva: '20',
});

/* ── page ──────────────────────────────────────────────────── */
export default function AutoroutesPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(makeEmpty());

  const { data, isLoading }    = useResource<any>('consommation', { page, search, type: 'autoroute' });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const create                 = useCreateResource('consommation');

  const montantTTC = useMemo(() => {
    const ht  = parseFloat(form.montantHT) || 0;
    const tva = parseFloat(form.tva) || 0;
    return (ht + ht * (tva / 100)).toFixed(2);
  }, [form.montantHT, form.tva]);

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(makeEmpty()); setView('list'); };

  const buildPayload = () => ({
    ...form,
    type: 'autoroute',
    montantHT:  parseFloat(form.montantHT) || 0,
    tva:        parseFloat(form.tva) || 0,
    montantTTC: parseFloat(montantTTC) || 0,
    montant:    parseFloat(montantTTC) || 0,
  });

  const handleSubmit = async () => {
    await create.mutateAsync(buildPayload());
    handleCancel();
  };

  const handleSubmitAndAdd = async () => {
    await create.mutateAsync(buildPayload());
    setForm(makeEmpty());
  };

  const vehicles: any[] = vehiclesData?.data ?? [];

  /* ══════════════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════════════ */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Autoroutes</h2>
            <p className="text-sm text-gray-500 mt-1">Suivi des péages autoroutiers</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: `linear-gradient(135deg, #7c2d12 0%, ${ORANGE} 60%, ${AMBER} 100%)` }}>
            <Plus className="w-4 h-4" /> Nouveau Péage
          </button>
        </div>

        <SearchFilter onSearch={setSearch} placeholder="Rechercher un péage..." filters={[]} />

        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun péage trouvé" />
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     FORM VIEW
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #431407 0%, #7c2d12 35%, #c2410c 70%, #ea580c 100%)' }}>

          {/* Road watermark */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
            <Navigation className="w-24 h-24 text-white" strokeWidth={0.8} />
          </div>
          {/* Dashes mimicking road markings */}
          <div className="absolute bottom-3 left-0 right-0 flex gap-3 px-6 pointer-events-none select-none">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="h-0.5 w-6 bg-white/15 rounded-full" />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Navigation className="w-5 h-5 text-orange-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs bg-orange-400/30 text-orange-100 font-semibold px-2 py-0.5 rounded-full tracking-wide border border-orange-300/30">
                  PÉAGE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">Nouveau Péage</h3>
              <p className="text-orange-200 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>

          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
        {/* road stripe */}
        <div className="flex h-1.5">
          {['#431407','#7c2d12','#c2410c','#ea580c','#f97316','#fdba74'].map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ── Véhicule / Collaborateur ── */}
      <SectionCard title="Véhicule" color={ORANGE}>
        <div>
          <IL icon={Car} color={ORANGE}>Véhicule *</IL>
          <select name="vehicule" value={form.vehicule} onChange={hc} className={inp}>
            <option value="">— Sélectionner un véhicule —</option>
            {vehicles.map((v: any) => (
              <option key={v._id} value={v._id}>{v.immatriculation ?? v.matricule ?? v._id}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={User} color="#0891b2">Collaborateur</IL>
            <input type="text" name="collaborateur" value={form.collaborateur} onChange={hc}
              placeholder="Nom du collaborateur" className={inp} />
          </div>
          <div>
            <IL icon={Tag} color="#7c3aed">Désignation</IL>
            <input type="text" name="designation" value={form.designation} onChange={hc}
              placeholder="Désignation" className={inp} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Hash} color="#64748b">Numéro</IL>
            <input type="text" name="numero" value={form.numero} onChange={hc}
              placeholder="N° enregistrement" className={inp} />
          </div>
          <div>
            <IL icon={Calendar} color="#059669">Date</IL>
            <input type="datetime-local" name="date" value={form.date} onChange={hc} className={inp} />
          </div>
        </div>
      </SectionCard>

      {/* ── Péage ── */}
      <SectionCard title="Péage" color={AMBER}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={MapPin} color="#059669">Péage départ</IL>
            <input type="text" name="peageDepart" value={form.peageDepart} onChange={hc}
              placeholder="Nom / lieu péage départ" className={inp} />
          </div>
          <div>
            <IL icon={MapPin} color="#dc2626">Péage arrivée</IL>
            <input type="text" name="peageArrivee" value={form.peageArrivee} onChange={hc}
              placeholder="Nom / lieu péage arrivée" className={inp} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={CreditCard} color="#7c3aed">Type de paiement</IL>
            <select name="typePaiement" value={form.typePaiement} onChange={hc} className={inp}>
              <option value="">— Sélectionner —</option>
              <option value="Espèces">Espèces</option>
              <option value="Carte bancaire">Carte bancaire</option>
              <option value="Carte carburant">Carte carburant</option>
              <option value="Jawaz">Jawaz</option>
              <option value="Vignette">Vignette</option>
            </select>
          </div>
          <div>
            <IL icon={Paperclip} color="#64748b">Attachement</IL>
            <input type="text" name="attachement" value={form.attachement} onChange={hc}
              placeholder="Lien ou référence document..." className={inp} />
          </div>
        </div>
      </SectionCard>

      {/* ── Montant ── */}
      <SectionCard title="Montant" color="#059669">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumField label="Montant HT"  icon={DollarSign} name="montantHT"  value={form.montantHT}  onChange={hc} suffix="DH" />
          <NumField label="TVA"         icon={Calculator}  name="tva"        value={form.tva}        onChange={hc} suffix="%" />
          <NumField label="Montant TTC" icon={DollarSign}  name="montantTTC" value={montantTTC}       suffix="DH" readOnly />
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pb-6">
        <button onClick={handleCancel}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
          Annuler
        </button>
        <button onClick={handleSubmitAndAdd}
          disabled={create.isPending || !form.vehicule}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50 border border-white/30"
          style={{ background: `linear-gradient(135deg, #7c2d12 0%, ${ORANGE} 100%)` }}>
          <RotateCcw className="w-4 h-4" />
          {create.isPending ? 'Enregistrement...' : 'Enregistrer & Ajouter'}
        </button>
        <button onClick={handleSubmit}
          disabled={create.isPending || !form.vehicule}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, #431407 0%, #7c2d12 60%, ${ORANGE} 100%)` }}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
