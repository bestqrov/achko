'use client';

import { useState, useMemo } from 'react';
import {
  Fuel, TrendingUp, DollarSign, Gauge, Navigation,
  BarChart3, Droplets, Calculator, MapPin, Filter, RefreshCw,
  Plus, ArrowLeft, Car, User, Tag, Calendar, Flame, Building2,
  CreditCard, Hash, Paperclip, MessageSquare, ToggleRight,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

/* ── helpers ───────────────────────────────────────────────── */
const G  = '#047857';  // primary green
const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50';
const numInp = 'flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50';

function IL({ icon: Icon, color, children }: { icon: React.ElementType; color?: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: color ?? G }} />
      {children}
    </label>
  );
}

function NumField({ label, icon: Icon, name, value, onChange, suffix, readOnly = false }: {
  label: string; icon: React.ElementType; name: string; value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; suffix: string; readOnly?: boolean;
}) {
  return (
    <div>
      <IL icon={Icon} color={G}>{label}</IL>
      <div className="flex">
        <input type="number" step="0.01" name={name} value={value}
          onChange={onChange} readOnly={readOnly}
          className={readOnly ? `${numInp} bg-emerald-50 text-emerald-700 font-semibold cursor-default` : numInp} />
        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-xs font-semibold text-gray-500">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function SectionCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b flex items-center gap-2"
        style={{ background: `linear-gradient(to right, ${color}10, ${color}05)`, borderColor: `${color}25` }}>
        <div className="w-1 h-4 rounded-full" style={{ background: color }} />
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ── form defaults ─────────────────────────────────────────── */
const now = () => {
  const d = new Date();
  return d.toISOString().slice(0, 16);
};

const EMPTY_FORM = {
  vehicule: '',
  collaborateur: '',
  designation: '',
  numero: '',
  date: now(),
  typeCarburant: '',
  station: '',
  modePaiement: '',
  quantite: '',
  prixUnitaire: '',
  montantHT: '',
  tva: '20',
  plein: false as boolean,
  kilometrage: '',
  distanceParcourue: '',
  pourcentageConso: '',
  indexeHoraire: '',
  attachement: '',
  commentaire: '',
};

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
  icon: Icon, label, value, accent, iconBg,
}: { icon: React.ElementType; label: string; value: string; accent: string; iconBg: string }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden flex items-start gap-3">
      <div className={`flex-shrink-0 rounded-xl p-2.5 ${iconBg}`}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
        <p className="text-lg font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: accent }} />
    </div>
  );
}

