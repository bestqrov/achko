'use client';

import { useState } from 'react';
import {
  UserCog, Plus, Mail, Shield, User, Trash2, Edit2,
  X, Save, Eye, EyeOff, Key, Lock, CheckCircle2,
  Package, Truck, Users, AlertCircle,
} from 'lucide-react';

/* ── Pack limits (Basic) ─────────────────────────────── */
const PACK = { name: 'Basic', maxVehicules: 20, maxChauffeurs: 20, currentVehicules: 13, currentChauffeurs: 8 };

const ROLES = ['Admin', 'Secrétaire'] as const;
type Role = (typeof ROLES)[number];

const ROLE_META: Record<Role, { color: string; bg: string; border: string; desc: string }> = {
  Admin:      { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    desc: 'Accès complet — gestion totale du système' },
  Secrétaire: { color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   desc: 'Saisie, consultation et gestion courante' },
};

const INIT_USERS = [
  { id: 1, nom: 'Admin Système',  login: 'admin',   email: 'admin@arwapark.ma',  role: 'Admin' as Role,      actif: true,  password: '' },
  { id: 2, nom: 'Sara Alami',     login: 'sara',    email: 'sara@arwapark.ma',   role: 'Secrétaire' as Role, actif: true,  password: '' },
];

type User = typeof INIT_USERS[number];

const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white shadow-sm placeholder:text-gray-300 transition';

