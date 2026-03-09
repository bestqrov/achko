'use client';

import { useState, useMemo } from 'react';
import {
  Plus, X, ClipboardCheck, Truck, CalendarRange, CalendarCheck,
  Percent, Stamp, Tag, Building2, BadgeDollarSign, Receipt, ShieldCheck,
  Paperclip, MessageSquare, Calculator,
} from 'lucide-react';
import ValidatedInput from '@/components/Forms/ValidatedInput';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  vehicle: '',
  dateEmission: '',
  dateExpiration: '',
  typeVisite: '',
  centreVisite: '',
  tva: '',
  timbres: '',
  cnpac: '',
  taxeCom: '',
  cneh: '',
  notes: '',
};

const COLUMNS = [
  {
    key: 'vehicle',
    label: 'Véhicule',
    render: (v: any) => v ? `${v.matricule} — ${v.brand} ${v.model}` : '—',
  },
  { key: 'dateEmission',   label: 'Date début',  render: (v: string) => formatDate(v) },
  { key: 'dateExpiration', label: 'Date fin',     render: (v: string) => formatDate(v) },
  { key: 'typeVisite',     label: 'Type visite' },
  { key: 'centreVisite',   label: 'Centre' },
  { key: 'montant',        label: 'Total',        render: (v: number) => v != null ? `${Number(v).toFixed(2)} DH` : '—' },
  {
    key: 'statut',
    label: 'Statut',
    render: (v: string) => (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[v] || 'bg-gray-100 text-gray-600')}>
        {v}
      </span>
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
          className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">DH</span>
      </div>
    </div>
  );
}

export default function VisitesTechniquesPage() {
    // Données fictives pour le formulaire visite technique
    const MOCKDATA = {
      vehicle: vehiclesData?.data?.[0]?._id || '',
      dateEmission: '2026-02-01',
      dateExpiration: '2027-02-01',
      typeVisite: 'Périodique',
      centreVisite: 'Centre Casablanca',
      tva: '20',
      timbres: '15',
      cnpac: '10',
      taxeCom: '5',
      cneh: '3',
      notes: 'Visite technique annuelle',
    };
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [attachement, setAttachement] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const { data, isLoading }    = useResource<any>('administratif', { page, search, type: 'visite-technique' });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const create                 = useCreateResource('administratif');

  const total = useMemo(() =>
    ['tva', 'timbres', 'cnpac', 'taxeCom', 'cneh']
      .reduce((sum, k) => sum + (parseFloat((form as any)[k]) || 0), 0),
  [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleClose = () => { setModalOpen(false); setForm(EMPTY_FORM); setAttachement(null); };

  const handleSubmit = async () => {
    setFieldErrors({});
    const errs: Record<string,string> = {};
    if (!form.typeVisite.trim()) errs.typeVisite = 'Type visite requis';
    if (!form.vehicle) errs.vehicle = 'Véhicule requis';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    await create.mutateAsync({
      ...form,
      type: 'visite-technique',
      montant: total,
      tva:     parseFloat(form.tva)     || 0,
      timbres: parseFloat(form.timbres) || 0,
      cnpac:   parseFloat(form.cnpac)   || 0,
      taxeCom: parseFloat(form.taxeCom) || 0,
      cneh:    parseFloat(form.cneh)    || 0,
    });
    handleClose();
  };

  return (
    <div className="space-y-6">
      {/* Remplir automatiquement le formulaire avec des données fictives */}
      {modalOpen && (
        <button
          type="button"
          className="mb-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold"
          onClick={() => setForm(MOCKDATA)}
        >
          Remplir avec des données fictives
        </button>
      )}
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visites Techniques</h2>
          <p className="text-sm text-gray-500 mt-1">Suivi des visites techniques périodiques</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <SearchFilter onSearch={setSearch} placeholder="Rechercher une visite..." filters={[]} />
      <DataTable
        columns={COLUMNS} data={data?.data || []} loading={isLoading}
        total={data?.total || 0} page={page} pages={data?.pages || 1}
        onPageChange={setPage} emptyMessage="Aucune visite technique trouvée"
      />

      {/* ── Custom Modal with blue header ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">

            {/* Blue gradient header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nouvelle Visite Technique</h3>
                  <p className="text-blue-100 text-xs">Remplissez les informations ci-dessous</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[72vh] p-6 space-y-5">

              {/* Visite technique + Véhicule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <ValidatedInput
                  icon={ClipboardCheck} label="Visite technique" required
                  name="typeVisite" value={form.typeVisite} onChange={handleChange}
                  placeholder="Ex: Périodique, Contradictoire..." className="w-full"
                  error={fieldErrors.typeVisite}
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

                {/* Dates + Amounts row 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={CalendarRange} color="#16a34a">Date début</IconLabel>
                    <input type="date" name="dateEmission" value={form.dateEmission} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <AmountField label="Montant TVA" icon={Percent} iconColor="#d97706"
                    name="tva" value={form.tva} onChange={handleChange} />
                </div>

                {/* Dates + Amounts row 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={CalendarCheck} color="#dc2626">Date fin</IconLabel>
                    <input type="date" name="dateExpiration" value={form.dateExpiration} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <AmountField label="Timbres" icon={Stamp} iconColor="#0891b2"
                    name="timbres" value={form.timbres} onChange={handleChange} />
                </div>

                {/* Type + CNPAC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={Tag} color="#7c3aed">Type visite technique</IconLabel>
                    <input type="text" name="typeVisite" value={form.typeVisite} onChange={handleChange}
                      placeholder="Type"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <AmountField label="CNPAC" icon={ShieldCheck} iconColor="#16a34a"
                    name="cnpac" value={form.cnpac} onChange={handleChange} />
                </div>

                {/* Centre + TAXE COM */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={Building2} color="#0891b2">Centre de visite technique</IconLabel>
                    <input type="text" name="centreVisite" value={form.centreVisite} onChange={handleChange}
                      placeholder="Nom du centre"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <AmountField label="TAXE COM" icon={BadgeDollarSign} iconColor="#dc2626"
                    name="taxeCom" value={form.taxeCom} onChange={handleChange} />
                </div>

                {/* CNEH alone */}
                <div className="grid grid-cols-2 gap-4">
                  <div />
                  <AmountField label="CNEH" icon={Receipt} iconColor="#7c3aed"
                    name="cneh" value={form.cneh} onChange={handleChange} />
                </div>

                {/* Auto total */}
                <div className="flex items-center justify-between rounded-lg px-4 py-3"
                  style={{ background: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)' }}>
                  <span className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <Calculator className="w-4 h-4" /> Montant Total
                  </span>
                  <span className="text-base font-bold text-blue-800">{total.toFixed(2)} DH</span>
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
                disabled={create.isPending || !form.vehicle}
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
