'use client';

import { useState, useMemo } from 'react';
import {
  Plus, X, ShieldCheck, Truck, CalendarDays, Tag,
  CalendarRange, CalendarCheck, Hash, FileText,
  Timer, Building2, Users, Banknote, Paperclip,
} from 'lucide-react';
import ValidatedInput from '@/components/Forms/ValidatedInput';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  reference: '',
  vehicle: '',
  dateAssurance: '',
  typeAssurance: '',
  dateEmission: '',
  numeroAttestation: '',
  dateExpiration: '',
  numeroPolice: '',
  organisme: '',
  intermediaire: '',
  fraisTimbre: '',
  fraisContrat: '',
  notes: '',
};

import { Edit, Trash2 } from 'lucide-react';
import { useDeleteResource, useUpdateResource } from '@/hooks/useResource';

const COLUMNS = [
  { key: 'numeroPolice',  label: 'N° Police' },
  {
    key: 'vehicle',
    label: 'Véhicule',
    render: (v: any) => v ? `${v.matricule} — ${v.brand} ${v.model}` : '—',
  },
  { key: 'typeAssurance', label: 'Type' },
  { key: 'dateEmission',   label: 'Date début', render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Date fin',   render: (v: string) => formatDate(v) },
  { key: 'dureeJours',    label: 'Durée (j)' },
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
    key: 'actions', label: 'procédures',
    render: (_: any, row: any) => <ActionsCell row={row} />, 
  },
];
function ActionsCell({ row }: { row: any }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteAssurance = useDeleteResource('administratif');
  const { refetch } = useResource<any>('administratif', { type: 'assurance' });
  const [editMode, setEditMode] = useState(false);
  const [editError, setEditError] = useState('');
  const updateAssurance = useUpdateResource('administratif');
  const [editForm, setEditForm] = useState(row);

  const handleDelete = async () => {
    setEditError('');
    try {
      await deleteAssurance.mutateAsync(row._id);
      setShowConfirm(false);
      refetch();
    } catch (e: any) {
      setEditError('فشل الحذف');
    }
  };

  const handleEdit = async () => {
    setEditError('');
    try {
      await updateAssurance.mutateAsync({ id: row._id, body: editForm });
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
            <p className="mb-4">هل أنت متأكد من حذف هذه التأمين؟</p>
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
            <h3 className="font-bold mb-2">تعديل التأمين</h3>
            {editError && <div className="text-red-600 text-xs mb-2">{editError}</div>}
            <input className="input mb-2" value={editForm.numeroPolice} onChange={e => setEditForm({ ...editForm, numeroPolice: e.target.value })} />
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

export default function AssurancesPage() {
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [attachement, setAttachement] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const { data, isLoading }    = useResource<any>('administratif', { page, search, type: 'assurance' });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const create                 = useCreateResource('administratif');

  // Auto-calculate duration in days
  const dureeJours = useMemo(() => {
    if (!form.dateEmission || !form.dateExpiration) return 0;
    const diff = new Date(form.dateExpiration).getTime() - new Date(form.dateEmission).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }, [form.dateEmission, form.dateExpiration]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleClose = () => { setModalOpen(false); setForm(EMPTY_FORM); setAttachement(null); };

  const handleSubmit = async () => {
    setFieldErrors({});
    const errs: Record<string,string> = {};
    if (!form.reference.trim()) errs.reference = 'Référence requise';
    if (!form.vehicle) errs.vehicle = 'Véhicule requis';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    await create.mutateAsync({ ...form, type: 'assurance', dureeJours });
    handleClose();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assurances</h2>
          <p className="text-sm text-gray-500 mt-1">Gestion des assurances véhicules</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <SearchFilter onSearch={setSearch} placeholder="Rechercher une assurance..." filters={[]} />
      <DataTable
        columns={COLUMNS} data={data?.data || []} loading={isLoading}
        total={data?.total || 0} page={page} pages={data?.pages || 1}
        onPageChange={setPage} emptyMessage="Aucune assurance trouvée"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">

            {/* Blue gradient header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nouvelle Assurance</h3>
                  <p className="text-blue-100 text-xs">Remplissez les informations ci-dessous</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[75vh] p-6 space-y-5">

              {/* Assurance + Véhicule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ValidatedInput
                    icon={ShieldCheck} label="Assurance" required
                    name="reference" value={form.reference} onChange={handleChange}
                    placeholder="Libellé de l'assurance" className="w-full"
                    error={fieldErrors.reference}
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
              <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50/50">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Informations générales</p>

                {/* Date assurance + Type assurance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={CalendarDays} color="#2563eb">Date assurance</IconLabel>
                    <input type="date" name="dateAssurance" value={form.dateAssurance} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={Tag} color="#7c3aed">Type assurance</IconLabel>
                    <input type="text" name="typeAssurance" value={form.typeAssurance} onChange={handleChange}
                      placeholder="Ex: Tous risques, Au tiers..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>

                {/* Date début + N° Attestation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={CalendarRange} color="#16a34a">Date début</IconLabel>
                    <input type="date" name="dateEmission" value={form.dateEmission} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={Hash} color="#0891b2">Numéro attestation</IconLabel>
                    <input type="text" name="numeroAttestation" value={form.numeroAttestation} onChange={handleChange}
                      placeholder="N° attestation"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>

                {/* Date fin + N° Police */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={CalendarCheck} color="#dc2626">Date fin</IconLabel>
                    <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={FileText} color="#7c3aed">Numéro police</IconLabel>
                    <input type="text" name="numeroPolice" value={form.numeroPolice} onChange={handleChange}
                      placeholder="N° police"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>

                {/* Durée (auto) */}
                <div>
                  <IconLabel icon={Timer} color="#f59e0b">Durée</IconLabel>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm bg-blue-50 text-blue-800 font-semibold">
                      {dureeJours} Jours
                    </div>
                  </div>
                </div>

                {/* Compagnie d'assurance */}
                <div>
                  <IconLabel icon={Building2} color="#0891b2">Compagnie d'assurance</IconLabel>
                  <input type="text" name="organisme" value={form.organisme} onChange={handleChange}
                    placeholder="Nom de la compagnie"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>

                {/* Intermédiaire */}
                <div>
                  <IconLabel icon={Users} color="#64748b">Intermédiaire assurance</IconLabel>
                  <input type="text" name="intermediaire" value={form.intermediaire} onChange={handleChange}
                    placeholder="Courtier / agent"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>

                {/* Frais timbre + Frais contrat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={Banknote} color="#16a34a">Frais timbre</IconLabel>
                    <div className="relative">
                      <input type="number" name="fraisTimbre" value={form.fraisTimbre} onChange={handleChange}
                        min="0" step="0.01" placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
                    </div>
                  </div>
                  <div>
                    <IconLabel icon={Banknote} color="#dc2626">Frais contrat</IconLabel>
                    <div className="relative">
                      <input type="number" name="fraisContrat" value={form.fraisContrat} onChange={handleChange}
                        min="0" step="0.01" placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachement */}
              <div>
                <IconLabel icon={Paperclip} color="#4f46e5">Attachement</IconLabel>
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-indigo-200 rounded-lg px-4 py-3 bg-indigo-50/40 hover:bg-indigo-50 transition-colors text-sm text-gray-500">
                  <Paperclip className="w-4 h-4 text-indigo-400" />
                  {attachement ? attachement.name : 'Choisir un fichier'}
                  <input type="file" className="hidden" onChange={(e) => setAttachement(e.target.files?.[0] || null)} />
                </label>
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
