'use client';

import { useState } from 'react';
import { Palette, Check, Sun, Moon, Monitor, Save } from 'lucide-react';

const ACCENT_COLORS = [
  { name: 'Violet',   primary: '#7c3aed', light: '#ede9fe', class: 'bg-violet-600' },
  { name: 'Blue',     primary: '#2563eb', light: '#dbeafe', class: 'bg-blue-600' },
  { name: 'Teal',     primary: '#0d9488', light: '#ccfbf1', class: 'bg-teal-600' },
  { name: 'Emerald',  primary: '#059669', light: '#d1fae5', class: 'bg-emerald-600' },
  { name: 'Orange',   primary: '#ea580c', light: '#ffedd5', class: 'bg-orange-600' },
  { name: 'Rose',     primary: '#e11d48', light: '#ffe4e6', class: 'bg-rose-600' },
  { name: 'Amber',    primary: '#d97706', light: '#fef3c7', class: 'bg-amber-600' },
  { name: 'Indigo',   primary: '#4f46e5', light: '#e0e7ff', class: 'bg-indigo-600' },
];

const DENSITY = ['Compact', 'Normal', 'Confortable'];
const FONT_SIZE = ['Petit', 'Normal', 'Grand'];

export default function ThemePage() {
  const [mode,     setMode]     = useState<'light' | 'dark' | 'system'>('light');
  const [accent,   setAccent]   = useState(ACCENT_COLORS[0].name);
  const [density,  setDensity]  = useState('Normal');
  const [fontSize, setFontSize] = useState('Normal');
  const [saved,    setSaved]    = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 p-6 space-y-6">

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <Palette className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6">
          <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-1">Paramètres</p>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Thème &amp; Apparence</h1>
          <p className="text-violet-100 text-sm mt-1">Personnalisez l&apos;interface selon vos préférences</p>
        </div>
        <div className="h-1 flex">
          {['bg-violet-400','bg-violet-500','bg-purple-400','bg-purple-500','bg-fuchsia-400','bg-fuchsia-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      <div className="max-w-2xl space-y-5">

        {/* Mode */}
        <div className="bg-white rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-violet-50 to-white px-5 py-3 flex items-center gap-2.5 border-b border-violet-200">
            <div className="bg-violet-600 p-1.5 rounded-lg"><Sun className="w-4 h-4 text-white" /></div>
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Mode d&apos;affichage</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'light',  label: 'Clair',   icon: Sun },
                { key: 'dark',   label: 'Sombre',  icon: Moon },
                { key: 'system', label: 'Système', icon: Monitor },
              ].map(({ key, label, icon: Icon }) => (
                <button key={key} type="button"
                  onClick={() => setMode(key as any)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all font-semibold text-sm
                    ${mode === key ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500 hover:border-violet-300'}`}>
                  <Icon className="w-5 h-5" />
                  {label}
                  {mode === key && <Check className="w-3.5 h-3.5 text-violet-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accent color */}
        <div className="bg-white rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-violet-50 to-white px-5 py-3 flex items-center gap-2.5 border-b border-violet-200">
            <div className="bg-violet-600 p-1.5 rounded-lg"><Palette className="w-4 h-4 text-white" /></div>
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Couleur principale</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-3">
              {ACCENT_COLORS.map(c => (
                <button key={c.name} type="button"
                  onClick={() => setAccent(c.name)}
                  title={c.name}
                  className={`w-10 h-10 rounded-full ${c.class} flex items-center justify-center transition-all shadow-md
                    ${accent === c.name ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}>
                  {accent === c.name && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Couleur sélectionnée : <span className="font-bold text-gray-600">{accent}</span></p>
          </div>
        </div>

        {/* Density */}
        <div className="bg-white rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-violet-50 to-white px-5 py-3 flex items-center gap-2.5 border-b border-violet-200">
            <div className="bg-violet-600 p-1.5 rounded-lg"><Palette className="w-4 h-4 text-white" /></div>
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Densité &amp; Taille de texte</h3>
          </div>
          <div className="p-5 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mb-2">Densité</p>
              <div className="space-y-2">
                {DENSITY.map(d => (
                  <button key={d} type="button" onClick={() => setDensity(d)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border text-sm transition-all
                      ${density === d ? 'border-violet-500 bg-violet-50 text-violet-700 font-bold' : 'border-gray-200 text-gray-500 hover:border-violet-200'}`}>
                    {d}
                    {density === d && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mb-2">Taille du texte</p>
              <div className="space-y-2">
                {FONT_SIZE.map(s => (
                  <button key={s} type="button" onClick={() => setFontSize(s)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border text-sm transition-all
                      ${fontSize === s ? 'border-violet-500 bg-violet-50 text-violet-700 font-bold' : 'border-gray-200 text-gray-500 hover:border-violet-200'}`}>
                    {s}
                    {fontSize === s && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-bold shadow-md hover:opacity-90 transition">
            <Save className="w-4 h-4" /> {saved ? 'Enregistré ✓' : 'Enregistrer les préférences'}
          </button>
        </div>
      </div>
    </div>
  );
}
