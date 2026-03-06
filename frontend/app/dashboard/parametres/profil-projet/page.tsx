'use client';

import { useState } from 'react';
import { Building2, Globe, Phone, Mail, MapPin, Upload, Save, X } from 'lucide-react';

const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white shadow-sm placeholder:text-gray-300 transition';

function FL({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <label className="flex items-center gap-1.5 mb-1.5">
      <Icon className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
      <span className="text-[11px] font-bold uppercase tracking-wide text-violet-600">{label}</span>
    </label>
  );
}

export default function ProfilProjetPage() {
  const [form, setForm] = useState({
    nomSociete: '', secteur: '', siteWeb: '', telephone: '',
    email: '', adresse: '', ville: '', pays: 'Maroc', description: '',
  });
  const [saved, setSaved] = useState(false);

  const f = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <Building2 className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6">
          <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-1">Paramètres</p>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Profil projet</h1>
          <p className="text-violet-100 text-sm mt-1">Informations générales de votre organisation</p>
        </div>
        <div className="h-1 flex">
          {['bg-violet-400','bg-violet-500','bg-purple-400','bg-purple-500','bg-fuchsia-400','bg-fuchsia-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">

        {/* Logo */}
        <div className="bg-white rounded-2xl border border-violet-200 shadow-sm p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-dashed border-violet-300 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 transition">
            <Upload className="w-6 h-6 text-violet-400" />
            <span className="text-[10px] text-violet-400 font-semibold mt-1">Logo</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Logo de l&apos;organisation</p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG jusqu&apos;à 2 MB — recommandé 200×200px</p>
            <button type="button"
              className="mt-2 text-xs font-semibold text-violet-600 hover:text-violet-800 underline underline-offset-2">
              Choisir un fichier
            </button>
          </div>
        </div>

        {/* Infos */}
        <div className="rounded-2xl border border-violet-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-violet-50 to-white px-5 py-3 flex items-center gap-2.5 border-b border-violet-200">
            <div className="bg-violet-600 p-1.5 rounded-lg"><Building2 className="w-4 h-4 text-white" /></div>
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest">Informations</h3>
          </div>
          <div className="bg-white p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FL icon={Building2} label="Nom de la société" />
                <input value={form.nomSociete} onChange={f('nomSociete')} placeholder="ArwaPark SARL" className={inp} />
              </div>
              <div>
                <FL icon={Building2} label="Secteur d'activité" />
                <input value={form.secteur} onChange={f('secteur')} placeholder="Transport & Logistique" className={inp} />
              </div>
              <div>
                <FL icon={Globe} label="Site web" />
                <input value={form.siteWeb} onChange={f('siteWeb')} placeholder="https://arwapark.ma" className={inp} />
              </div>
              <div>
                <FL icon={Phone} label="Téléphone" />
                <input value={form.telephone} onChange={f('telephone')} placeholder="+212 5XX XXX XXX" className={inp} />
              </div>
              <div>
                <FL icon={Mail} label="Email" />
                <input type="email" value={form.email} onChange={f('email')} placeholder="contact@arwapark.ma" className={inp} />
              </div>
              <div>
                <FL icon={MapPin} label="Ville" />
                <input value={form.ville} onChange={f('ville')} placeholder="Casablanca" className={inp} />
              </div>
            </div>
            <div>
              <FL icon={MapPin} label="Adresse complète" />
              <input value={form.adresse} onChange={f('adresse')} placeholder="123 Boulevard Mohammed V" className={inp} />
            </div>
            <div>
              <FL icon={Building2} label="Description" />
              <textarea value={form.description} onChange={f('description') as any}
                rows={3} placeholder="Description courte de votre organisation…"
                className={`${inp} resize-none`} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => setForm({ nomSociete:'',secteur:'',siteWeb:'',telephone:'',email:'',adresse:'',ville:'',pays:'Maroc',description:'' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition shadow-sm">
            <X className="w-4 h-4" /> Réinitialiser
          </button>
          <button type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-bold shadow-md hover:opacity-90 transition">
            <Save className="w-4 h-4" /> {saved ? 'Enregistré ✓' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
