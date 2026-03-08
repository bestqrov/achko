'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar,
  Paperclip, MessageSquare, HeartPulse, Tag, Building2, FileText,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const MED_GREEN  = '#047857';
const MED_TEAL   = '#0d9488';
const MED_RED    = '#dc2626';

const EMPTY_FORM = {
  type: 'visite_medicale',
  libelle: '',
  collaborateur: '',
  typeVisite: '',
  centreMedical: '',
  dateVisite: '',
  dateDebut: '',
  dateFin: '',
  nomMedecin: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur', label: 'Collaborateur' },
  { key: 'libelle',       label: 'Libellé' },
  { key: 'typeVisite',    label: 'Type visite' },
  { key: 'centreMedical', label: 'Centre médical' },
  { key: 'dateVisite',    label: 'Date visite', render: (v: string) => formatDate(v) },
  { key: 'nomMedecin',    label: 'Médecin' },
];

function SectionHead({ cross, children }: { cross?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      {cross && (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-500 text-white font-bold text-xs select-none">+</span>
      )}
      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">{children}</p>
    </div>
  );
}

function IL({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50';

export default function VisiteMedicalePage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'visite_medicale' });
  const create              = useCreateResource('gestion');

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };
  const handleSubmit = async () => { await create.mutateAsync(form); handleCancel(); };

  /* ── LIST ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visites Médicales</h2>
            <p className="text-sm text-gray-500 mt-1">Suivi des visites médicales des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #10b981 100%)' }}>
            <Plus className="w-4 h-4" /> Nouvelle Visite
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher une visite..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune visite médicale trouvée" />
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 40%, #059669 70%, #10b981 100%)' }}>
          {/* decorative cross watermark */}
          <div className="absolute right-24 top-1/2 -translate-y-1/2 opacity-10 select-none pointer-events-none">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="white">
              <rect x="30" y="0"  width="20" height="80" rx="4"/>
              <rect x="0"  y="30" width="80" height="20" rx="4"/>
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                  <span>+</span> Personnel
                </span>
                <h3 className="text-xl font-bold text-white">Visite médicale</h3>
              </div>
              <p className="text-emerald-100 text-xs mt-0.5">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      {/* ── Section 1 : Informations générales ── */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-5">
        <SectionHead cross>Informations générales</SectionHead>

        {/* Libellé */}
        <IL icon={FileText} color={MED_GREEN}>Libellé</IL>
        <input type="text" name="libelle" value={form.libelle} onChange={hc}
          placeholder="Libellé de la visite"
          className={inp} />

        {/* Collaborateur | Type visite */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={User} color={MED_GREEN}>Collaborateur *</IL>
            <input type="text" name="collaborateur" value={form.collaborateur} onChange={hc}
              placeholder="Nom du collaborateur" className={inp} />
          </div>
          <div>
            <IL icon={Tag} color="#d97706">Type visite médicale</IL>
            <select name="typeVisite" value={form.typeVisite} onChange={hc} className={inp}>
              <option value="">— Sélectionner —</option>
              <option value="Embauche">À l'embauche</option>
              <option value="Périodique">Périodique</option>
              <option value="Reprise">Reprise de travail</option>
              <option value="Spontanée">Spontanée</option>
              <option value="Aptitude poste">Aptitude au poste</option>
            </select>
          </div>
        </div>

        {/* Centre médical */}
        <div>
          <IL icon={Building2} color={MED_TEAL}>Centre médical</IL>
          <input type="text" name="centreMedical" value={form.centreMedical} onChange={hc}
            placeholder="Nom du centre ou établissement médical" className={inp} />
        </div>

        {/* Date visite */}
        <div className="max-w-xs">
          <IL icon={Calendar} color={MED_GREEN}>Date visite</IL>
          <input type="date" name="dateVisite" value={form.dateVisite} onChange={hc} className={inp} />
        </div>
      </div>

      {/* ── Section 2 : Autres informations ── */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-5">
        <SectionHead cross>Autres informations</SectionHead>

        {/* Date début | Date fin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IL icon={Calendar} color={MED_GREEN}>Date début</IL>
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={hc} className={inp} />
          </div>
          <div>
            <IL icon={Calendar} color={MED_RED}>Date fin</IL>
            <input type="date" name="dateFin" value={form.dateFin} onChange={hc} className={inp} />
          </div>
        </div>

        {/* Nom médecin */}
        <div>
          <IL icon={User} color={MED_TEAL}>Nom médecin</IL>
          <input type="text" name="nomMedecin" value={form.nomMedecin} onChange={hc}
            placeholder="Nom et prénom du médecin" className={inp} />
        </div>

        {/* Attachement */}
        <div>
          <IL icon={Paperclip} color="#7c3aed">Attachement</IL>
          <input type="text" name="attachement" value={form.attachement} onChange={hc}
            placeholder="Lien ou référence document..." className={inp} />
        </div>

        {/* Commentaire */}
        <div>
          <IL icon={MessageSquare} color="#64748b">Commentaire</IL>
          <textarea name="commentaire" value={form.commentaire} onChange={hc} rows={3}
            placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none" />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
