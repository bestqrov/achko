'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, FileText, Hash, Tag, Calendar, Clock,
  Timer, User, Paperclip, MessageSquare, Briefcase,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'contrat',
  numero: '',
  collaborateur: '',
  typeContrat: '',
  poste: '',
  dateEntree: '',
  dateEmbauche: '',
  dateDebut: '',
  dateFinPrevue: '',
  dureePrevueMois: '',
  dateFinReelle: '',
  dureeReelleMois: '',
  periodeEssaiMois: '',
  nombreHeuresTravail: '',
  attachement: '',
  commentaire: '',
};

import { Edit, Trash2 } from 'lucide-react';
import { useDeleteResource, useUpdateResource } from '@/hooks/useResource';

const LIST_COLUMNS = [
  { key: 'numero',        label: 'Numéro' },
  { key: 'collaborateur', label: 'Collaborateur' },
  { key: 'typeContrat',   label: 'Type contrat' },
  { key: 'dateDebut',     label: 'Date entrée', render: (v: string) => formatDate(v) },
  { key: 'dateFinPrevue', label: 'Fin prévue',  render: (v: string) => formatDate(v) },
  {
    key: 'statut', label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>{v}</span>
    ),
  },
  {
    key: 'actions', label: 'إجراءات',
    render: (_: any, row: any) => <ActionsCell row={row} />,
  },
];
function ActionsCell({ row }: { row: any }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteContrat = useDeleteResource('gestion');
  const { refetch } = useResource<any>('gestion', { type: 'contrat' });
  const [editMode, setEditMode] = useState(false);
  const [editError, setEditError] = useState('');
  const updateContrat = useUpdateResource('gestion');
  const [editForm, setEditForm] = useState(row);

  const handleDelete = async () => {
    setEditError('');
    try {
      await deleteContrat.mutateAsync(row._id);
      setShowConfirm(false);
      refetch();
    } catch (e: any) {
      setEditError('فشل الحذف');
    }
  };

  const handleEdit = async () => {
    setEditError('');
    try {
      await updateContrat.mutateAsync({ id: row._id, body: editForm });
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
            <p className="mb-4">هل أنت متأكد من حذف هذا العقد؟</p>
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
            <h3 className="font-bold mb-2">تعديل العقد</h3>
            {editError && <div className="text-red-600 text-xs mb-2">{editError}</div>}
            <input className="input mb-2" value={editForm.numero} onChange={e => setEditForm({ ...editForm, numero: e.target.value })} />
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

export default function ContratsPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'contrat' });
  const create              = useCreateResource('gestion');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync(form);
    handleCancel();
  };

  /* ── LIST VIEW ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contrats</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion des contrats de travail</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #10b981 100%)' }}
          >
            <Plus className="w-4 h-4" /> Nouveau Contrat
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un contrat..." filters={[]} />
        <DataTable
          columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucun contrat trouvé"
        />
      </div>
    );
  }

  /* ── FORM VIEW ── */
  return (
    <div className="space-y-6">
      {/* Emerald gradient header */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 40%, #059669 70%, #10b981 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouveau Contrat</h3>
              <p className="text-emerald-100 text-xs">Remplissez les informations ci-dessous</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>

      {/* Collaborateur */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Collaborateur</p>
        <div>
          <IconLabel icon={User} color="#047857">Collaborateur</IconLabel>
          <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange}
            placeholder="Nom du collaborateur"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Informations générales</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Hash} color="#059669">Numéro</IconLabel>
            <input type="text" name="numero" value={form.numero} onChange={handleChange}
              placeholder="Numéro de contrat"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Tag} color="#d97706">Type contrat</IconLabel>
            <select name="typeContrat" value={form.typeContrat} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
              <option value="">— Sélectionner —</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="interim">Intérim</option>
              <option value="stage">Stage</option>
            </select>
          </div>
        </div>

        {/* Dates row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#2563eb">Date entrée</IconLabel>
            <input type="date" name="dateEntree" value={form.dateEntree} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#7c3aed">Date embauche</IconLabel>
            <input type="date" name="dateEmbauche" value={form.dateEmbauche} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
        </div>

        {/* Date fin prévue + durée prévue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#16a34a">Date fin prévue</IconLabel>
            <input type="date" name="dateFinPrevue" value={form.dateFinPrevue} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Timer} color="#059669">Durée prévue (Mois)</IconLabel>
            <input type="number" name="dureePrevueMois" value={form.dureePrevueMois} onChange={handleChange}
              min="0" placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
        </div>

        {/* Date fin réelle + durée réelle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#dc2626">Date fin réelle</IconLabel>
            <input type="date" name="dateFinReelle" value={form.dateFinReelle} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Timer} color="#d97706">Durée réelle (Mois)</IconLabel>
            <input type="number" name="dureeReelleMois" value={form.dureeReelleMois} onChange={handleChange}
              min="0" placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
        </div>

        {/* Période essai + heures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Clock} color="#0891b2">Période d'essai (Mois)</IconLabel>
            <input type="number" name="periodeEssaiMois" value={form.periodeEssaiMois} onChange={handleChange}
              min="0" placeholder="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Clock} color="#64748b">Nombre heures de travail</IconLabel>
            <input type="number" name="nombreHeuresTravail" value={form.nombreHeuresTravail} onChange={handleChange}
              min="0" placeholder="Ex: 208"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
        </div>

        {/* Attachement */}
        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange}
            placeholder="Lien ou référence du document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
        </div>

        {/* Commentaire */}
        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={4}
            placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !form.collaborateur || !form.typeContrat}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