/* ── gradient header (shared) ──────────────────────────────── */
function Header({ onBack, onAdd, onRefresh, isFetching, showAdd }: {
  onBack?: () => void; onAdd?: () => void; onRefresh?: () => void;
  isFetching?: boolean; showAdd?: boolean;
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md">
      <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 65%, #059669 100%)' }}>
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

        <div className="flex items-center gap-2">
          {showAdd && (
            <button onClick={onAdd}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all border border-white/30">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          )}
          {onRefresh && (
            <button onClick={onRefresh}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualiser
            </button>
          )}
          {onBack && (
            <button onClick={onBack}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
          )}
        </div>
      </div>
      <div className="flex h-1">
        {['#064e3b','#047857','#059669','#10b981','#34d399','#6ee7b7'].map((c, i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

/* ── page ──────────────────────────────────────────────────── */
export default function CarburantPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading, refetch, isFetching } = useResource<any>('consommation', { page, search });
  const { data: vehiclesData }                    = useResource<any>('vehicles', { limit: 200 });
  const create = useCreateResource('consommation');

  const rows: any[] = data?.data ?? [];

  const montantTTC = useMemo(() => {
    const ht  = parseFloat(form.montantHT)  || 0;
    const tva = parseFloat(form.tva) || 0;
    return (ht + ht * (tva / 100)).toFixed(2);
  }, [form.montantHT, form.tva]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setForm((f) => ({ ...f, [target.name]: target.type === 'checkbox' ? target.checked : target.value }));
  };

  const handleCancel = () => { setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 16) }); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      type: 'carburant',
      montant:          parseFloat(montantTTC)      || 0,
      quantite:         parseFloat(form.quantite)   || 0,
      prixUnitaire:     parseFloat(form.prixUnitaire)|| 0,
      montantHT:        parseFloat(form.montantHT)  || 0,
      tva:              parseFloat(form.tva)         || 0,
      montantTTC:       parseFloat(montantTTC)       || 0,
      kilometrage:      parseFloat(form.kilometrage) || 0,
      distanceParcourue:parseFloat(form.distanceParcourue) || 0,
      pourcentageConso: parseFloat(form.pourcentageConso)  || 0,
      indexeHoraire:    parseFloat(form.indexeHoraire)     || 0,
    });
    handleCancel();
  };

  /* ── analytics ─────────────────────────────────────────── */
  const stats = useMemo(() => {
    const sumHT   = rows.reduce((s, r) => s + (Number(r.montantHT)         || 0), 0);
    const sumTTC  = rows.reduce((s, r) => s + (Number(r.montantTTC)        || 0), 0);
    const sumQte  = rows.reduce((s, r) => s + (Number(r.quantite)          || 0), 0);
    const sumDist = rows.reduce((s, r) => s + (Number(r.distanceParcourue) || 0), 0);
    const avgPrix = sumQte  > 0 ? sumHT / sumQte  : 0;
    const cPct    = rows.filter(r => r.pourcentageConso != null);
    const avgConso= cPct.length > 0 ? cPct.reduce((s, r) => s + (Number(r.pourcentageConso) || 0), 0) / cPct.length : 0;
    const coutKm  = sumDist > 0 ? sumHT / sumDist : 0;
    return { n: data?.total ?? rows.length, sumHT, sumTTC, sumQte, sumDist, avgPrix, avgConso, coutKm };
  }, [rows, data?.total]);

  const fmt2 = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ══════════════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════════════ */
  if (view === 'list') {
    return (
      <div className="space-y-6">

        <Header showAdd onAdd={() => setView('form')} onRefresh={() => refetch()} isFetching={isFetching} />

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
            <Filter className="w-3.5 h-3.5" /> Filtre
          </div>
          <div className="flex-1 min-w-52">
            <SearchFilter onSearch={setSearch} placeholder="Rechercher par véhicule, collaborateur..." filters={[]} />
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={BarChart3}  label="Nombre d'enregistrements" value={String(stats.n)}              accent="#047857" iconBg="bg-emerald-50" />
          <StatCard icon={DollarSign} label="Montant total HT"          value={`${fmt2(stats.sumHT)} DH`}   accent="#0891b2" iconBg="bg-cyan-50" />
          <StatCard icon={DollarSign} label="Montant total TTC"         value={`${fmt2(stats.sumTTC)} DH`}  accent="#7c3aed" iconBg="bg-violet-50" />
          <StatCard icon={Droplets}   label="Quantité totale (L)"       value={fmt2(stats.sumQte)}           accent="#f59e0b" iconBg="bg-amber-50" />
          <StatCard icon={Navigation} label="Distance parcourue (Km)"   value={fmt2(stats.sumDist)}          accent="#16a34a" iconBg="bg-green-50" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={MapPin}     label="Distance parcourue KM / H" value={fmt2(stats.sumDist)}          accent="#0891b2" iconBg="bg-sky-50" />
          <StatCard icon={TrendingUp} label="Prix unitaire moyen HT"    value={`${fmt2(stats.avgPrix)} DH`} accent="#dc2626" iconBg="bg-red-50" />
          <StatCard icon={Gauge}      label="Taux de consommation moy." value={fmt2(stats.avgConso)}         accent="#d97706" iconBg="bg-orange-50" />
          <StatCard icon={Calculator} label="Coût par kilomètre"        value={fmt2(stats.coutKm)}           accent="#7c3aed" iconBg="bg-purple-50" />
        </div>

        {/* Data table */}
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

  /* ══════════════════════════════════════════════════════════
     FORM VIEW
  ══════════════════════════════════════════════════════════ */
  const vehicles: any[] = vehiclesData?.data ?? [];

  return (
    <div className="space-y-5">

      <Header onBack={handleCancel} />

      {/* ── Véhicule + Collaborateur ── */}
      <SectionCard title="Véhicule" color={G}>
        <div>
          <IL icon={Car} color={G}>Véhicule *</IL>
          <select name="vehicule" value={form.vehicule} onChange={handleChange} className={inp}>
            <option value="">— Sélectionner un véhicule —</option>
            {vehicles.map((v: any) => (
              <option key={v._id} value={v._id}>{v.immatriculation ?? v.matricule ?? v._id}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={User} color="#0891b2">Collaborateur</IL>
            <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange}
              placeholder="Nom du collaborateur" className={inp} />
          </div>
          <div>
            <IL icon={Tag} color="#7c3aed">Désignation</IL>
            <input type="text" name="designation" value={form.designation} onChange={handleChange}
              placeholder="Désignation" className={inp} />
          </div>
        </div>
      </SectionCard>

      {/* ── Informations générales ── */}
      <SectionCard title="Informations générales" color="#0891b2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Hash} color="#0891b2">Numéro</IL>
            <input type="text" name="numero" value={form.numero} onChange={handleChange}
              placeholder="N° enregistrement" className={inp} />
          </div>
          <div>
            <IL icon={Calendar} color="#059669">Date</IL>
            <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className={inp} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Flame} color="#f59e0b">Type carburant</IL>
            <select name="typeCarburant" value={form.typeCarburant} onChange={handleChange} className={inp}>
              <option value="">— Sélectionner —</option>
              <option value="Diesel">Diesel</option>
              <option value="Essence">Essence</option>
              <option value="GPL">GPL</option>
              <option value="Electrique">Électrique</option>
              <option value="Hybride">Hybride</option>
              <option value="GNV">GNV</option>
            </select>
          </div>
          <div>
            <IL icon={Building2} color="#64748b">Station</IL>
            <input type="text" name="station" value={form.station} onChange={handleChange}
              placeholder="Nom de la station" className={inp} />
          </div>
        </div>
      </SectionCard>

      {/* ── Coûts ── */}
      <SectionCard title="Coûts" color="#059669">
        <div>
          <IL icon={CreditCard} color="#059669">Mode de paiement</IL>
          <select name="modePaiement" value={form.modePaiement} onChange={handleChange} className={inp}>
            <option value="">— Sélectionner —</option>
            <option value="Espèces">Espèces</option>
            <option value="Carte bancaire">Carte bancaire</option>
            <option value="Carte carburant">Carte carburant</option>
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumField label="Quantité" icon={Droplets} name="quantite"     value={form.quantite}     onChange={handleChange} suffix="L" />
          <NumField label="Prix unitaire" icon={TrendingUp} name="prixUnitaire" value={form.prixUnitaire} onChange={handleChange} suffix="DH" />
          <NumField label="Montant HT" icon={DollarSign} name="montantHT" value={form.montantHT} onChange={handleChange} suffix="DH" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumField label="TVA" icon={Calculator} name="tva" value={form.tva} onChange={handleChange} suffix="%" />
          <NumField label="Montant TTC" icon={DollarSign} name="montantTTC" value={montantTTC} suffix="DH" readOnly />
        </div>
      </SectionCard>

      {/* ── Plein / Conso / Kilométrage ── */}
      <SectionCard title="Plein / % conso / Kilométrage" color="#d97706">
        {/* Plein toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <ToggleRight className="w-4 h-4" style={{ color: '#d97706' }} /> Plein
          </span>
          <button type="button"
            onClick={() => setForm((f) => ({ ...f, plein: !f.plein }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.plein ? 'bg-amber-500' : 'bg-gray-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.plein ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-gray-500">{form.plein ? 'Oui' : 'Non'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumField label="Kilométrage" icon={Gauge}      name="kilometrage"       value={form.kilometrage}       onChange={handleChange} suffix="KM" />
          <NumField label="Distance parcourue" icon={Navigation} name="distanceParcourue" value={form.distanceParcourue} onChange={handleChange} suffix="KM" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumField label="% conso"       icon={BarChart3}  name="pourcentageConso" value={form.pourcentageConso} onChange={handleChange} suffix="%" />
          <NumField label="Indexe horaire" icon={MapPin}    name="indexeHoraire"    value={form.indexeHoraire}    onChange={handleChange} suffix="H" />
        </div>
      </SectionCard>

      {/* ── Divers ── */}
      <SectionCard title="Divers" color="#7c3aed">
        <div>
          <IL icon={Paperclip} color="#7c3aed">Attachement</IL>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange}
            placeholder="Lien ou référence document..." className={inp} />
        </div>
        <div>
          <IL icon={MessageSquare} color="#64748b">Commentaire</IL>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={3}
            placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none" />
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pb-6">
        <button onClick={handleCancel}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={create.isPending || !form.vehicule}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)' }}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

