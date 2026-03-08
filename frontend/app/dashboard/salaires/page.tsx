'use client';

import { useState } from 'react';
import {
  Plus, ArrowLeft, User, Calendar, Banknote,
  Paperclip, MessageSquare, Wallet,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, formatCurrency, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  type: 'salaire',
  collaborateur: '',
  dateDebut: '',
  dateFin: '',
  salaireBrut: '',
  salaireNet: '',
  prime: '',
  indemnitéTransport: '',
  primeAnciennete: '',
  attachement: '',
  commentaire: '',
};

type Col = { key: string; label: string; render?: (v: any) => React.ReactNode };
const LIST_COLUMNS: Col[] = [
  { key: 'collaborateur', label: 'Collaborateur' },
  { key: 'dateDebut',     label: 'Date début',  render: (v: string) => formatDate(v) },
  { key: 'dateFin',       label: 'Date fin',    render: (v: string) => formatDate(v) },
  { key: 'salaireBrut',   label: 'Brut',        render: (v: number) => formatCurrency(v) },
  { key: 'salaireNet',    label: 'Net',         render: (v: number) => formatCurrency(v) },
  {
    key: 'statut', label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>{v}</span>
    ),
  },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

function AmountField({ name, label, value, onChange, required }: {
  name: string; label: string; value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>; required?: boolean;
}) {
  return (
    <div>
      <IconLabel icon={Banknote} color="#d97706">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</IconLabel>
      <div className="relative">
        <input type="number" name={name} value={value} onChange={onChange}
          min="0" step="0.01" placeholder="0.00"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">DH</span>
      </div>
    </div>
  );
}

export default function SalairesPage() {
  const [view, setView]     = useState<'list' | 'form'>('list');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState(EMPTY_FORM);

  const { data, isLoading } = useResource<any>('gestion', { page, search, type: 'salaire' });
  const create              = useCreateResource('gestion');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('list'); };

  const handleSubmit = async () => {
    await create.mutateAsync(form);
    handleCancel();
  };

  const canSubmit = form.collaborateur && form.dateDebut && form.dateFin && form.salaireBrut && form.salaireNet;

  /* ── LIST VIEW ── */
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Salaires</h2>
            <p className="text-sm text-gray-500 mt-1">Gestion de la paie mensuelle</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #881337 0%, #be123c 60%, #f43f5e 100%)' }}
          >
            <Plus className="w-4 h-4" /> Nouvelle Fiche de Paie
          </button>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher..." filters={[]} />
        <DataTable
          columns={LIST_COLUMNS} data={data?.data || []} loading={isLoading}
          total={data?.total || 0} page={page} pages={data?.pages || 1}
          onPageChange={setPage} emptyMessage="Aucune fiche de paie trouvée"
        />
      </div>
    );
  }

  /* ── FORM VIEW ── */
  return (
    <div className="space-y-6">
      {/* Rose gradient header */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ background: 'linear-gradient(135deg, #881337 0%, #be123c 40%, #e11d48 70%, #f43f5e 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Nouvelle Fiche de Paie</h3>
              <p className="text-rose-100 text-xs">Remplissez les informations ci-dessous</p>
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
        <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Collaborateur</p>
        <div>
          <IconLabel icon={User} color="#be123c">
            Collaborateur <span className="text-red-500 ml-0.5">*</span>
          </IconLabel>
          <input type="text" name="collaborateur" value={form.collaborateur} onChange={handleChange}
            placeholder="Nom du collaborateur"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50" />
        </div>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Informations générales</p>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <IconLabel icon={Calendar} color="#2563eb">
              Date début <span className="text-red-500 ml-0.5">*</span>
            </IconLabel>
            <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50" />
          </div>
          <div>
            <IconLabel icon={Calendar} color="#dc2626">
              Date fin <span className="text-red-500 ml-0.5">*</span>
            </IconLabel>
            <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50" />
          </div>
        </div>

        {/* Salaires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AmountField name="salaireBrut"  label="Salaire brut"  value={form.salaireBrut}  onChange={handleChange} required />
          <AmountField name="salaireNet"   label="Salaire net"   value={form.salaireNet}   onChange={handleChange} required />
        </div>

        {/* Primes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AmountField name="prime"               label="Prime"               value={form.prime}               onChange={handleChange} />
          <AmountField name="indemnitéTransport"  label="Indemnité Transport"  value={form.indemnitéTransport}  onChange={handleChange} />
          <AmountField name="primeAnciennete"     label="Prime ancienneté"    value={form.primeAnciennete}     onChange={handleChange} />
        </div>

        {/* Attachement */}
        <div>
          <IconLabel icon={Paperclip} color="#7c3aed">Attachement</IconLabel>
          <input type="text" name="attachement" value={form.attachement} onChange={handleChange}
            placeholder="Lien ou référence du document..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50" />
        </div>

        {/* Commentaire */}
        <div>
          <IconLabel icon={MessageSquare} color="#64748b">Commentaire</IconLabel>
          <textarea name="commentaire" value={form.commentaire} onChange={handleChange} rows={4}
            placeholder="Commentaire libre..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 resize-none" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pb-6">
        <button className="btn-secondary" onClick={handleCancel}>Annuler</button>
        <button
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #881337 0%, #be123c 100%)' }}
          onClick={handleSubmit}
          disabled={create.isPending || !canSubmit}
        >
          {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
