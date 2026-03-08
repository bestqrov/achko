'use client';

import { useState, useMemo } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Plus, ArrowLeft,
  Car, User, MapPin, Clock, Tag, MessageSquare, Save,
} from 'lucide-react';
import DataTable from '@/components/DataTable/DataTable';
import SearchFilter from '@/components/Forms/SearchFilter';
import ValidatedInput from '../../../components/Forms/ValidatedInput';
import { useResource, useCreateResource } from '@/hooks/useResource';
import { formatDate } from '@/lib/utils/helpers';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const EMPTY_FORM = {
  titre: '',
  description: '',
  type: '',
  dateDebut: '',
  dateFin: '',
  heureDebut: '',
  heureFin: '',
  vehicle: '',
  chauffeur: '',
  participants: [],
  lieu: '',
  destination: '',
  coutEstime: '',
  notes: '',
  statut: 'planifie',
  priorite: 'normale',
};

const COLUMNS = [
  { key: 'titre', label: 'Titre' },
  { key: 'type', label: 'Type' },
  { key: 'dateDebut', label: 'Date début', render: (v: string) => formatDate(v) },
  { key: 'dateFin', label: 'Date fin', render: (v: string) => formatDate(v) },
  { key: 'statut', label: 'Statut' },
  { key: 'priorite', label: 'Priorité' },
];

function IconLabel({ icon: Icon, color, children }: { icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {children}
    </label>
  );
}