function PasswordField({ value, onChange, placeholder = '••••••••' }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`${inp} pr-9`} autoComplete="new-password" />
      <button type="button" onClick={() => setShow(p => !p)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

/* ── Modal — create / edit ───────────────────────────── */
function UserModal({ user, onSave, onClose }: {
  user?: User | null; onSave: (u: User) => void; onClose: () => void;
}) {
  const isEdit = !!user;
  const [form, setForm] = useState<User>(user ?? {
    id: Date.now(), nom: '', login: '', email: '', role: 'Secrétaire', actif: true, password: '',
  });
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');

  const set = (k: keyof User) => (v: string | boolean) =>
    setForm(p => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!isEdit || form.password) {
      if (form.password.length < 6) return setErr('Le mot de passe doit faire au moins 6 caractères.');
      if (form.password !== confirm) return setErr('Les mots de passe ne correspondent pas.');
    }
    onSave(form);
  };

  const meta = ROLE_META[form.role];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(4px)' }}>
      <form onSubmit={submit}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">

        {/* Modal header */}
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-white" />
            <span className="text-sm font-extrabold text-white uppercase tracking-widest">
              {isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </span>
          </div>
          <button type="button" onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Role picker */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Rôle
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => {
                const m = ROLE_META[r];
                const active = form.role === r;
                return (
                  <button key={r} type="button" onClick={() => set('role')(r)}
                    className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border-2 transition-all text-left
                      ${active ? `${m.border} ${m.bg}` : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wide ${active ? m.color : 'text-gray-600'}`}>{r}</span>
                    <span className="text-[10px] text-gray-400 leading-tight">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nom + login */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Nom complet
              </label>
              <input value={form.nom} onChange={e => set('nom')(e.target.value)}
                required placeholder="Prénom Nom" className={inp} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Identifiant
              </label>
              <input value={form.login} onChange={e => set('login')(e.target.value.toLowerCase().replace(/\s/g, ''))}
                required placeholder="nom.prenom" className={inp} autoComplete="username" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input type="email" value={form.email} onChange={e => set('email')(e.target.value)}
              required placeholder="prenom.nom@domaine.ma" className={inp} />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> {isEdit ? 'Nouveau mot de passe (laisser vide = inchangé)' : 'Mot de passe'}
            </label>
            <PasswordField value={form.password} onChange={v => set('password')(v)} />
            <PasswordField value={confirm} onChange={setConfirm} placeholder="Confirmer le mot de passe" />
          </div>

          {err && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {err}
            </div>
          )}

          {/* Actif toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => set('actif')(!form.actif)}
              className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 relative cursor-pointer
                ${form.actif ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all
                ${form.actif ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {form.actif ? 'Compte actif' : 'Compte désactivé'}
            </span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
              Annuler
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-sm font-bold shadow hover:opacity-90 transition">
              <Save className="w-4 h-4" /> {isEdit ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function UtilisateursPage() {
  const [users,   setUsers]   = useState<User[]>(INIT_USERS);
  const [modal,   setModal]   = useState<'create' | User | null>(null);
  const [delId,   setDelId]   = useState<number | null>(null);
  const [success, setSuccess] = useState('');

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
  };

  const saveUser = (u: User) => {
    setUsers(p => p.some(x => x.id === u.id) ? p.map(x => x.id === u.id ? u : x) : [...p, u]);
    setModal(null);
    flash(u.nom ? `Utilisateur « ${u.nom} » enregistré.` : 'Utilisateur créé.');
  };

  const deleteUser = (id: number) => {
    setUsers(p => p.filter(x => x.id !== id));
    setDelId(null);
    flash('Utilisateur supprimé.');
  };

  const maxUsers = 2; // Basic pack: 1 Admin + 1 Secrétaire max per licence
  const canAdd = users.length < maxUsers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 p-6 space-y-5">

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
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Gestion des utilisateurs</h1>
            <p className="text-violet-100 text-sm mt-1">Connexion, mots de passe et rôles</p>
          </div>
          <button onClick={() => canAdd ? setModal('create') : null}
            disabled={!canAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white text-violet-700 shadow-md hover:bg-violet-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        <div className="h-1 flex">
          {['bg-violet-400','bg-violet-500','bg-purple-400','bg-purple-500','bg-fuchsia-400','bg-fuchsia-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {/* Pack Banner */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 px-5 py-3 flex items-center gap-2.5 border-b border-violet-100">
          <div className="bg-violet-600 p-1.5 rounded-lg"><Package className="w-4 h-4 text-white" /></div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-700 flex-1">Pack actif — {PACK.name}</span>
          <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full border border-violet-200">
            Actif
          </span>
        </div>
        <div className="px-5 py-4 grid grid-cols-2 gap-4">
          {/* Véhicules */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Truck className="w-3.5 h-3.5 text-blue-500" /> Véhicules
              </div>
              <span className="text-[11px] font-extrabold text-gray-700">
                {PACK.currentVehicules} / {PACK.maxVehicules}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${(PACK.currentVehicules / PACK.maxVehicules) * 100}%` }} />
            </div>
            <p className="text-[10px] text-gray-400">{PACK.maxVehicules - PACK.currentVehicules} emplacements disponibles</p>
          </div>
          {/* Chauffeurs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Users className="w-3.5 h-3.5 text-violet-500" /> Chauffeurs
              </div>
              <span className="text-[11px] font-extrabold text-gray-700">
                {PACK.currentChauffeurs} / {PACK.maxChauffeurs}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${(PACK.currentChauffeurs / PACK.maxChauffeurs) * 100}%` }} />
            </div>
            <p className="text-[10px] text-gray-400">{PACK.maxChauffeurs - PACK.currentChauffeurs} emplacements disponibles</p>
          </div>
        </div>
        <div className="px-5 pb-4">
          <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Pack Basic : 2 comptes utilisateurs inclus (1 Admin + 1 Secrétaire). Contactez-nous pour passer à un pack supérieur.
          </p>
        </div>
      </div>

      {/* Flash */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
        </div>
      )}

      {/* User list */}
      <div className="space-y-3">
        {users.map(u => {
          const meta = ROLE_META[u.role];
          return (
            <div key={u.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  {u.nom.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-sm">{u.nom}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}>
                      {u.role}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {u.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Key className="w-3 h-3" /> {u.login}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Mail className="w-3 h-3" /> {u.email}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setModal(u)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition">
                    <Edit2 className="w-3.5 h-3.5" /> Modifier
                  </button>
                  {users.length > 1 && (
                    <button onClick={() => setDelId(u.id)}
                      className="p-1.5 rounded-xl hover:bg-red-50 text-red-300 hover:text-red-500 transition border border-transparent hover:border-red-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Permissions strip */}
              <div className={`px-5 py-2 border-t ${meta.border} ${meta.bg} flex flex-wrap gap-2`}>
                <span className="text-[10px] text-gray-500 font-semibold mr-1">Accès :</span>
                {u.role === 'Admin' ? (
                  ['Tableau de bord','Véhicules','Missions','Facturation','Maintenance','Collaborateurs','Paramètres'].map(p => (
                    <span key={p} className="text-[10px] bg-white border border-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-md">{p}</span>
                  ))
                ) : (
                  ['Tableau de bord','Véhicules','Missions','Facturation','Maintenance','Collaborateurs'].map(p => (
                    <span key={p} className="text-[10px] bg-white border border-blue-100 text-blue-600 font-semibold px-1.5 py-0.5 rounded-md">{p}</span>
                  ))
                )}
              </div>
            </div>
          );
        })}

        {/* Empty slot(s) */}
        {Array.from({ length: Math.max(0, maxUsers - users.length) }).map((_, i) => (
          <button key={i} onClick={() => setModal('create')}
            className="w-full bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm px-5 py-5 flex items-center gap-3 hover:border-violet-300 hover:bg-violet-50/30 transition group">
            <div className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-violet-300 transition">
              <Plus className="w-5 h-5 text-gray-300 group-hover:text-violet-400 transition" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-400 group-hover:text-violet-600 transition">Emplacement disponible</p>
              <p className="text-[11px] text-gray-300">Cliquer pour ajouter un utilisateur</p>
            </div>
          </button>
        ))}
      </div>

      {/* Create / Edit modal */}
      {modal && (
        <UserModal
          user={modal === 'create' ? null : modal}
          onSave={saveUser}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm */}
      {delId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,15,35,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-xl">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Supprimer cet utilisateur ?</p>
                <p className="text-xs text-gray-400 mt-0.5">Cette action est irréversible.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDelId(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={() => deleteUser(delId)}
                className="px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
