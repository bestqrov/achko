'use client';

import { useState, useMemo } from 'react';
import {
  Plus, ArrowLeft, Car, User, Hash, Calendar, CreditCard,
  Tag, Layers, Building2, DollarSign, Calculator, Percent,
  Paperclip, MessageSquare, Briefcase, BarChart2,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

/* ── theme ─────────────────────────────────────────────────── */
const ROSE   = '#be123c';
const PURPLE = '#7c3aed';

/* ── small helpers ─────────────────────────────────────────── */
function IL({ icon: Icon, color, children }: {
  icon: React.ElementType; color?: string; children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: color ?? ROSE }} />
      {children}
    </label>
  );
}

const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white placeholder-gray-400';

function NumField({ label, icon: Icon, name, value, onChange, suffix, readOnly = false, color }: {
  label: string; icon: React.ElementType; name: string; value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix: string; readOnly?: boolean; color?: string;
}) {
  return (
    <div>
      <IL icon={Icon} color={color ?? ROSE}>{label}</IL>
      <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-rose-400">
        <input
          type="number" step="0.01" name={name} value={value}
          onChange={onChange} readOnly={readOnly}
          className={`flex-1 px-3 py-2.5 text-sm outline-none bg-white ${readOnly ? 'bg-rose-50 text-rose-700 font-semibold cursor-default' : ''}`}
        />
        <span className="px-3 py-2.5 bg-gray-50 border-l border-gray-200 text-xs font-bold text-gray-500 flex items-center">
          {suffix}
        </span>
      </div>
    </div>
  );
}

/* ── two-column field grid item ───────────────────────────── */
function F({ label, icon: Icon, color, children }: {
  label: string; icon: React.ElementType; color?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <IL icon={Icon} color={color ?? ROSE}>{label}</IL>
      {children}
    </div>
  );
}

/* ── floating section card ─────────────────────────────────── */
function Card({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b"
        style={{ background: `linear-gradient(90deg,${accent}18,${accent}06)`, borderColor: `${accent}28` }}>
        <div className="w-1 h-4 rounded-full" style={{ background: accent }} />
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{title}</span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ── columns ───────────────────────────────────────────────── */
type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'numero',         label: 'Numéro' },
  { key: 'date',           label: 'Date',          render: (v) => formatDate(v) },
  { key: 'vehicule',       label: 'Véhicule' },
  { key: 'collaborateur',  label: 'Collaborateur' },
  { key: 'typePaiement',   label: 'Type paiement' },
  { key: 'typeDep',        label: 'Type dépense' },
  { key: 'quantite',       label: 'Quantité' },
  { key: 'montantHT',      label: 'Montant HT',    render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'tva',            label: 'TVA',            render: (v) => v != null ? `${Number(v).toFixed(2)} %` : '—' },
  { key: 'montant',        label: 'Montant TTC',    render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'direction',      label: 'Direction' },
  { key: 'departement',    label: 'Département' },
];

/* ── empty form ────────────────────────────────────────────── */
const makeEmpty = () => ({
  vehicule:        '',
  collaborateur:   '',
  numero:          '',
  date:            new Date().toISOString().slice(0, 16),
  typePaiement:    '',
  numeroUtilisation: '',
  typeDep:         '',
  numeroImputation:'',
  unite:           '',
  quantite:        '',
  montantHT:       '',
  direction:       '',
  tva:             '20',
  departement:     '',
  commentaire:     '',
  attachement:     '',
});

