'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar,
  Paperclip, MessageSquare, Stamp, Tag, FileText, BookOpen,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'visa',
  collaborateur: '',
  libelle: '',
  passeport: '',
  dateLivraison: '',
  dateDebutValidite: '',
  typeVisa: '',
  dateFinValidite: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur',     label: 'Collaborateur' },
  { key: 'libelle',           label: 'Libellé' },
  { key: 'typeVisa',          label: 'Type' },
  { key: 'passeport',         label: 'Passeport' },
  { key: 'dateDebutValidite', label: 'Début validité', render: (v: string) => formatDate(v) },
  { key: 'dateFinValidite',   label: 'Fin validité',   render: (v: string) => formatDate(v) },
];

function IL({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50';

export default function VisasPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'visa' });
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
            <h2 className="text-2xl font-bold text-gray-900">Visas</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des visas des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #7c3aed 100%)' }}>
            <Plus className="w-4 h-4" /> Nouveau Visa
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un visa..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun visa trouvé" />
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 65%, #7c3aed 100%)' }}>

          {/* Circular visa-stamp watermark */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="3" strokeDasharray="8 4"/>
              <circle cx="50" cy="50" r="34" stroke="white" strokeWidth="1.5"/>
              <text x="50" y="46" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" letterSpacing="2">VISA</text>
              <text x="50" y="58" textAnchor="middle" fill="white" fontSize="6" letterSpacing="1.5">APPROVED</text>
            </svg>
          </div>

          {/* Stars scatter */}
          {[{x:82,y:18}, {x:91,y:35}, {x:76,y:42}].map((s, i) => (
            <div key={i} className="absolute opacity-20 pointer-events-none select-none text-yellow-300"
              style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: 10 }}>★</div>
          ))}

          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/30">
              <Stamp className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">Nouveau Visa</h3>
              <p className="text-indigo-200 text-xs mt-0.5">Remplissez les informations ci-dessous</p>
            </div>
          </div>

          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>

        {/* Passport-style colour band */}
        <div className="flex h-1.5">
          {['#1e1b4b','#4338ca','#7c3aed','#a855f7','#c084fc','#e9d5ff'].map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ── Collaborateur card ── */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100">
          <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider">Collaborateur</p>
        </div>
        <div className="p-5">
          <IL icon={User} color="#4338ca">Collaborateur *</IL>
          <input type="text" name="collaborateur" value={form.collaborateur} onChange={hc}
            placeholder="Nom du collaborateur" className={inp} />
        </div>
      </div>

      {/* ── Informations générales ── */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100">
          <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider">Informations générales</p>
        </div>
        <div className="p-5 space-y-5">

          {/* Libellé */}
          <div>
            <IL icon={FileText} color="#4338ca">Libellé</IL>
            <input type="text" name="libelle" value={form.libelle} onChange={hc}
              placeholder="Libellé du visa" className={inp} />
          </div>

          {/* Passeport */}
          <div>
            <IL icon={BookOpen} color="#7c3aed">Passeport</IL>
            <input type="text" name="passeport" value={form.passeport} onChange={hc}
              placeholder="Numéro de passeport" className={inp} />
          </div>

          {/* Date livraison | Date début validité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <IL icon={Calendar} color="#059669">Date livraison</IL>
              <input type="date" name="dateLivraison" value={form.dateLivraison} onChange={hc} className={inp} />
            </div>
            <div>
              <IL icon={Calendar} color="#0891b2">Date de début validité</IL>
              <input type="date" name="dateDebutValidite" value={form.dateDebutValidite} onChange={hc} className={inp} />
            </div>
          </div>

          {/* Type | Date fin validité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <IL icon={Tag} color="#d97706">Type</IL>
              <select name="typeVisa" value={form.typeVisa} onChange={hc} className={inp}>
                <option value="">— Sélectionner —</option>
                <option value="Touriste">Touriste</option>
                <option value="Affaires">Affaires</option>
                <option value="Travail">Travail</option>
                <option value="Schengen">Schengen</option>
                <option value="Transit">Transit</option>
                <option value="Étudiant">Étudiant</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <IL icon={Calendar} color="#dc2626">Date de fin validité</IL>
              <input type="date" name="dateFinValidite" value={form.dateFinValidite} onChange={hc} className={inp} />
            </div>
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 resize-none" />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #7c3aed 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
