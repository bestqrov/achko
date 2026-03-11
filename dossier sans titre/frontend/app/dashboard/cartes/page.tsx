'use client';

import { useState, useMemo } from 'react';
import {
  Plus, ArrowLeft, Hash, User, Calendar, DollarSign,
  MessageSquare, Tag, Settings, Layers, CreditCard, Zap,
  Key, Building2, Activity, ToggleRight, ShieldCheck,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency } from '@/lib/utils/helpers';

/* ── theme ─────────────────────────────────────────────────── */
const BLUE   = '#1e40af';
const INDIGO = '#4f46e5';

/* ── helpers ───────────────────────────────────────────────── */
function IL({ icon: Icon, color, children }: { icon: React.ElementType; color?: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: color ?? BLUE }} />
      {children}
    </label>
  );
}

const inp    = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50';
const numInp = 'flex-1 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50';

function NumField({ label, icon: Icon, name, value, onChange, suffix }: {
  label: string; icon: React.ElementType; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; suffix: string;
}) {
  return (
    <div>
      <IL icon={Icon} color={BLUE}>{label}</IL>
      <div className="flex">
        <input type="number" step="0.01" name={name} value={value} onChange={onChange} className={numInp} />
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
  { key: 'numero',          label: 'Numéro' },
  { key: 'nom',             label: 'Nom' },
  { key: 'dateDebut',       label: 'Date début',         render: (v) => formatDate(v) },
  { key: 'dateFin',         label: 'Date fin',            render: (v) => formatDate(v) },
  { key: 'soldeInitial',    label: 'Solde initial',       render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'plafondCarburant',label: 'Plafond carburant',   render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'plafondService',  label: 'Plafond service',     render: (v) => v != null ? formatCurrency(v) : '—' },
  { key: 'flotte',          label: 'Flotte' },
  { key: 'fournisseur',     label: 'Fournisseur' },
  { key: 'typeCarte',       label: 'Type carte' },
  { key: 'typeAffectation', label: 'Type affectation' },
  {
    key: 'statut', label: 'Statut', render: (v) => {
      const map: Record<string, string> = {
        actif: 'bg-green-100 text-green-700',
        suspendu: 'bg-yellow-100 text-yellow-700',
        terminé: 'bg-red-100 text-red-700',
        en_attente: 'bg-gray-100 text-gray-600',
      };
      return v ? (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[v] ?? 'bg-gray-100 text-gray-600'}`}>{v}</span>
      ) : '—';
    }
  },
];

/* ── form defaults ─────────────────────────────────────────── */
const EMPTY_FORM = {
  type: 'carte',
  numero: '',
  nom: '',
  dateDebut: '',
  dateFin: '',
  soldeInitial: '',
  plafondCarburant: '',
  plafondService: '',
  tagJawaz: '',
  quota: '',
  codePin: '',
  commentaire: '',
  flotte: '',
  fournisseur: '',
  activite: '',
  typeCarte: '',
  typeAffectation: '',
  statut: 'actif',
};

/* ── page ──────────────────────────────────────────────────── */
export default function CartesPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'carte' });
  const create              = useCreateResource('gestion');

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };
  const handleSubmit = async () => {
    await create.mutateAsync({
      ...form,
      soldeInitial:     parseFloat(form.soldeInitial)     || 0,
      plafondCarburant: parseFloat(form.plafondCarburant) || 0,
      plafondService:   parseFloat(form.plafondService)   || 0,
    });
    handleCancel();
  };

  /* ══════════════════════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════════════════════ */
  if (view === 'list') {
    return (
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cartes</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des cartes carburant & services</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${INDIGO} 100%)` }}>
            <Plus className="w-4 h-4" /> Nouvelle Carte
          </button>
        </div>

        <SearchFilter onSearch={setSearch} placeholder="Rechercher une carte..." filters={[]} />

        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune carte trouvée" />
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     FORM VIEW
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-5">

      {/* ── Header — card visual ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: `linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, ${BLUE} 70%, ${INDIGO} 100%)` }}>

          {/* Card watermark */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
            <CreditCard className="w-28 h-28 text-white" strokeWidth={0.8} />
          </div>

          {/* Circuit dots */}
          {[{ x: 70, y: 20 }, { x: 80, y: 55 }, { x: 86, y: 35 }].map((p, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-blue-300/30 pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%` }} />
          ))}

          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <CreditCard className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs bg-blue-400/30 text-blue-100 font-semibold px-2 py-0.5 rounded-full tracking-wide border border-blue-300/30">
                  CARTE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">Nouvelle Carte</h3>
              <p className="text-blue-200 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>

          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>

        {/* EMV chip strip */}
        <div className="flex h-1.5">
          {['#0f172a','#1e3a8a','#1d4ed8','#3b82f6','#60a5fa','#93c5fd'].map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ── Informations de base ── */}
      <SectionCard title="Informations de base" color={BLUE}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Hash} color={BLUE}>Numéro</IL>
            <input type="text" name="numero" value={form.numero} onChange={hc}
              placeholder="N° de la carte" className={inp} />
          </div>
          <div>
            <IL icon={User} color={INDIGO}>Nom</IL>
            <input type="text" name="nom" value={form.nom} onChange={hc}
              placeholder="Nom ou libellé" className={inp} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Calendar} color="#059669">Date début</IL>
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={hc} className={inp} />
          </div>
          <div>
            <IL icon={Calendar} color="#dc2626">Date fin</IL>
            <input type="date" name="dateFin" value={form.dateFin} onChange={hc} className={inp} />
          </div>
        </div>
      </SectionCard>

      {/* ── Plafonds & Solde ── */}
      <SectionCard title="Plafonds & Solde" color="#059669">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumField label="Solde initial"     icon={DollarSign} name="soldeInitial"     value={form.soldeInitial}     onChange={hc} suffix="DH" />
          <NumField label="Plafond carburant" icon={DollarSign} name="plafondCarburant" value={form.plafondCarburant} onChange={hc} suffix="DH" />
          <NumField label="Plafond service"   icon={DollarSign} name="plafondService"   value={form.plafondService}   onChange={hc} suffix="DH" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <IL icon={Zap} color="#f59e0b">Tag jawaz</IL>
            <input type="text" name="tagJawaz" value={form.tagJawaz} onChange={hc}
              placeholder="Identifiant tag" className={inp} />
          </div>
          <div>
            <IL icon={Layers} color="#0891b2">Quota</IL>
            <input type="text" name="quota" value={form.quota} onChange={hc}
              placeholder="Quota" className={inp} />
          </div>
          <div>
            <IL icon={Key} color="#64748b">Code pin</IL>
            <input type="password" name="codePin" value={form.codePin} onChange={hc}
              placeholder="••••" className={inp} />
          </div>
        </div>

        <div>
          <IL icon={MessageSquare} color="#64748b">Commentaire</IL>
          <textarea name="commentaire" value={form.commentaire} onChange={hc} rows={2}
            placeholder="Remarques..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
        </div>
      </SectionCard>

      {/* ── Caractéristiques ── */}
      <SectionCard title="Caractéristiques" color={INDIGO}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Tag} color={INDIGO}>Flotte</IL>
            <input type="text" name="flotte" value={form.flotte} onChange={hc}
              placeholder="Nom de la flotte" className={inp} />
          </div>
          <div>
            <IL icon={Building2} color="#0891b2">Fournisseur</IL>
            <input type="text" name="fournisseur" value={form.fournisseur} onChange={hc}
              placeholder="Nom du fournisseur" className={inp} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Activity} color="#059669">Activité</IL>
            <input type="text" name="activite" value={form.activite} onChange={hc}
              placeholder="Activité" className={inp} />
          </div>
          <div>
            <IL icon={CreditCard} color={BLUE}>Type carte</IL>
            <select name="typeCarte" value={form.typeCarte} onChange={hc} className={inp}>
              <option value="">— Sélectionner —</option>
              <option value="Carburant">Carburant</option>
              <option value="Service">Service</option>
              <option value="Mixte">Mixte</option>
              <option value="Jawaz">Jawaz</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Settings} color="#7c3aed">Type affectation</IL>
            <select name="typeAffectation" value={form.typeAffectation} onChange={hc} className={inp}>
              <option value="">— Sélectionner —</option>
              <option value="Véhicule">Véhicule</option>
              <option value="Chauffeur">Chauffeur</option>
              <option value="Flotte">Flotte</option>
            </select>
          </div>
          <div>
            <IL icon={ShieldCheck} color="#059669">Statut</IL>
            <select name="statut" value={form.statut} onChange={hc} className={inp}>
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
              <option value="terminé">Terminé</option>
              <option value="en_attente">En attente</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pb-6">
        <button onClick={handleCancel}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
          Annuler
        </button>
        <button onClick={handleSubmit} disabled={create.isPending}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${INDIGO} 100%)` }}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

