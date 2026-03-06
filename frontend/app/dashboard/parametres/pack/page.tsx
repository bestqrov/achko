'use client';

import { useState } from 'react';
import { Crown, Check, Lock, Zap, Phone, Mail, ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { PACKS, CURRENT_PACK, currentPack } from '@/lib/pack';

const FEATURES_COMPARISON = [
  { label: 'Véhicules',             basic: '20 véhicules',    pro: '100 véhicules' },
  { label: 'Chauffeurs',            basic: '20 chauffeurs',   pro: '200 chauffeurs' },
  { label: 'Utilisateurs',          basic: '2 (Admin + Sec.)', pro: '10 utilisateurs' },
  { label: 'Gestion Administratif', basic: true,              pro: true },
  { label: 'Flotte de base',        basic: true,              pro: true },
  { label: 'Factures & Missions',   basic: true,              pro: true },
  { label: 'Carburant & Cartes',    basic: true,              pro: true },
  { label: 'Interventions maintenance', basic: true,          pro: true },
  { label: 'Contrats (leasing/loc.)',basic: false,            pro: true },
  { label: 'Planning multi-véhicule', basic: false,           pro: true },
  { label: 'Gestion RH complète',   basic: false,             pro: true },
  { label: 'Diagnostiques & Entretien planifié', basic: false, pro: true },
  { label: 'Autoroutes & Dépenses', basic: false,             pro: true },
  { label: 'Export Excel / PDF',    basic: false,             pro: true },
  { label: 'Sauvegarde automatique',basic: false,             pro: true },
  { label: 'Support prioritaire 24/7', basic: false,          pro: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-sm font-semibold text-gray-700">{value}</span>;
  }
  return value ? (
    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
      <Check className="w-3.5 h-3.5 text-emerald-600" />
    </div>
  ) : (
    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
      <Lock className="w-3 h-3 text-gray-300" />
    </div>
  );
}

export default function PackPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-6 space-y-8">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-500" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <Crown className="w-32 h-32 text-white" />
        </div>
        <div className="relative px-8 py-7">
          <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Paramètres · Abonnement</p>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Choisissez votre pack</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Vous utilisez actuellement le pack{' '}
            <span className="font-bold text-amber-300">{currentPack.label}</span>. Débloquez toutes les fonctionnalités en passant au pack Pro.
          </p>
        </div>
        <div className="h-1 flex">
          {['bg-indigo-400','bg-indigo-500','bg-violet-400','bg-violet-500','bg-purple-400','bg-purple-500'].map(c => (
            <div key={c} className={`flex-1 ${c}`} />
          ))}
        </div>
      </div>

      {/* ── Pack cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">

        {/* Basic */}
        <div className={`relative rounded-3xl border-2 overflow-hidden shadow-sm transition-all ${
          CURRENT_PACK === 'basic'
            ? 'border-indigo-400 bg-white'
            : 'border-gray-200 bg-white/70'
        }`}>
          {CURRENT_PACK === 'basic' && (
            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Plan actuel
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Pack Basic</h2>
                <p className="text-xs text-gray-400">Pour les petites flottes</p>
              </div>
            </div>

            <div className="mb-5">
              <span className="text-3xl font-black text-gray-900">990 DH</span>
              <span className="text-sm text-gray-400 ml-1">/mois</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { value: '20', label: 'Véhicules' },
                { value: '20', label: 'Chauffeurs' },
                { value: '2',  label: 'Utilisateurs' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-indigo-50 rounded-xl p-2.5 text-center">
                  <p className="text-xl font-black text-indigo-700">{value}</p>
                  <p className="text-[10px] text-indigo-500 font-semibold">{label}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-2 mb-6">
              {PACKS.basic.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {CURRENT_PACK === 'basic' ? (
              <div className="w-full py-3 rounded-xl border-2 border-indigo-200 text-center text-sm font-bold text-indigo-400">
                Plan actuel
              </div>
            ) : (
              <button className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
                Revenir au Basic
              </button>
            )}
          </div>
        </div>

        {/* Pro */}
        <div className={`relative rounded-3xl border-2 overflow-hidden shadow-lg transition-all ${
          CURRENT_PACK === 'pro'
            ? 'border-amber-400 bg-white'
            : 'border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50'
        }`}>
          {/* Popular badge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400" />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
            <Star className="w-2.5 h-2.5" />
            {CURRENT_PACK === 'pro' ? 'Plan actuel' : 'Recommandé'}
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Pack Pro</h2>
                <p className="text-xs text-gray-400">Pour les flottes et équipes avancées</p>
              </div>
            </div>

            <div className="mb-5">
              <span className="text-3xl font-black text-gray-900">2 490 DH</span>
              <span className="text-sm text-gray-400 ml-1">/mois</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { value: '100', label: 'Véhicules' },
                { value: '200', label: 'Chauffeurs' },
                { value: '10',  label: 'Utilisateurs' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-amber-100 rounded-xl p-2.5 text-center">
                  <p className="text-xl font-black text-amber-700">{value}</p>
                  <p className="text-[10px] text-amber-600 font-semibold">{label}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-2 mb-6">
              {PACKS.pro.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {CURRENT_PACK === 'pro' ? (
              <div className="w-full py-3 rounded-xl border-2 border-amber-300 text-center text-sm font-bold text-amber-500">
                Plan actuel
              </div>
            ) : (
              <button
                onClick={() => setContactOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Passer au Pro
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Feature comparison table ────────────────────── */}
      <div className="max-w-4xl">
        <h2 className="text-base font-extrabold text-gray-800 mb-4 uppercase tracking-widest">Comparaison des fonctionnalités</h2>
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 gap-px bg-gray-100">
            <div className="bg-white px-5 py-3.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fonctionnalité</span>
            </div>
            <div className="bg-indigo-50 px-5 py-3.5 flex items-center justify-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Basic</span>
              {CURRENT_PACK === 'basic' && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-0.5" />
              )}
            </div>
            <div className="bg-amber-50 px-5 py-3.5 flex items-center justify-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Pro</span>
              {CURRENT_PACK === 'pro' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5" />
              )}
            </div>
          </div>

          {/* Rows */}
          {FEATURES_COMPARISON.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 gap-px ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              <div className={`px-5 py-3 flex items-center ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <span className="text-sm text-gray-600">{row.label}</span>
              </div>
              <div className={`px-5 py-3 flex items-center justify-center ${i % 2 === 0 ? 'bg-indigo-50/50' : 'bg-indigo-50/30'}`}>
                <FeatureValue value={row.basic} />
              </div>
              <div className={`px-5 py-3 flex items-center justify-center ${i % 2 === 0 ? 'bg-amber-50/50' : 'bg-amber-50/30'}`}>
                <FeatureValue value={row.pro} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact modal ───────────────────────────────── */}
      {contactOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setContactOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Passer au Pack Pro</h3>
                  <p className="text-amber-100 text-xs">Contactez-nous pour activer votre upgrade</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-sm font-bold text-amber-800 mb-1">Pack Pro — 2 490 DH / mois</p>
                <p className="text-xs text-amber-600">100 véhicules · 200 chauffeurs · 10 utilisateurs · Toutes fonctionnalités</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Notre équipe commerciale vous contactera pour finaliser votre upgrade :</p>
                <a href="tel:+212600000000" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Téléphone</p>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700">+212 6 00 00 00 00</p>
                  </div>
                </a>
                <a href="mailto:commercial@arwapark.ma" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Email</p>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700">commercial@arwapark.ma</p>
                  </div>
                </a>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Shield className="w-4 h-4 text-gray-300" />
                <p className="text-xs text-gray-400">Sans engagement · Activation sous 24h · Support dédié</p>
              </div>
              <button
                onClick={() => setContactOpen(false)}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
