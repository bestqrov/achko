'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar,
  Paperclip, MessageSquare, BookMarked, Hash,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'passeport',
  collaborateur: '',
  numero: '',
  dateLivraison: '',
  dateFinValidite: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur',  label: 'Collaborateur' },
  { key: 'numero',         label: 'N° Passeport' },
  { key: 'dateLivraison',  label: 'Livraison',     render: (v: string) => formatDate(v) },
  { key: 'dateFinValidite',label: 'Fin validité',  render: (v: string) => formatDate(v) },
];

function IL({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50';

export default function PasseportsPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'passeport' });
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
            <h2 className="text-2xl font-bold text-gray-900">Passeports</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des passeports des collaborateurs</p>
          </div>
          <button onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #4c0519 0%, #881337 60%, #be123c 100%)' }}>
            <Plus className="w-4 h-4" /> Nouveau Passeport
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un passeport..." filters={[]} />
        <DataTable columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun passeport trouvé" />
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className="space-y-6">

      {/* ── Header — passport book cover ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4c0519 0%, #881337 35%, #9f1239 65%, #be123c 100%)' }}>

          {/* Passport emblem watermark */}
          <div className="absolute right-14 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
              <circle cx="48" cy="48" r="44" stroke="white" strokeWidth="2.5"/>
              <circle cx="48" cy="48" r="32" stroke="white" strokeWidth="1.5"/>
              <ellipse cx="48" cy="48" rx="14" ry="32" stroke="white" strokeWidth="1.5"/>
              <line x1="4"  y1="48" x2="92" y2="48" stroke="white" strokeWidth="1.5"/>
              <line x1="48" y1="4"  x2="48" y2="92" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* Gold dots */}
          {[{ x: 82, y: 20 }, { x: 88, y: 38 }, { x: 78, y: 55 }].map((p, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 opacity-50 pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%` }} />
          ))}

          <div className="flex items-center gap-3">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <BookMarked className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-400/30 text-amber-100 font-semibold px-2 py-0.5 rounded-full tracking-wide border border-amber-300/30">
                  PASSEPORT
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5 tracking-wide">Nouveau Passeport</h3>
              <p className="text-rose-200 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>

          <button onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>

        {/* MRZ-style strip */}
        <div className="bg-rose-950 px-6 py-1.5 flex items-center gap-1">
          {Array.from({ length: 44 }).map((_, i) => (
            <span key={i} className="text-rose-400/40 text-xs font-mono select-none leading-none">
              {['P', '<', 'M', 'A', 'R', 'O', 'C', '<'][i % 8]}
            </span>
          ))}
        </div>
      </div>

      {/* ── Collaborateur card ── */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-rose-500" />
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Collaborateur</p>
        </div>
        <div className="p-5">
          <IL icon={User} color="#be123c">Collaborateur *</IL>
          <input type="text" name="collaborateur" value={form.collaborateur} onChange={hc}
            placeholder="Nom du collaborateur" className={inp} />
        </div>
      </div>

      {/* ── Informations générales ── */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-rose-500" />
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Informations générales</p>
        </div>
        <div className="p-5 space-y-5">

          {/* Numéro */}
          <div>
            <IL icon={Hash} color="#be123c">Numéro</IL>
            <input type="text" name="numero" value={form.numero} onChange={hc}
              placeholder="N° du passeport" className={inp} />
          </div>

          {/* Date livraison | Date fin validité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <IL icon={Calendar} color="#059669">Date livraison</IL>
              <input type="date" name="dateLivraison" value={form.dateLivraison} onChange={hc} className={inp} />
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-gray-50 resize-none" />
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4c0519 0%, #881337 60%, #be123c 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.collaborateur}>
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
