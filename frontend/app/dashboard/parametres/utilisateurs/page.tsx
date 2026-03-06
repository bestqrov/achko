'use client';

import { useState } from 'react';
import { UserCog, Plus, Mail, Shield, User, Trash2, Edit2, X, Save, Search } from 'lucide-react';

const ROLES = ['Admin', 'Manager', 'Opérateur', 'Lecteur'];
const ROLE_COLOR: Record<string, string> = {
  Admin:     'bg-red-100 text-red-700 border-red-200',
  Manager:   'bg-violet-100 text-violet-700 border-violet-200',
  Opérateur: 'bg-blue-100 text-blue-700 border-blue-200',
  Lecteur:   'bg-gray-100 text-gray-700 border-gray-200',
};

const SAMPLE_USERS = [
  { id: 1, nom: 'Admin Système', email: 'admin@arwapark.ma', role: 'Admin',     actif: true },
  { id: 2, nom: 'Ali Benali',   email: 'ali@arwapark.ma',   role: 'Manager',   actif: true },
  { id: 3, nom: 'Sara Alami',   email: 'sara@arwapark.ma',  role: 'Opérateur', actif: false },
];

const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white shadow-sm placeholder:text-gray-300 transition';

export default function UtilisateursPage() {
  const [users, setUsers]     = useState(SAMPLE_USERS);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ nom: '', email: '', role: 'Opérateur', actif: true });

  const f = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(p => [...p, { ...form, id: Date.now() }]);
    setForm({ nom: '', email: '', role: 'Opérateur', actif: true });
    setShowForm(false);
  };

  const filtered = users.filter(u =>
    [u.nom, u.email, u.role].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 p-6 space-y-6">

      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <UserCog className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-1">Paramètres</p>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Utilisateurs</h1>
            <p className="text-violet-100 text-sm mt-1">Gestion des accès et des rôles</p>
          </div>
          <button onClick={() => setShowForm(p => !p)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-violet-700 shadow-md hover:bg-violet-50 transition">
            <Plus className="w-4 h-4" /> Nouvel utilisateur
          </button>
        </div>
        <div className="h-1 flex">
          {['bg-violet-400','bg-violet-500','bg-purple-400','bg-purple-500','bg-fuchsia-400','bg-fuchsia-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {/* New user form */}
      {showForm && (
        <form onSubmit={addUser} className="bg-white rounded-2xl border border-violet-200 shadow-sm p-5 space-y-4 max-w-2xl">
          <h3 className="text-sm font-extrabold text-violet-700 uppercase tracking-widest">Nouvel utilisateur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Nom complet</label>
              <input value={form.nom} onChange={f('nom')} required placeholder="Prénom Nom" className={inp} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
              <input type="email" value={form.email} onChange={f('email')} required placeholder="email@domaine.ma" className={inp} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Rôle</label>
              <select value={form.role} onChange={f('role')} className={inp}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition">
              <X className="w-4 h-4" /> Annuler
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-bold shadow hover:opacity-90 transition">
              <Save className="w-4 h-4" /> Créer
            </button>
          </div>
        </form>
      )}

      {/* Search + table */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur…"
            className="flex-1 text-sm outline-none placeholder:text-gray-300" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">
              {filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map(u => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-sm">
                    {u.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{u.nom}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${ROLE_COLOR[u.role]}`}>{u.role}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.actif ? 'Actif' : 'Inactif'}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-400 hover:text-violet-600 transition"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setUsers(p => p.filter(x => x.id !== u.id))}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-gray-400">Aucun utilisateur trouvé</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
