'use client';

import { useState } from 'react';
import {
  Plus, X, AlertTriangle, Truck, FileText,
  CalendarDays, MapPin, ClipboardList, ScrollText,
  Shield, Hash, Car, UserCheck, Users, Info,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import ValidatedInput from '@/components/Forms/ValidatedInput';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate, cn, STATUS_COLORS } from '@/lib/utils/helpers';

const EMPTY_FORM = {
  reference: '',
  vehicle: '',
  circonstances: '',
  infoAdverse: '',
  expert: '',
  temoins: '',
  autres: '',
  dateEmission: '',
  dateDeclaration: '',
  typeSinistre: '',
  lieu: '',
  constat: '',
  rapports: '',
  autoritePV: '',
  numeroPV: '',
  datePV: '',
  degatMateriel: false,
  degatCorporel: false,
  degatMortel: false,
};

const COLUMNS = [
  { key: 'reference', label: 'Sinistre' },
  {
    key: 'vehicle',
    label: 'Véhicule',
    render: (v: any) => v ? `${v.matricule} — ${v.brand} ${v.model}` : '—',
  },
  { key: 'typeSinistre', label: 'Type' },
  { key: 'dateEmission', label: 'Date', render: (v: string) => formatDate(v) },
  { key: 'lieu', label: 'Lieu' },
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

export default function SinistresPage() {
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState<any>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const { data, isLoading }    = useResource<any>('administratif', { page, search, type: 'sinistre' });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const create                 = useCreateResource('administratif');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCheck = (name: string) =>
    setForm((f: any) => ({ ...f, [name]: !f[name] }));

  const handleClose = () => { setModalOpen(false); setForm(EMPTY_FORM); };

  const handleSubmit = async () => {
    setFieldErrors({});
    const errs: Record<string,string> = {};
    if (!form.reference || !form.reference.trim()) errs.reference = 'Référence requise';
    if (!form.vehicle) errs.vehicle = 'Véhicule requis';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    await create.mutateAsync({ ...form, type: 'sinistre' });
    handleClose();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sinistres</h2>
          <p className="text-sm text-gray-500 mt-1">Gestion des sinistres et accidents</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)' }}
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <SearchFilter onSearch={setSearch} placeholder="Rechercher un sinistre..." filters={[]} />
      <DataTable
        columns={COLUMNS} data={data?.data || []} loading={isLoading}
        total={data?.total || 0} page={page} pages={data?.pages || 1}
        onPageChange={setPage} emptyMessage="Aucun sinistre trouvé"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">

            {/* Orange/amber gradient header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ background: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #d97706 70%, #f59e0b 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nouveau Sinistre</h3>
                  <p className="text-amber-100 text-xs">Remplissez les informations ci-dessous</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto max-h-[80vh] p-6 space-y-5">

              {/* Sinistre + Véhicule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <ValidatedInput
                    icon={AlertTriangle} label="Sinistre" required
                    name="reference" value={form.reference} onChange={handleChange}
                    placeholder="Libellé du sinistre" className="w-full"
                    error={fieldErrors.reference}
                  />
                </div>
                <div>
                  <IconLabel icon={Truck} color="#0891b2">Véhicule *</IconLabel>
                  <select name="vehicle" value={form.vehicle} onChange={handleChange}
                    className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 ${fieldErrors.vehicle ? 'border-red-500' : ''}`}
                  >
                    <option value="">— Sélectionner —</option>
                    {(vehiclesData?.data || []).map((v: any) => (
                      <option key={v._id} value={v._id}>{v.matricule} — {v.brand} {v.model}</option>
                    ))}
                  </select>
                  {fieldErrors.vehicle && <p className="text-red-600 text-xs mt-1">{fieldErrors.vehicle}</p>}
                </div>
              </div>

              {/* Circonstances */}
              <div>
                <IconLabel icon={ScrollText} color="#d97706">Circonstances sinistre</IconLabel>
                <textarea name="circonstances" value={form.circonstances} onChange={handleChange} rows={3}
                  placeholder="Décrivez les circonstances de l'accident..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 resize-none" />
              </div>

              {/* Info adverse / Expert / Témoins / Autres */}
              <div className="border border-amber-100 rounded-xl p-4 space-y-4 bg-amber-50/30">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Parties impliquées</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={Car} color="#dc2626">Info adverse</IconLabel>
                    <input type="text" name="infoAdverse" value={form.infoAdverse} onChange={handleChange}
                      placeholder="Infos sur la partie adverse"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={UserCheck} color="#7c3aed">Expert</IconLabel>
                    <input type="text" name="expert" value={form.expert} onChange={handleChange}
                      placeholder="Nom de l'expert"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={Users} color="#0891b2">Témoins</IconLabel>
                    <input type="text" name="temoins" value={form.temoins} onChange={handleChange}
                      placeholder="Nom(s) des témoins"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={Info} color="#64748b">Autres</IconLabel>
                    <input type="text" name="autres" value={form.autres} onChange={handleChange}
                      placeholder="Autres informations"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                </div>
              </div>

              {/* Date / Date déclaration / Type sinistre */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50/50">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Informations générales</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <IconLabel icon={CalendarDays} color="#d97706">Date</IconLabel>
                    <input type="date" name="dateEmission" value={form.dateEmission} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={CalendarDays} color="#2563eb">Date déclaration</IconLabel>
                    <input type="date" name="dateDeclaration" value={form.dateDeclaration} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={FileText} color="#dc2626">Type sinistre</IconLabel>
                    <input type="text" name="typeSinistre" value={form.typeSinistre} onChange={handleChange}
                      placeholder="Ex: Collision, Vol..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                </div>

                {/* Lieu */}
                <div>
                  <IconLabel icon={MapPin} color="#dc2626">Lieu</IconLabel>
                  <input type="text" name="lieu" value={form.lieu} onChange={handleChange}
                    placeholder="Lieu de l'accident"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                </div>

                {/* Constat / Rapports / Autorité PV */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <IconLabel icon={ClipboardList} color="#16a34a">Constat</IconLabel>
                    <input type="text" name="constat" value={form.constat} onChange={handleChange}
                      placeholder="N° constat amiable"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={ScrollText} color="#7c3aed">Rapports</IconLabel>
                    <input type="text" name="rapports" value={form.rapports} onChange={handleChange}
                      placeholder="Référence rapport"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={Shield} color="#0891b2">Autorité PV</IconLabel>
                    <input type="text" name="autoritePV" value={form.autoritePV} onChange={handleChange}
                      placeholder="Police / Gendarmerie"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                </div>

                {/* Numéro PV + Date PV */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <IconLabel icon={Hash} color="#7c3aed">Numéro PV</IconLabel>
                    <input type="text" name="numeroPV" value={form.numeroPV} onChange={handleChange}
                      placeholder="N° du PV"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                  <div>
                    <IconLabel icon={CalendarDays} color="#64748b">Date PV</IconLabel>
                    <input type="date" name="datePV" value={form.datePV} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
                  </div>
                </div>
              </div>

              {/* Dégâts — checkboxes */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Nature des dégâts</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'degatMateriel', label: 'Dégât matériel',  color: '#d97706', bg: 'bg-amber-50  border-amber-200' },
                    { name: 'degatCorporel', label: 'Dégât corporel',  color: '#dc2626', bg: 'bg-red-50    border-red-200'   },
                    { name: 'degatMortel',   label: 'Dégât mortel',    color: '#7f1d1d', bg: 'bg-red-100   border-red-300'   },
                  ].map(({ name, label, color, bg }) => (
                    <button
                      key={name} type="button"
                      onClick={() => handleCheck(name)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                        bg,
                        form[name] ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'
                      )}
                    >
                      <span
                        className={cn(
                          'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                          form[name] ? 'border-transparent' : 'border-gray-300 bg-white'
                        )}
                        style={form[name] ? { backgroundColor: color, borderColor: color } : {}}
                      >
                        {form[name] && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span style={{ color }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button className="btn-secondary" onClick={handleClose}>Annuler</button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)' }}
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
