'use client';

import { useState } from 'react';
import {
  HardDrive, Download, Upload, RefreshCw, CheckCircle2,
  Clock, Database, Shield, AlertTriangle, Trash2,
} from 'lucide-react';

const MOCK_BACKUPS = [
  { id: 1, date: '2026-03-06 22:00', size: '4.2 MB', type: 'Auto', status: 'success' },
  { id: 2, date: '2026-03-05 22:00', size: '4.1 MB', type: 'Auto', status: 'success' },
  { id: 3, date: '2026-03-04 14:30', size: '3.9 MB', type: 'Manuel', status: 'success' },
  { id: 4, date: '2026-03-03 22:00', size: '3.8 MB', type: 'Auto', status: 'success' },
];

export default function SauvegardePage() {
  const [loading,  setLoading]  = useState(false);
  const [backups,  setBackups]  = useState(MOCK_BACKUPS);
  const [autoFreq, setAutoFreq] = useState('Quotidien');
  const [keepDays, setKeepDays] = useState('30');
  const [success,  setSuccess]  = useState('');

  const handleManualBackup = () => {
    setLoading(true);
    setTimeout(() => {
      const now = new Date().toLocaleString('fr-FR').replace(',', '');
      setBackups(p => [
        { id: Date.now(), date: now, size: '4.3 MB', type: 'Manuel', status: 'success' },
        ...p,
      ]);
      setLoading(false);
      setSuccess('Sauvegarde créée avec succès !');
      setTimeout(() => setSuccess(''), 4000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 p-6 space-y-6">

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <HardDrive className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6">
          <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-1">Paramètres</p>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sauvegarde</h1>
          <p className="text-violet-100 text-sm mt-1">Gérez les sauvegardes de vos données</p>
        </div>
        <div className="h-1 flex">
          {['bg-violet-400','bg-violet-500','bg-purple-400','bg-purple-500','bg-fuchsia-400','bg-fuchsia-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      <div className="max-w-2xl space-y-5">

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleManualBackup} disabled={loading}
            className="flex items-center gap-3 p-5 rounded-2xl border-2 border-violet-200 bg-white hover:border-violet-500 hover:bg-violet-50 transition-all shadow-sm group disabled:opacity-60">
            <div className="p-2.5 rounded-xl bg-violet-100 group-hover:bg-violet-200 transition">
              {loading ? <RefreshCw className="w-5 h-5 text-violet-600 animate-spin" /> : <Download className="w-5 h-5 text-violet-600" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-extrabold text-gray-800">{loading ? 'En cours…' : 'Sauvegarder maintenant'}</p>
              <p className="text-xs text-gray-400">Sauvegarde manuelle complète</p>
            </div>
          </button>

          <label className="flex items-center gap-3 p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 transition-all shadow-sm cursor-pointer group">
            <div className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-violet-100 transition">
              <Upload className="w-5 h-5 text-gray-500 group-hover:text-violet-600 transition" />
            </div>
            <div className="text-left">
              <p className="text-sm font-extrabold text-gray-800">Restaurer</p>
              <p className="text-xs text-gray-400">Importer un fichier de sauvegarde</p>
            </div>
            <input type="file" className="hidden" accept=".json,.zip" />
          </label>
        </div>

        {/* Auto-backup settings */}
        <div className="bg-white rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-violet-50 to-white px-5 py-3 flex items-center gap-2.5 border-b border-violet-200">
            <div className="bg-violet-600 p-1.5 rounded-lg"><Clock className="w-4 h-4 text-white" /></div>
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Sauvegarde automatique</h3>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Activée</span>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 block">Fréquence</label>
              <select value={autoFreq} onChange={e => setAutoFreq(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white shadow-sm">
                {['Quotidien','Hebdomadaire','Mensuel'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 block">Conservation (jours)</label>
              <input type="number" value={keepDays} onChange={e => setKeepDays(e.target.value)} min="7" max="365"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white shadow-sm" />
            </div>
          </div>
        </div>

        {/* Backup list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-white" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex-1">Historique des sauvegardes</h2>
            <Shield className="w-4 h-4 text-white/60" />
          </div>
          <div className="divide-y divide-gray-50">
            {backups.map(b => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{b.date}</p>
                    <p className="text-xs text-gray-400">{b.size} · {b.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs text-violet-600 font-semibold hover:text-violet-800 transition">
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </button>
                  <button onClick={() => setBackups(p => p.filter(x => x.id !== b.id))}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          La restauration remplace toutes les données actuelles. Assurez-vous d&apos;avoir une sauvegarde récente.
        </div>
      </div>
    </div>
  );
}