/* ── page ──────────────────────────────────────────────────── */
export default function DepensesPage() {
    // Données fictives pour le formulaire dépense
    const MOCKDATA = {
      vehicule: 'Peugeot 208',
      collaborateur: 'Jean Dupont',
      numero: 'DEP-2026-01',
      date: '2026-03-09T10:00',
      typePaiement: 'Carte bancaire',
      numeroUtilisation: 'UTIL-2026-01',
      typeDep: 'Carburant',
      numeroImputation: 'IMP-2026-01',
      unite: 'Litre',
      quantite: '40',
      montantHT: '800',
      direction: 'Direction Générale',
      tva: '20',
      departement: 'Exploitation',
      commentaire: 'Dépense carburant mensuelle',
      attachement: '',
    };
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(makeEmpty());

  const { data, isLoading }    = useResource<any>('consommation', { page, search, type: 'depense' });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const create                 = useCreateResource('consommation');

  /* auto-compute TTC */
  const montantTTC = useMemo(() => {
    const ht  = parseFloat(form.montantHT) || 0;
    const tva = parseFloat(form.tva) || 0;
    return (ht + ht * (tva / 100)).toFixed(2);
  }, [form.montantHT, form.tva]);

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(makeEmpty()); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      type:      'depense',
      montantHT: parseFloat(form.montantHT) || 0,
      tva:       parseFloat(form.tva) || 0,
      montantTTC:parseFloat(montantTTC) || 0,
      montant:   parseFloat(montantTTC) || 0,
      quantite:  parseFloat(form.quantite) || 0,
    });
    handleCancel();
  };

  const vehicles: any[] = vehiclesData?.data ?? [];

  /* ── LIST ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dépenses</h2>
            <p className="text-sm text-gray-500 mt-1">Suivi des dépenses véhicule</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow hover:opacity-90 transition-all"
            style={{ background: `linear-gradient(135deg,#881337 0%,${ROSE} 100%)` }}>
            <Plus className="w-4 h-4" /> Nouvelle Dépense
          </button>
        </div>

        <SearchFilter onSearch={setSearch} placeholder="Rechercher une dépense..." filters={[]} />

        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune dépense trouvée" />
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="space-y-5 pb-8">

      {/* Remplir automatiquement le formulaire avec des données fictives */}
      <button
        type="button"
        className="mb-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold"
        onClick={() => setForm(MOCKDATA)}
      >
        Remplir avec des données fictives
      </button>

      {/* ── Banner header ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg,#4c0519 0%,#881337 35%,#be123c 70%,#e11d48 100%)' }}>

          {/* watermark */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none">
            <Briefcase className="w-32 h-32 text-white" strokeWidth={0.7} />
          </div>
          {/* shimmer dots */}
          {[{x:72,y:18},{x:83,y:52},{x:90,y:28}].map((p,i)=>(
            <div key={i} className="absolute w-2 h-2 rounded-full bg-rose-200/25 pointer-events-none"
              style={{left:`${p.x}%`,top:`${p.y}%`}} />
          ))}

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Briefcase className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <span className="text-[10px] bg-rose-400/30 text-rose-100 font-bold px-2 py-0.5 rounded-full tracking-widest border border-rose-300/30">
                DÉPENSE VÉHICULE
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide mt-0.5">Nouvelle Dépense</h3>
              <p className="text-rose-200 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>

          <button onClick={handleCancel} className="z-10 flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
        {/* accent band */}
        <div className="flex h-1.5">
          {['#4c0519','#881337','#be123c','#e11d48','#fb7185','#fecdd3'].map((c,i)=>(
            <div key={i} className="flex-1" style={{background:c}} />
          ))}
        </div>
      </div>

      {/* ── Véhicule section ── */}
      <Card title="Dépense véhicule" accent={ROSE}>
        <div>
          <F label="Véhicule *" icon={Car} color={ROSE}>
            <select name="vehicule" value={form.vehicule} onChange={hc} className={inp}>
              <option value="">— Sélectionner un véhicule —</option>
              {vehicles.map((v:any) => (
                <option key={v._id} value={v._id}>{v.immatriculation ?? v.matricule ?? v._id}</option>
              ))}
            </select>
          </F>
        </div>
        <div>
          <F label="Collaborateur" icon={User} color="#0891b2">
            <input type="text" name="collaborateur" value={form.collaborateur} onChange={hc}
              placeholder="Nom du collaborateur" className={inp} />
          </F>
        </div>
      </Card>

      {/* ── Informations générales ── */}
      <Card title="Informations générales" accent={PURPLE}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <F label="Numéro" icon={Hash} color={PURPLE}>
            <input type="text" name="numero" value={form.numero} onChange={hc}
              placeholder="N° enregistrement" className={inp} />
          </F>
          <F label="Date" icon={Calendar} color="#059669">
            <input type="datetime-local" name="date" value={form.date} onChange={hc} className={inp} />
          </F>
          <F label="Type de paiement" icon={CreditCard} color="#0891b2">
            <select name="typePaiement" value={form.typePaiement} onChange={hc} className={inp}>
              <option value="">— Sélectionner —</option>
              <option value="Espèces">Espèces</option>
              <option value="Carte bancaire">Carte bancaire</option>
              <option value="Carte carburant">Carte carburant</option>
              <option value="Virement">Virement</option>
              <option value="Chèque">Chèque</option>
            </select>
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Numéro d'utilisation" icon={Layers} color={PURPLE}>
            <input type="text" name="numeroUtilisation" value={form.numeroUtilisation} onChange={hc}
              placeholder="N° utilisation" className={inp} />
          </F>
          <F label="Type dépense" icon={Tag} color={ROSE}>
            <select name="typeDep" value={form.typeDep} onChange={hc} className={inp}>
              <option value="">— Sélectionner —</option>
              <option value="Entretien">Entretien</option>
              <option value="Réparation">Réparation</option>
              <option value="Pneus">Pneus</option>
              <option value="Lavage">Lavage</option>
              <option value="Parking">Parking</option>
              <option value="Amende">Amende</option>
              <option value="Autre">Autre</option>
            </select>
          </F>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Numéro imputation" icon={Hash} color="#64748b">
            <input type="text" name="numeroImputation" value={form.numeroImputation} onChange={hc}
              placeholder="N° imputation" className={inp} />
          </F>
          <F label="Unité" icon={BarChart2} color="#d97706">
            <input type="text" name="unite" value={form.unite} onChange={hc}
              placeholder="Unité (ex: km, h, pce...)" className={inp} />
          </F>
        </div>
      </Card>

      {/* ── Coût ── */}
      <Card title="Coût" accent="#059669">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumField label="Quantité" icon={Layers} name="quantite" value={form.quantite} onChange={hc} suffix="u." color="#0891b2" />
          <NumField label="Montant HT" icon={DollarSign} name="montantHT" value={form.montantHT} onChange={hc} suffix="DH" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Direction" icon={Building2} color="#7c3aed">
            <input type="text" name="direction" value={form.direction} onChange={hc}
              placeholder="Direction" className={inp} />
          </F>
          <NumField label="TVA" icon={Percent} name="tva" value={form.tva} onChange={hc} suffix="%" color={PURPLE} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Département" icon={Building2} color="#0891b2">
            <input type="text" name="departement" value={form.departement} onChange={hc}
              placeholder="Département" className={inp} />
          </F>
          <NumField label="Montant TTC" icon={DollarSign} name="montantTTC" value={montantTTC} suffix="DH" readOnly />
        </div>
      </Card>

      {/* ── Commentaire & Attachement ── */}
      <Card title="Divers" accent="#64748b">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Commentaire" icon={MessageSquare} color="#64748b">
            <textarea name="commentaire" value={form.commentaire} onChange={hc} rows={3}
              placeholder="Remarques..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white resize-none placeholder-gray-400" />
          </F>
          <F label="Attachement" icon={Paperclip} color="#7c3aed">
            <input type="text" name="attachement" value={form.attachement} onChange={hc}
              placeholder="Lien ou référence document..." className={inp} />
          </F>
        </div>
      </Card>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3">
        <button onClick={handleCancel}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={create.isPending || !form.vehicule}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: `linear-gradient(135deg,#881337 0%,${ROSE} 100%)` }}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