export default function PlanningPage() {
  const [view, setView] = useState<'calendar' | 'list' | 'form'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const { data, isLoading } = useResource<any>('planning', { page, search });
  const { data: vehiclesData } = useResource<any>('vehicles', { limit: 200 });
  const { data: usersData } = useResource<any>('users', { limit: 200 });
  const create = useCreateResource('planning');

  const vehicles = vehiclesData?.data || [];
  const users = usersData?.data || [];
  const events = data?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCancel = () => { setForm(EMPTY_FORM); setView('calendar'); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const errs: Record<string,string> = {};
    if (!form.titre.trim()) errs.titre = 'Le titre est requis';
    if (!form.dateDebut) errs.dateDebut = 'Date début requise';
    if (!form.dateFin) errs.dateFin = 'Date fin requise';
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    await create.mutateAsync({
      ...form,
      coutEstime: form.coutEstime ? Number(form.coutEstime) : 0,
    });
    handleCancel();
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const monthEvents = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return events.filter((event: any) => {
      const eventDate = new Date(event.dateDebut);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  }, [events, currentDate]);

  const getEventsForDay = (day: number) => {
    return monthEvents.filter((event: any) => {
      const eventDate = new Date(event.dateDebut);
      return eventDate.getDate() === day;
    });
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Planning - Liste</h2>
            <p className="text-sm text-gray-500 mt-1">Liste détaillée des événements planifiés</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('calendar')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
              <Calendar className="w-4 h-4" /> Calendrier
            </button>
            <button onClick={() => setView('form')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
        </div>
        <SearchFilter onSearch={setSearch} placeholder="Rechercher un événement..." filters={[]} />
        <DataTable
          columns={COLUMNS}
          data={events}
          loading={isLoading}
          total={data?.total || 0}
          page={page}
          pages={data?.pages || 1}
          onPageChange={setPage}
          emptyMessage="Aucun événement trouvé"
        />
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden shadow-md">
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 40%, #1e40af 70%, #1e3a8a 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-xl p-2">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Nouvel Événement</h3>
                <p className="text-blue-100 text-xs">Planifiez une mission, entretien ou réunion</p>
              </div>
            </div>
            <button onClick={handleCancel}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all">
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Informations générales</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ValidatedInput
                icon={Tag} label="Titre" required
                name="titre" value={form.titre} onChange={handleChange}
                placeholder="Titre de l'événement" className="input"
                error={fieldErrors.titre}
              />
              <div>
                <IconLabel icon={Tag} color="#7c3aed">Type</IconLabel>
                <select name="type" value={form.type} onChange={handleChange} required className="input">
                  <option value="">— Sélectionner —</option>
                  <option value="mission">Mission</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="entretien">Entretien</option>
                  <option value="formation">Formation</option>
                  <option value="reunion">Réunion</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <IconLabel icon={MessageSquare} color="#64748b">Description</IconLabel>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Description détaillée..." className="input resize-none" />
            </div>
          </div>

          {/* Dates et heures */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Dates et horaires</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <ValidatedInput
                  icon={Calendar} label="Date début" required
                  type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} className="input"
                  error={fieldErrors.dateDebut}
                />
              </div>
              <div>
                <ValidatedInput
                  icon={Calendar} label="Date fin" required
                  type="date" name="dateFin" value={form.dateFin} onChange={handleChange} className="input"
                  error={fieldErrors.dateFin}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <IconLabel icon={Clock} color="#7c3aed">Heure début</IconLabel>
                <input type="time" name="heureDebut" value={form.heureDebut} onChange={handleChange} className="input" />
              </div>
              <div>
                <IconLabel icon={Clock} color="#f59e0b">Heure fin</IconLabel>
                <input type="time" name="heureFin" value={form.heureFin} onChange={handleChange} className="input" />
              </div>
            </div>
          </div>

          {/* Ressources */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Ressources</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <IconLabel icon={Car} color="#059669">Véhicule</IconLabel>
                <select name="vehicle" value={form.vehicle} onChange={handleChange} className="input">
                  <option value="">— Sélectionner un véhicule —</option>
                  {vehicles.map((v: any) => (
                    <option key={v._id} value={v._id}>
                      {v.immatricule} - {v.modele}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <IconLabel icon={User} color="#7c3aed">Chauffeur</IconLabel>
                <select name="chauffeur" value={form.chauffeur} onChange={handleChange} className="input">
                  <option value="">— Sélectionner un chauffeur —</option>
                  {users.map((u: any) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <IconLabel icon={MapPin} color="#dc2626">Lieu</IconLabel>
                <input type="text" name="lieu" value={form.lieu} onChange={handleChange}
                  placeholder="Lieu de départ" className="input" />
              </div>
              <div>
                <IconLabel icon={MapPin} color="#f59e0b">Destination</IconLabel>
                <input type="text" name="destination" value={form.destination} onChange={handleChange}
                  placeholder="Destination" className="input" />
              </div>
            </div>
          </div>

          {/* Paramètres */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Paramètres</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <IconLabel icon={Tag} color="#7c3aed">Statut</IconLabel>
                <select name="statut" value={form.statut} onChange={handleChange} className="input">
                  <option value="planifie">Planifié</option>
                  <option value="confirme">Confirmé</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
              <div>
                <IconLabel icon={Tag} color="#f59e0b">Priorité</IconLabel>
                <select name="priorite" value={form.priorite} onChange={handleChange} className="input">
                  <option value="basse">Basse</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <IconLabel icon={Tag} color="#059669">Coût estimé (DH)</IconLabel>
                <input type="number" name="coutEstime" value={form.coutEstime} onChange={handleChange}
                  min="0" step="0.01" placeholder="0.00" className="input" />
              </div>
            </div>

            <div>
              <IconLabel icon={MessageSquare} color="#64748b">Notes</IconLabel>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                placeholder="Notes supplémentaires..." className="input resize-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
              Annuler
            </button>
            <button type="submit" disabled={create.isPending || !form.titre || !form.type}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <Save className="w-4 h-4 inline mr-2" />
              {create.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Calendar view (default)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planning</h2>
          <p className="text-sm text-gray-500 mt-1">Calendrier des missions et interventions</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={navigateMonth.bind(null, -1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-gray-700 min-w-[140px] text-center">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={navigateMonth.bind(null, 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="ml-4 flex gap-2">
            <button onClick={() => setView('list')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
              <Tag className="w-4 h-4" /> Liste
            </button>
            <button onClick={() => setView('form')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
              <Plus className="w-4 h-4" /> Nouveau
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
            <div key={day} className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {getDaysInMonth(currentDate).map((day, index) => {
            if (day === null) {
              return <div key={index} className="bg-gray-50 p-3 min-h-[120px]" />;
            }

            const dayEvents = getEventsForDay(day);
            const isToday = day === new Date().getDate() &&
                           currentDate.getMonth() === new Date().getMonth() &&
                           currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div key={index} className={`bg-white p-3 min-h-[120px] hover:bg-gray-50 cursor-pointer transition-colors ${isToday ? 'bg-blue-50' : ''}`}>
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event: any, i: number) => (
                    <div key={i} className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate">
                      {event.titre}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
