'use client';

import { useState, useMemo, useEffect } from 'react';
import { AxiosError } from 'axios';
import {
  Truck, List, Plus, RefreshCw, Tag, Hash, Calendar, MapPin,
  Key, FileText, Car, Gauge, Camera, MessageSquare, Building2,
  DollarSign, Percent, ShieldCheck, Palette, Clock,
  ClipboardList, CreditCard, ShoppingBag, LayoutGrid,
} from 'lucide-react';
import ValidatedInput from '@/components/Forms/ValidatedInput';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

/* ── shared field helpers ───────────────────────────── */
const input = (ring = 'focus:ring-blue-400') =>
  `w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ${ring} bg-white shadow-sm placeholder:text-gray-300 transition`;

/* coloured label with optional icon */
function FL({ icon: Icon, label, color = 'text-blue-500' }: {
  icon: React.ElementType; label: string; color?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className={`text-[11px] font-bold uppercase tracking-wide ${color}`}>{label}</span>
    </label>
  );
}

/* section card */
function Section({ icon: Icon, title, bg, border, iconBg, children }: {
  icon: React.ElementType; title: string; bg: string; border: string;
  iconBg: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border ${border} overflow-hidden shadow-sm`}>
      <div className={`${bg} px-5 py-3 flex items-center gap-2.5 border-b ${border}`}>
        <div className={`${iconBg} p-1.5 rounded-lg`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-5 space-y-4 bg-white">{children}</div>
    </div>
  );
}

const ACHAT_OPTIONS   = ['Achat', 'Leasing', 'Location', 'Don'];
const STATUS_STYLE: Record<string, string> = {
  available:   'bg-green-100 text-green-700',
  in_use:      'bg-blue-100 text-blue-700',
  maintenance: 'bg-amber-100 text-amber-700',
  retired:     'bg-red-100 text-red-700',
};

/* ── columns ─────────────────────────────────────────── */
import { Edit, Trash2 } from 'lucide-react';
import { useDeleteResource, useUpdateResource } from '@/hooks/useResource';

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
  {
    key: 'actions', label: 'إجراءات',
    render: (_: any, row: any) => <ActionsCell row={row} />,
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

function ActionsCell({ row }: { row: any }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteVehicle = useDeleteResource('vehicles');
  const { refetch } = useResource<any>('vehicles');
  const [editMode, setEditMode] = useState(false);
  const [editError, setEditError] = useState('');
  const updateVehicle = useUpdateResource('vehicles');
  const [editForm, setEditForm] = useState(row);

  const handleDelete = async () => {
    setEditError('');
    try {
      await deleteVehicle.mutateAsync(row._id);
      setShowConfirm(false);
      refetch();
    } catch (e: any) {
      setEditError('فشل الحذف');
    }
  };

  const handleEdit = async () => {
    setEditError('');
    try {
      await updateVehicle.mutateAsync({ id: row._id, body: editForm });
      setEditMode(false);
      refetch();
    } catch (e: any) {
      setEditError('فشل التعديل');
    }
  };

  return (
    <div className="flex gap-2">
      <button title="تعديل" className="text-blue-600 hover:text-blue-800" onClick={() => setEditMode(true)}>
        <Edit className="w-4 h-4" />
      </button>
      <button title="حذف" className="text-red-600 hover:text-red-800" onClick={() => setShowConfirm(true)}>
        <Trash2 className="w-4 h-4" />
      </button>
      {/* نافذة تأكيد الحذف */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[300px]">
            <p className="mb-4">هل أنت متأكد من حذف هذا المركبة؟</p>
            {editError && <div className="text-red-600 text-xs mb-2">{editError}</div>}
            <div className="flex gap-2 justify-end">
              <button className="btn" onClick={() => setShowConfirm(false)}>إلغاء</button>
              <button className="btn bg-red-600 text-white" onClick={handleDelete}>حذف</button>
            </div>
          </div>
        </div>
      )}
      {/* نافذة تعديل مبسطة */}
      {editMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[350px] max-w-[90vw]">
            <h3 className="font-bold mb-2">تعديل المركبة</h3>
            {editError && <div className="text-red-600 text-xs mb-2">{editError}</div>}
            <input className="input mb-2" value={editForm.designation} onChange={e => setEditForm({ ...editForm, designation: e.target.value })} />
            <input className="input mb-2" value={editForm.immatricule} onChange={e => setEditForm({ ...editForm, immatricule: e.target.value })} />
            {/* أضف المزيد من الحقول حسب الحاجة */}
            <div className="flex gap-2 justify-end mt-2">
              <button className="btn" onClick={() => setEditMode(false)}>إلغاء</button>
              <button className="btn bg-blue-600 text-white" onClick={handleEdit}>حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VehiculesPage() {
    // دالة مساعدة لتحديث الحقول في النموذج
    const set = (field: string, value: any) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };
  // دالة إرسال النموذج لإضافة مركبة جديدة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    try {
      await create.mutateAsync(form);
      setSuccess('تمت إضافة المركبة بنجاح');
      resetForm();
      refetch();
      setView('list');
    } catch (err: any) {
      let message = 'فشل الإضافة';
      if (err?.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      message = (err?.response?.data?.message) || err.message || message;
      setError(message);
    }
  };

  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [form, setForm]     = useState(EMPTY);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  // إصلاح: تعريف دالة resetForm
  const resetForm = () => setForm(EMPTY);

  const params = useMemo(() => ({ page }), [page]);
  const { data, isLoading, refetch, isFetching } = useResource<any>('vehicles', params);
  const rows: any[] = data?.data ?? [];
  const create = useCreateResource('vehicles');

  // ...existing code...

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
              <button onClick={() => { setView('form'); setError(''); setSuccess(''); }}
                className="flex items-center gap-2 text-sm font-semibold text-blue-900 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg shadow transition-all">
                <Plus className="w-4 h-4" /> Nouveau véhicule
              </button>
            ) : (
              <button onClick={() => { setView('list'); resetForm(); setError(''); setSuccess(''); }}
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
          {/* mini KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Truck,        label: 'Total',       value: data?.total ?? 0,   bg: 'bg-blue-50',   iconBg: 'bg-blue-500',   text: 'text-blue-700' },
              { icon: Car,          label: 'Disponibles', value: 0,                  bg: 'bg-green-50',  iconBg: 'bg-green-500',  text: 'text-green-700' },
              { icon: ClipboardList,label: 'En service',  value: 0,                  bg: 'bg-amber-50',  iconBg: 'bg-amber-500',  text: 'text-amber-700' },
              { icon: ShieldCheck,  label: 'En maintenance',value: 0,               bg: 'bg-red-50',    iconBg: 'bg-red-500',    text: 'text-red-700' },
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

          {/* تم حذف البحث بناءً على طلبك */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-white/80" />
              <p className="text-xs font-bold text-white uppercase tracking-widest">Flotte véhicules</p>
              {data?.total != null && (
                <span className="ml-auto text-xs text-blue-200 font-semibold">{data.total} véhicule{data.total !== 1 ? 's' : ''}</span>
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
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* ── Section: Identification ── */}
          <Section
            icon={Car} title="Identification du véhicule"
            bg="bg-gradient-to-r from-blue-50 to-indigo-50"
            border="border-blue-200" iconBg="bg-blue-600"
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ValidatedInput
                icon={Tag} label="Désignation" required
                value={form.designation}
                onChange={e => set('designation', e.target.value)}
                placeholder="Désignation du véhicule"
                error={fieldErrors.designation}
              />
              <ValidatedInput
                icon={CreditCard} label="Immatricule" required
                value={form.immatricule}
                onChange={e => set('immatricule', e.target.value)}
                placeholder="AB-123-CD"
                error={fieldErrors.immatricule}
              />
              <div>
                <FL icon={ShoppingBag} label="Type d'acquisition" color="text-indigo-600" />
                <select value={form.typeAcquisition} onChange={e => set('typeAcquisition', e.target.value)}
                  className={input('focus:ring-indigo-400')}>
                  <option value="">— Choisir —</option>
                  {ACHAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <FL icon={FileText} label="Nom" color="text-blue-600" />
                <input type="text" value={form.nom} onChange={e => set('nom', e.target.value)}
                  placeholder="Nom" className={input('focus:ring-blue-400')} />
              </div>
              <div>
                <FL icon={Calendar} label="Date mise en circulation" color="text-violet-600" />
                <input type="date" value={form.dateMiseEnCirculation} onChange={e => set('dateMiseEnCirculation', e.target.value)}
                  className={input('focus:ring-violet-400')} />
              </div>
              <div>
                <FL icon={Hash} label="Code" color="text-blue-600" />
                <input type="text" value={form.code} onChange={e => set('code', e.target.value)}
                  placeholder="Code" className={input('focus:ring-blue-400')} />
              </div>
              <div>
                <FL icon={MapPin} label="Centre de coût" color="text-cyan-600" />
                <input type="text" value={form.centreCout} onChange={e => set('centreCout', e.target.value)}
                  placeholder="Centre de coût" className={input('focus:ring-cyan-400')} />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <FL icon={Hash} label="Numéro d'ordre" color="text-blue-600" />
                <input type="text" value={form.numeroOrdre} onChange={e => set('numeroOrdre', e.target.value)}
                  placeholder="N° d'ordre" className={input('focus:ring-blue-400')} />
              </div>
              <div>
                <FL icon={ClipboardList} label="Carte grise" color="text-teal-600" />
                <input type="text" value={form.carteGrise} onChange={e => set('carteGrise', e.target.value)}
                  placeholder="N° carte grise" className={input('focus:ring-teal-400')} />
              </div>
              <div>
                <FL icon={ShieldCheck} label="N° de châssis" color="text-indigo-600" />
                <input type="text" value={form.numeroChassis} onChange={e => set('numeroChassis', e.target.value)}
                  placeholder="VIN / châssis" className={input('focus:ring-indigo-400')} />
              </div>
              <div>
                <FL icon={Hash} label="Numéro W" color="text-blue-600" />
                <input type="text" value={form.numeroW} onChange={e => set('numeroW', e.target.value)}
                  placeholder="Numéro W" className={input('focus:ring-blue-400')} />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <FL icon={Palette} label="Couleur" color="text-pink-600" />
                <input type="text" value={form.couleur} onChange={e => set('couleur', e.target.value)}
                  placeholder="Ex: Blanc" className={input('focus:ring-pink-400')} />
              </div>
              <div>
                <FL icon={Key} label="Code clé" color="text-amber-600" />
                <input type="text" value={form.codeCle} onChange={e => set('codeCle', e.target.value)}
                  placeholder="Code clé" className={input('focus:ring-amber-400')} />
              </div>
              <div>
                <FL icon={Calendar} label="Date prévue de restitution" color="text-rose-600" />
                <input type="date" value={form.datePrevueRestitution} onChange={e => set('datePrevueRestitution', e.target.value)}
                  className={input('focus:ring-rose-400')} />
              </div>
              <div>
                <FL icon={Car} label="Modèle" color="text-blue-600" />
                <input type="text" value={form.modele} onChange={e => set('modele', e.target.value)}
                  placeholder="Marque / Modèle" className={input('focus:ring-blue-400')} />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={Gauge} label="Kilométrage initial" color="text-orange-600" />
                <div className="relative">
                  <input type="number" min="0" value={form.kilometrageInitial} onChange={e => set('kilometrageInitial', e.target.value)}
                    placeholder="0" className={`${input('focus:ring-orange-400')} pr-12`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-orange-500">Km</span>
                </div>
              </div>
              <div>
                <FL icon={Clock} label="Indexe horaire initial" color="text-violet-600" />
                <div className="relative">
                  <input type="number" min="0" value={form.indexeHoraireInitial} onChange={e => set('indexeHoraireInitial', e.target.value)}
                    placeholder="0" className={`${input('focus:ring-violet-400')} pr-8`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-violet-500">H</span>
                </div>
              </div>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={Camera} label="Photo principale (URL)" color="text-sky-600" />
                <input type="url" value={form.photoUrl} onChange={e => set('photoUrl', e.target.value)}
                  placeholder="https://..." className={input('focus:ring-sky-400')} />
              </div>
              <div>
                <FL icon={MessageSquare} label="Commentaire" color="text-gray-500" />
                <textarea rows={2} value={form.commentaire} onChange={e => set('commentaire', e.target.value)}
                  placeholder="Remarques..." className={`${input('focus:ring-gray-400')} resize-none`} />
              </div>
            </div>
          </Section>

          {/* ── Section: Acquisition achat ── */}
          <Section
            icon={ShoppingBag} title="Acquisition / Achat"
            bg="bg-gradient-to-r from-emerald-50 to-teal-50"
            border="border-emerald-200" iconBg="bg-emerald-600"
          >
            <div>
              <FL icon={Building2} label="Concessionnaire" color="text-emerald-700" />
              <input type="text" value={form.concessionnaire} onChange={e => set('concessionnaire', e.target.value)}
                placeholder="Nom du concessionnaire" className={input('focus:ring-emerald-400')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FL icon={Calendar} label="Date d'achat" color="text-emerald-700" />
                <input type="date" value={form.dateAchat} onChange={e => set('dateAchat', e.target.value)}
                  className={input('focus:ring-emerald-400')} />
              </div>
              <div>
                <FL icon={Hash} label="Numéro contrat" color="text-teal-700" />
                <input type="text" value={form.numeroContrat} onChange={e => set('numeroContrat', e.target.value)}
                  placeholder="N° contrat" className={input('focus:ring-teal-400')} />
              </div>
              <div>
                <FL icon={ShieldCheck} label="Garantie" color="text-cyan-700" />
                <input type="text" value={form.garantie} onChange={e => set('garantie', e.target.value)}
                  placeholder="Ex: 3 ans / 100 000 km" className={input('focus:ring-cyan-400')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FL icon={DollarSign} label="Montant HT" color="text-green-700" />
                <div className="relative">
                  <input type="number" min="0" step="0.01" value={form.montantHT} onChange={e => set('montantHT', e.target.value)}
                    placeholder="0.00" className={`${input('focus:ring-green-400')} pr-10`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-green-600">DH</span>
                </div>
              </div>
              <div>
                <FL icon={Percent} label="TVA" color="text-teal-700" />
                <div className="relative">
                  <input type="number" min="0" max="100" step="0.01" value={form.tva} onChange={e => set('tva', e.target.value)}
                    placeholder="20" className={`${input('focus:ring-teal-400')} pr-8`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-teal-600">%</span>
                </div>
              </div>
            </div>
          </Section>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => { setView('list'); resetForm(); }}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
              Annuler
            </button>
            <button type="submit" disabled={create.isPending}
              className="px-7 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
              {create.isPending ? 'Enregistrement...' : '✓ Enregistrer le véhicule'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
