'use client';

import { useState, useMemo } from 'react';
import { ClipboardList, Plus, Trash2, RefreshCw, List, FileEdit } from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';

/* ── types ───────────────────────────────────────────── */
interface Piece { piece: string; quantite: string; unite: string }
const EMPTY_PIECE = (): Piece => ({ piece: '', quantite: '', unite: '' });

const EMPTY_FORM = {
  nom: '', frequence: '', modele: '', flotte: '', commentaire: '',
};

/* ── columns ─────────────────────────────────────────── */
const COLS = [
  { key: 'nom',       label: 'Nom' },
  { key: 'frequence', label: 'Fréquence' },
  { key: 'modele',    label: 'Modèle' },
  { key: 'flotte',    label: 'Flotte' },
  {
    key: 'pieces', label: 'Pièces',
    render: (v: any[]) => v?.length ? (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
        {v.length} pièce{v.length > 1 ? 's' : ''}
      </span>
    ) : '—',
  },
];

/* ── input helpers ──────────────────────────────────── */
const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

/* ════════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════════ */
export default function PlanEntretienPage() {
  const [view, setView]         = useState<'list' | 'form'>('list');
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState(EMPTY_FORM);
  const [pieces, setPieces]     = useState<Piece[]>([EMPTY_PIECE()]);
  const [saving, setSaving]     = useState(false);

  const params = useMemo(() => ({ page, search }), [page, search]);
  const { data, isLoading, refetch, isFetching } = useResource<any>('plan-entretien', params);
  const create = useCreateResource('plan-entretien');

  const rows: any[] = data?.data ?? [];

  const set = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }));

  /* pieces helpers */
  const addPiece    = () => setPieces(p => [...p, EMPTY_PIECE()]);
  const removePiece = (i: number) => setPieces(p => p.filter((_, idx) => idx !== i));
  const setPiece    = (i: number, field: keyof Piece, val: string) =>
    setPieces(p => p.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  const resetForm = () => { setForm(EMPTY_FORM); setPieces([EMPTY_PIECE()]); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await create.mutateAsync({
        ...form,
        pieces: pieces
          .filter(p => p.piece.trim())
          .map(p => ({ ...p, quantite: Number(p.quantite) || 1 })),
      });
      resetForm();
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#134e4a 0%,#0f766e 40%,#0d9488 70%,#14b8a6 100%)' }}
        >
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none">
            <ClipboardList className="w-28 h-28 text-white" strokeWidth={0.7} />
          </div>
          {[{x:70,y:18},{x:82,y:55},{x:88,y:30}].map((p,i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-teal-300/25 pointer-events-none"
              style={{ left:`${p.x}%`, top:`${p.y}%` }} />
          ))}

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <ClipboardList className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Plan d&apos;entretien</h2>
              <p className="text-teal-200 text-xs mt-0.5">Gestion des plans d&apos;entretien préventif</p>
            </div>
          </div>

          <div className="z-10 flex items-center gap-2">
            {view === 'list' ? (
              <button onClick={() => setView('form')}
                className="flex items-center gap-2 text-sm font-semibold text-teal-900 bg-white hover:bg-teal-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <Plus className="w-4 h-4" /> Nouveau plan
              </button>
            ) : (
              <button onClick={() => { setView('list'); resetForm(); }}
                className="flex items-center gap-2 text-sm font-semibold text-teal-900 bg-white hover:bg-teal-50 px-3 py-1.5 rounded-lg shadow transition-all">
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
          {['#134e4a','#115e59','#0f766e','#0d9488','#14b8a6','#2dd4bf'].map((c,i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ════════ LIST VIEW ════════ */}
      {view === 'list' && (
        <>
          {/* Filter */}
          <SearchFilter onSearch={setSearch} placeholder="Rechercher un plan..." filters={[]} />

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-teal-500" />
              <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider">Plans d&apos;entretien</p>
              {data?.total != null && (
                <span className="ml-auto text-xs text-gray-400">
                  {data.total} plan{data.total !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <DataTable
              columns={COLS}
              data={rows}
              loading={isLoading}
              total={data?.total || 0}
              page={page}
              pages={data?.pages || 1}
              onPageChange={setPage}
              emptyMessage="Aucun plan d'entretien trouvé"
            />
          </div>
        </>
      )}

      {/* ════════ FORM VIEW ════════ */}
      {view === 'form' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Form header strip */}
          <div className="px-5 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100 flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-teal-600" />
            <p className="text-sm font-semibold text-teal-800">Plan d&apos;entretien</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Row 1: Nom | Fréquence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nom</label>
                <input type="text" value={form.nom} onChange={e => set('nom', e.target.value)}
                  placeholder="Nom du plan" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Fréquence</label>
                <input type="text" value={form.frequence} onChange={e => set('frequence', e.target.value)}
                  placeholder="Ex: Tous les 5 000 km" className={inputCls} />
              </div>
            </div>

            {/* Row 2: Modèle | Flotte */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Modèle</label>
                <input type="text" value={form.modele} onChange={e => set('modele', e.target.value)}
                  placeholder="Modèle du véhicule" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Flotte</label>
                <input type="text" value={form.flotte} onChange={e => set('flotte', e.target.value)}
                  placeholder="Flotte concernée" className={inputCls} />
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label className={labelCls}>Commentaire</label>
              <textarea rows={3} value={form.commentaire} onChange={e => set('commentaire', e.target.value)}
                placeholder="Commentaire ou instructions spéciales..."
                className={`${inputCls} resize-none`} />
            </div>

            {/* ── Pièces ── */}
            <div className="rounded-xl border border-teal-100 bg-teal-50/40 overflow-hidden">
              <div className="px-4 py-3 border-b border-teal-100 flex items-center justify-between">
                <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">Pièces</p>
                <button type="button" onClick={addPiece}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition-all">
                  <Plus className="w-3.5 h-3.5" /> Ajout pièce
                </button>
              </div>

              {/* Pieces table */}
              <div className="p-4 space-y-2">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_120px_120px_40px] gap-2 px-1">
                  <p className="text-xs font-semibold text-gray-500">Pièce <span className="text-red-400">*</span></p>
                  <p className="text-xs font-semibold text-gray-500">Quantité <span className="text-red-400">*</span></p>
                  <p className="text-xs font-semibold text-gray-500">Unité</p>
                  <span />
                </div>

                {pieces.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_120px_120px_40px] gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={row.piece}
                      onChange={e => setPiece(i, 'piece', e.target.value)}
                      placeholder="Nom de la pièce"
                      className={inputCls}
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      value={row.quantite}
                      onChange={e => setPiece(i, 'quantite', e.target.value)}
                      placeholder="0"
                      className={inputCls}
                    />
                    <input
                      type="text"
                      value={row.unite}
                      onChange={e => setPiece(i, 'unite', e.target.value)}
                      placeholder="pcs / L / kg"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => removePiece(i)}
                      disabled={pieces.length === 1}
                      className="flex items-center justify-center w-9 h-9 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {pieces.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-3">Aucune pièce ajoutée</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => { setView('list'); resetForm(); }}
                className="px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                Annuler
              </button>
              <button type="submit" disabled={saving}
                className="px-6 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow transition-all disabled:opacity-60">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
