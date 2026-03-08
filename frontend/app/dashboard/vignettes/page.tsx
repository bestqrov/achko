'use client';

import { useState, useMemo } from 'react';
import {
  Plus, Paperclip, X, Hash, Truck, CalendarRange, CalendarCheck,
  Banknote, AlertCircle, TrendingUp, ConciergeBell, Stamp, Percent,
  Calculator, MessageSquare,
} from 'lucide-react';
import ValidatedInput from '@/components/Forms/ValidatedInput';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  reference: '',
  vehicle: '',
  dateEmission: '',
  dateExpiration: '',
  montantPrincipal: '',
  penalite: '',
  majoration: '',
  fraisService: '',
  timbre: '',
  tvaFraisService: '',
  notes: '',
};

import { Edit, Trash2 } from 'lucide-react';
import { useDeleteResource, useUpdateResource } from '@/hooks/useResource';

const COLUMNS = [
  { key: 'reference', label: 'Vignette' },
  {
    key: 'vehicle',
    label: 'Véhicule',
    render: (v: any) => v ? `${v.matricule} — ${v.brand} ${v.model}` : '—',
  },
  { key: 'dateEmission',   label: 'Date début',    render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Date fin',       render: (v: string) => formatDate(v) },
  { key: 'montant',        label: 'Montant Total',  render: (v: number) => v != null ? `${Number(v).toFixed(2)} DH` : '—' },
  {
    key: 'statut',
    label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>
        {v}
      </span>
    ),
  },
  {
    key: 'actions', label: 'إجراءات',
    render: (_: any, row: any) => <ActionsCell row={row} />,
  },
];
function ActionsCell({ row }: { row: any }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteVignette = useDeleteResource('administratif');
  const { refetch } = useResource<any>('administratif', { type: 'vignette' });
  const [editMode, setEditMode] = useState(false);
  const [editError, setEditError] = useState('');
  const updateVignette = useUpdateResource('administratif');
  const [editForm, setEditForm] = useState(row);

  const handleDelete = async () => {
    setEditError('');
    try {
      await deleteVignette.mutateAsync(row._id);
      setShowConfirm(false);
      refetch();
    } catch (e: any) {
      setEditError('فشل الحذف');
    }
  };

  const handleEdit = async () => {
    setEditError('');
    try {
      await updateVignette.mutateAsync({ id: row._id, body: editForm });
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
            <p className="mb-4">هل أنت متأكد من حذف هذه الفينيت؟</p>
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
            <h3 className="font-bold mb-2">تعديل الفينيت</h3>
            {editError && <div className="text-red-600 text-xs mb-2">{editError}</div>}
            <input className="input mb-2" value={editForm.reference} onChange={e => setEditForm({ ...editForm, reference: e.target.value })} />
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

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

function AmountField({
  label, icon: Icon, iconColor, name, value, onChange,
}: {
  label: string; icon: React.ElementType; iconColor: string;
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <IconLabel icon={Icon} color={iconColor}>{label}</IconLabel>
      <div className="relative">
        <input
          type="number" min="0" step="0.01" name={name} value={value}
          onChange={onChange} placeholder="0.00"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">DH</span>
      </div>
    </div>
  );
}

export default function VignettesPage() {
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [attachement, setAttachement] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const { data, isLoading, refetch }        = useResource<any>('administratif', { page, search, type: 'vignette' });
  const { data: vehiclesData }     = useResource<any>('vehicles', { limit: 200 });
  const create                     = useCreateResource('administratif');

  const total = useMemo(() =>
    ['montantPrincipal', 'penalite', 'majoration', 'fraisService', 'timbre', 'tvaFraisService']
      .reduce((sum, k) => sum + (parseFloat((form as any)[k]) || 0), 0),
  [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleClose = () => { setModalOpen(false); setForm(EMPTY_FORM); setAttachement(null); };

  const handleSubmit = async () => {
    setFieldErrors({});
    const errs: Record<string,string> = {};
    if (!form.reference.trim()) errs.reference = 'Référence requise';
    if (!form.vehicle) errs.vehicle = 'Véhicule requis';
    if (!form.dateEmission) errs.dateEmission = 'Date début requise';
    if (!form.dateExpiration) errs.dateExpiration = 'Date fin requise';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    await create.mutateAsync({
      ...form, type: 'vignette', montant: total,
      montantPrincipal: parseFloat(form.montantPrincipal) || 0,
      penalite:         parseFloat(form.penalite)         || 0,
      majoration:       parseFloat(form.majoration)       || 0,
      fraisService:     parseFloat(form.fraisService)     || 0,
      timbre:           parseFloat(form.timbre)           || 0,
      tvaFraisService:  parseFloat(form.tvaFraisService)  || 0,
    });
    refetch(); // تحديث القائمة بعد الإضافة
    handleClose();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vignettes</h2>
          <p className="text-sm text-gray-500 mt-1">Historique et gestion des vignettes fiscales</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <SearchFilter onSearch={setSearch} placeholder="Rechercher une vignette..." filters={[]} />
      <DataTable
        columns={COLUMNS} data={data?.data || []} loading={isLoading}
        total={data?.total || 0} page={page} pages={data?.pages || 1}
        onPageChange={setPage} emptyMessage="Aucune vignette trouvée"
      />

      {/* ── Custom Modal with blue header ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

            {/* Blue gradient header */}
            <div className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Nouvelle Vignette</h3>
                  <p className="text-blue-100 text-xs">Remplissez les informations ci-dessous</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1">

              {/* Vignette + Véhicule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ValidatedInput
                    icon={Hash} label="Vignette" required
                    name="reference" value={form.reference} onChange={handleChange}
                    placeholder="Numéro / référence"
                    className="w-full" error={fieldErrors.reference}
                  />
                </div>
                <div>
                  <div>
                    <IconLabel icon={Truck} color="#0891b2">Véhicule</IconLabel>
                    <select name="vehicle" value={form.vehicle} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                      <option value="">— Sélectionner —</option>
                      {(vehiclesData?.data || []).map((v: any) => (
                        <option key={v._id} value={v._id}>{v.matricule} — {v.brand} {v.model}</option>
                      ))}
                    </select>
                    {fieldErrors.vehicle && <p className="text-red-600 text-xs mt-1">{fieldErrors.vehicle}</p>}
                  </div>
                </div>
              </div>

              {/* Informations générales */}
              <div>
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3 pb-1 border-b border-blue-100">
                  Informations générales
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={CalendarRange} color="#16a34a">Date début</IconLabel>
                    <input type="date" name="dateEmission" value={form.dateEmission} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                  </div>
                  <div>
                    <IconLabel icon={CalendarCheck} color="#dc2626">Date fin</IconLabel>
                    <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                  </div>
                </div>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AmountField label="Montant principal" icon={Banknote}       iconColor="#16a34a" name="montantPrincipal" value={form.montantPrincipal} onChange={handleChange} />
                <AmountField label="Pénalité"          icon={AlertCircle}    iconColor="#dc2626" name="penalite"         value={form.penalite}         onChange={handleChange} />
                <AmountField label="Majoration"        icon={TrendingUp}     iconColor="#ea580c" name="majoration"       value={form.majoration}       onChange={handleChange} />
                <AmountField label="Frais service"     icon={ConciergeBell}  iconColor="#7c3aed" name="fraisService"     value={form.fraisService}     onChange={handleChange} />
                <AmountField label="Timbre"            icon={Stamp}          iconColor="#0891b2" name="timbre"           value={form.timbre}           onChange={handleChange} />
                <AmountField label="TVA frais service" icon={Percent}        iconColor="#d97706" name="tvaFraisService"  value={form.tvaFraisService}  onChange={handleChange} />
              </div>

              {/* Total */}
              <div className="rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)' }}>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Montant Total</span>
                </div>
                <span className="text-xl font-bold text-blue-700">{total.toFixed(2)} DH</span>
              </div>

              {/* Attachement */}
              <div>
                <IconLabel icon={Paperclip} color="#6366f1">Attachement</IconLabel>
                <label className="flex items-center gap-2 cursor-pointer w-fit border border-dashed border-indigo-300 rounded-lg px-4 py-2 text-sm text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <Paperclip className="w-4 h-4" />
                  {attachement ? attachement.name : 'Choisir un fichier'}
                  <input type="file" className="hidden" onChange={(e) => setAttachement(e.target.files?.[0] || null)} />
                </label>
              </div>

              {/* Commentaire */}
              <div>
                <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  placeholder="Remarques..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button className="btn-secondary" onClick={handleClose}>Annuler</button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={create.isPending || !form.reference || !form.vehicle}
              >
                {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

