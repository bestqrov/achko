'use client';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const SAMPLE_EVENTS = [
  { day: 5, label: 'Mission: Casa → Rabat', color: 'bg-blue-500' },
  { day: 8, label: 'Entretien: Véh. 12A-7845', color: 'bg-yellow-500' },
  { day: 12, label: 'Mission: Marrakech → Agadir', color: 'bg-green-500' },
  { day: 15, label: 'Visite Technique: 34B-2210', color: 'bg-purple-500' },
  { day: 20, label: 'Mission: Fes → Meknes', color: 'bg-blue-500' },
];

export default function PlanningPage() {
  const now = new Date();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planning</h2>
          <p className="text-sm text-gray-500 mt-1">Calendrier des missions et interventions</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-medium text-gray-700">{MONTHS[now.getMonth()]} {now.getFullYear()}</span>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const events = SAMPLE_EVENTS.filter((e) => e.day === day);
            return (
              <div key={day} className="min-h-[80px] border border-gray-100 rounded-lg p-1 hover:bg-gray-50 cursor-pointer">
                <span className={`text-xs font-medium ${day === now.getDate() ? 'bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-700'}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {events.map((e, i) => (
                    <div key={i} className={`${e.color} text-white text-[10px] px-1 py-0.5 rounded truncate`}>
                      {e.label}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
