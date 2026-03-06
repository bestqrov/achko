'use client';

import { useState, useMemo } from 'react';
import { Truck, List, Plus, RefreshCw } from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

/* ── helpers ─────────────────────────────────────────── */
const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';
const sectionCls = 'rounded-xl border border-blue-100 bg-blue-50/30 overflow-hidden';
const sectionHdr = 'px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100';

const ACHAT_OPTIONS   = ['Achat', 'Leasing', 'Location', 'Don'];
const STATUS_STYLE: Record<string, string> = {
  available:   'bg-green-100 text-green-700',
  in_use:      'bg-blue-100 text-blue-700',
  maintenance: 'bg-amber-100 text-amber-700',
  retired:     'bg-red-100 text-red-700',
};

/* ── columns ─────────────────────────────────────────── */
const COLS = [
  { key: 'designation',  label: 'Désignation' },
  { key: 'immatricule',  label: 'Immatricule', render: (v: any, row: any) => v || row.matricule || '—' },
  { key: 'modele',       label: 'Modèle',      render: (v: any, row: any) => v || row.model || '—' },
  { key: 'typeAcquisition', label: 'Acquisition' },
  { key: 'couleur',      label: 'Couleur',     render: (v: any, row: any) => v || row.color || '—' },
  { key: 'dateMiseEnCirculation', label: 'Mise en circ.', render: (v: any) => formatDate(v) },
  {
    key: 'status', label: 'Statut',
    render: (v: any) => v
      ? <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[v] ?? 'bg-gray-100 text-gray-600'}`}>{v}</span>
      : '—',
  },
];

/* ── empty form ──────────────────────────────────────── */
const EMPTY = {
  designation: '', immatricule: '', typeAcquisition: '',
  nom: '', dateMiseEnCirculation: '', code: '', centreCout: '',
  numeroOrdre: '', carteGrise: '', numeroChassis: '', numeroW: '',
  couleur: '', codeCle: '', datePrevueRestitution: '',
  kilometrageInitial: '', indexeHoraireInitial: '',
  photoUrl: '', commentaire: '', modele: '',
  concessionnaire: '', dateAchat: '', numeroContrat: '',
  garantie: '', montantHT: '', tva: '20',
};

/* ════════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════════ */
export default function VehiculesPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const params = useMemo(() => ({ page, search }), [page, search]);
  const { data, isLoading, refetch, isFetching } = useResource<any>('vehicles', params);
  const create = useCreateResource('vehicles');
  const rows: any[] = data?.data ?? [];

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
  const resetForm = () => setForm(EMPTY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await create.mutateAsync({
        ...form,
        kilometrageInitial:   form.kilometrageInitial   ? Number(form.kilometrageInitial)   : 0,
        indexeHoraireInitial: form.indexeHoraireInitial ? Number(form.indexeHoraireInitial) : 0,
        montantHT: form.montantHT ? Number(form.montantHT) : 0,
        tva:       form.tva       ? Number(form.tva)       : 20,
        matricule:     form.immatricule,
        model:         form.modele,
        color:         form.couleur,
        chassisNumber: form.numeroChassis,
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
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1e3a5f 0%,#1d4ed8 45%,#2563eb 70%,#3b82f6 100%)' }}>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none select-none">
            <Truck className="w-28 h-28 text-white" strokeWidth={0.7} />
          </div>
          {[{x:70,y:18},{x:82,y:55},{x:88,y:30}].map((p,i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-blue-300/25 pointer-events-none"
              style={{ left:`${p.x}%`, top:`${p.y}%` }} />
          ))}

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <Truck className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Véhicules</h2>
              <p className="text-blue-200 text-xs mt-0.5">Gestion de la flotte véhicules</p>
            </div>
          </div>

          <div className="z-10 flex items-center gap-2">
            {view === 'list' ? (
              <button onClick={() => setView('form')}
                className="flex items-center gap-2 text-sm font-semibold text-blue-900 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <Plus className="w-4 h-4" /> Nouveau véhicule
              </button>
            ) : (
              <button onClick={() => { setView('list'); resetForm(); }}
                className="flex items-center gap-2 text-sm font-semibold text-blue-900 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg shadow transition-all">
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
          {['#1e3a5f','#1e40af','#1d4ed8','#2563eb','#3b82f6','#60a5fa'].map((c,i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ════════ LIST VIEW ════════ */}
      {view === 'list' && (
        <>
          <SearchFilter onSearch={setSearch} placeholder="Rechercher un véhicule..." filters={[]} />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-blue-500" />
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Flotte véhicules</p>
              {data?.total != null && (
                <span className="ml-auto text-xs text-gray-400">{data.total} véhicule{data.total !== 1 ? 's' : ''}</span>
              )}
            </div>
            <DataTable
              columns={COLS} data={rows} loading={isLoading}
              total={data?.total || 0} page={page} pages={data?.pages || 1}
              onPageChange={setPage} emptyMessage="Aucun véhicule trouvé"
            />
          </div>
        </>
      )}

      {/* ════════ FORM VIEW ════════ */}
      {view === 'form' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-semibold text-blue-800">Véhicule</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* ── Section: Identification ── */}
            <div className={sectionCls}>
              <div className={sectionHdr}>
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Identification</p>
              </div>
              <div className="p-4 space-y-4">

                {/* Row 1: Désignation | Immatricule | Type d'acquisition */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Désignation</label>
                    <input type="text" value={form.designation} onChange={e => set('designation', e.target.value)}
                      placeholder="Désignation" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Immatricule</label>
                    <input type="text" value={form.immatricule} onChange={e => set('immatricule', e.target.value)}
                      placeholder="AB-123-CD" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Type d&apos;acquisition</label>
                    <select value={form.typeAcquisition} onChange={e => set('typeAcquisition', e.target.value)}
                      className={inputCls}>
                      <option value="">—</option>
                      {ACHAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Nom | Date mise en circulation | Code | Centre de coût */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className={labelCls}>Nom</label>
                    <input type="text" value={form.nom} onChange={e => set('nom', e.target.value)}
                      placeholder="Nom" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Date mise en circulation</label>
                    <input type="date" value={form.dateMiseEnCirculation} onChange={e => set('dateMiseEnCirculation', e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Code</label>
                    <input type="text" value={form.code} onChange={e => set('code', e.target.value)}
                      placeholder="Code" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Centre de coût</label>
                    <input type="text" value={form.centreCout} onChange={e => set('centreCout', e.target.value)}
                      placeholder="Centre de coût" className={inputCls} />
                  </div>
                </div>

                {/* Row 3: Numéro d'ordre | Carte grise | N° de châssis | Numéro W */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className={labelCls}>Numéro d&apos;ordre</label>
                    <input type="text" value={form.numeroOrdre} onChange={e => set('numeroOrdre', e.target.value)}
                      placeholder="N° d'ordre" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Carte grise</label>
                    <input type="text" value={form.carteGrise} onChange={e => set('carteGrise', e.target.value)}
                      placeholder="N° carte grise" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>N° de châssis</label>
                    <input type="text" value={form.numeroChassis} onChange={e => set('numeroChassis', e.target.value)}
                      placeholder="VIN / châssis" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Numéro W</label>
                    <input type="text" value={form.numeroW} onChange={e => set('numeroW', e.target.value)}
                      placeholder="Numéro W" className={inputCls} />
                  </div>
                </div>

                {/* Row 4: Couleur | Code clé | Date prévue de restitution | Modèle */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className={labelCls}>Couleur</label>
                    <input type="text" value={form.couleur} onChange={e => set('couleur', e.target.value)}
                      placeholder="Couleur" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Code clé</label>
                    <input type="text" value={form.codeCle} onChange={e => set('codeCle', e.target.value)}
                      placeholder="Code clé" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Date prévue de restitution</label>
                    <input type="date" value={form.datePrevueRestitution} onChange={e => set('datePrevueRestitution', e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Modèle</label>
                    <input type="text" value={form.modele} onChange={e => set('modele', e.target.value)}
                      placeholder="Marque / Modèle" className={inputCls} />
                  </div>
                </div>

                {/* Row 5: Kilométrage initial | Indexe horaire initial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Kilométrage initial</label>
                    <div className="relative">
                      <input type="number" min="0" value={form.kilometrageInitial} onChange={e => set('kilometrageInitial', e.target.value)}
                        placeholder="0" className={`${inputCls} pr-12`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">Km</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Indexe horaire initial</label>
                    <div className="relative">
                      <input type="number" min="0" value={form.indexeHoraireInitial} onChange={e => set('indexeHoraireInitial', e.target.value)}
                        placeholder="0" className={`${inputCls} pr-8`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">H</span>
                    </div>
                  </div>
                </div>

                {/* Row 6: Photo principale | Commentaire */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Photo principale</label>
                    <input type="url" value={form.photoUrl} onChange={e => set('photoUrl', e.target.value)}
                      placeholder="URL de la photo" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Commentaire</label>
                    <textarea rows={2} value={form.commentaire} onChange={e => set('commentaire', e.target.value)}
                      placeholder="Commentaire..." className={`${inputCls} resize-none`} />
                  </div>
                </div>

              </div>
            </div>

            {/* ── Section: Acquisition achat ── */}
            <div className={sectionCls}>
              <div className={sectionHdr}>
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Acquisition achat</p>
              </div>
              <div className="p-4 space-y-4">

                {/* Concessionnaire */}
                <div>
                  <label className={labelCls}>Concessionnaire</label>
                  <input type="text" value={form.concessionnaire} onChange={e => set('concessionnaire', e.target.value)}
                    placeholder="Nom du concessionnaire" className={inputCls} />
                </div>

                {/* Row: Date d'achat | Numéro contrat | Garantie */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Date d&apos;achat</label>
                    <input type="date" value={form.dateAchat} onChange={e => set('dateAchat', e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Numéro contrat</label>
                    <input type="text" value={form.numeroContrat} onChange={e => set('numeroContrat', e.target.value)}
                      placeholder="N° contrat" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Garantie</label>
                    <input type="text" value={form.garantie} onChange={e => set('garantie', e.target.value)}
                      placeholder="Ex: 3 ans / 100 000 km" className={inputCls} />
                  </div>
                </div>

                {/* Row: Montant HT | TVA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Montant HT</label>
                    <div className="relative">
                      <input type="number" min="0" step="0.01" value={form.montantHT} onChange={e => set('montantHT', e.target.value)}
                        placeholder="0.00" className={`${inputCls} pr-10`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">DH</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>TVA</label>
                    <div className="relative">
                      <input type="number" min="0" max="100" step="0.01" value={form.tva} onChange={e => set('tva', e.target.value)}
                        placeholder="20" className={`${inputCls} pr-8`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => { setView('list'); resetForm(); }}
                className="px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                Annuler
              </button>
              <button type="submit" disabled={saving}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition-all disabled:opacity-60">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
