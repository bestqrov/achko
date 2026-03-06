'use client';

import Link from 'next/link';
import {
  Truck, Fuel, Bell, Car, FileText, Wrench, Users,
  ShieldCheck, BookOpen, Flame, Award, Globe, Receipt, Key,
  FileCheck, AlertTriangle, RotateCcw, Gauge, Settings,
  Stethoscope, Package, HeartPulse, GraduationCap,
  Stamp, BookMarked, Umbrella, Navigation, BarChart3, TrendingUp,
  ShoppingCart, Archive, ClipboardList,
} from 'lucide-react';

/* ─── SectionCard — card with colored left edge ──────── */
function SectionCard({ children, edge, className = '' }: {
  children: React.ReactNode; edge: string; className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 ${className}`}
      style={{ borderLeft: `4px solid ${edge}` }}
    >
      <div className="p-3.5">{children}</div>
    </div>
  );
}

/* ─── SectionHeader — compact ────────────────────────── */
function SectionHeader({ icon: Icon, title, bg }: {
  icon: React.ElementType; title: string; bg: string;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5">
      <div className={`p-1 rounded-md ${bg} flex-shrink-0`}>
        <Icon className="w-3 h-3 text-white" />
      </div>
      <h3 className="text-[11px] font-extrabold text-gray-600 uppercase tracking-widest leading-none truncate">
        {title}
      </h3>
    </div>
  );
}

/* ─── AlertItem ──────────────────────────────────────── */
function AlertItem({ icon: Icon, label, count, href, accent }: {
  icon: React.ElementType; label: string; count: number | string;
  href: string; accent: string;
}) {
  const hasAlert = Number(count) > 0;
  return (
    <Link href={href}
      className="flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-1.5 min-w-0">
        <Icon className={`w-3 h-3 flex-shrink-0 ${accent}`} />
        <span className="text-[11px] text-gray-600 truncate group-hover:text-gray-900 leading-tight">{label}</span>
      </div>
      <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
        hasAlert ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
      }`}>{count}</span>
    </Link>
  );
}

/* ─── KpiCard ────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, accent, bg, edge, href }: {
  icon: React.ElementType; label: string; value: string | number;
  accent: string; bg: string; edge: string; href: string;
}) {
  return (
    <Link href={href}
      className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex items-start gap-3 p-3.5 group"
      style={{ borderLeft: `4px solid ${edge}` }}>
      <div className={`flex-shrink-0 rounded-xl p-2 ${bg}`}>
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-gray-500 font-semibold leading-tight truncate">{label}</p>
        <p className="text-lg font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
      </div>
    </Link>
  );
}

/* ─── TileGrid item ──────────────────────────────────── */
function Tile({ icon: Icon, label, count, href, iconCls, hoverBorder, hoverBg }: {
  icon: React.ElementType; label: string; count: number | string;
  href: string; iconCls: string; hoverBorder: string; hoverBg: string;
}) {
  return (
    <Link href={href}
      className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-gray-100 transition-all group hover:${hoverBorder} hover:${hoverBg}`}>
      <Icon className={`w-4 h-4 ${iconCls}`} />
      <span className="text-base font-bold text-gray-800">{count}</span>
      <span className="text-[10px] text-gray-500 text-center leading-tight">{label}</span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#1d4ed8 75%,#3b82f6 100%)' }}>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
            <BarChart3 className="w-32 h-32 text-white" strokeWidth={0.6} />
          </div>
          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/15 rounded-xl p-2.5 ring-1 ring-white/25">
              <BarChart3 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Tableau de bord</h2>
              <p className="text-blue-200 text-xs mt-0.5">Vue analytique — ArwaPark Fleet Management</p>
            </div>
          </div>
          <div className="z-10 text-xs text-blue-200 font-medium hidden sm:block">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div className="flex h-1">
          {['#0f172a','#1e3a5f','#1e40af','#1d4ed8','#2563eb','#3b82f6'].map((c,i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ══ TOP KPI STRIP ══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={Truck}    label="Véhicules"       value={0}    href="/dashboard/vehicules"      accent="text-blue-600"   bg="bg-blue-50"   edge="#3b82f6" />
        <KpiCard icon={Users}    label="Collaborateurs"  value={0}    href="/dashboard/collaborateurs"  accent="text-violet-600" bg="bg-violet-50" edge="#7c3aed" />
        <KpiCard icon={Fuel}     label="Dépenses carb."  value="0 DH" href="/dashboard/carburant"       accent="text-green-600"  bg="bg-green-50"  edge="#10b981" />
        <KpiCard icon={Wrench}   label="Interventions"   value={0}    href="/dashboard/interventions"   accent="text-amber-600"  bg="bg-amber-50"  edge="#f59e0b" />
        <KpiCard icon={FileText} label="Factures"        value={0}    href="/dashboard/factures"        accent="text-cyan-600"   bg="bg-cyan-50"   edge="#06b6d4" />
        <KpiCard icon={Bell}     label="Alertes actives" value={0}    href="#alertes"                   accent="text-red-600"    bg="bg-red-50"    edge="#ef4444" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ══ LEFT COLUMN ══ */}
        <div className="xl:col-span-2 space-y-4">

          {/* Flotte */}
          <SectionCard edge="#3b82f6">
            <SectionHeader icon={Truck} title="Flotte" bg="bg-blue-500" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { icon: Truck,      label: 'Véhicules',    count: 0, href: '/dashboard/vehicules' },
                { icon: Settings,   label: 'Maintenance',  count: 0, href: '/dashboard/entretien' },
                { icon: RotateCcw,  label: 'Remplacement', count: 0, href: '/dashboard/vehicules-remplacement' },
                { icon: Archive,    label: 'Réformés',     count: 0, href: '/dashboard/vehicules-reformes' },
                { icon: Gauge,      label: 'Kilométrages', count: 0, href: '/dashboard/kilometrages' },
                { icon: Car,        label: 'Équipements',  count: 0, href: '/dashboard/equipements-vehicule' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                  <item.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                  <span className="text-base font-bold text-gray-800">{item.count}</span>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Statistiques Carburant */}
          <SectionCard edge="#10b981">
            <SectionHeader icon={Fuel} title="Statistiques Carburant" bg="bg-emerald-500" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Total plein',  value: '0 L',     color: '#10b981', bg: 'bg-emerald-50' },
                { label: 'Coût mensuel', value: '0 DH',    color: '#0d9488', bg: 'bg-teal-50' },
                { label: 'Moy. conso.',  value: '0 L/100', color: '#0891b2', bg: 'bg-cyan-50' },
                { label: 'Km parcourus', value: '0 km',    color: '#2563eb', bg: 'bg-blue-50' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-2.5 ${s.bg}`}>
                  <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Maintenance */}
          <SectionCard edge="#6366f1">
            <SectionHeader icon={Wrench} title="Maintenance" bg="bg-indigo-500" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { icon: Wrench,       label: 'Interventions',  count: 0,      href: '/dashboard/interventions' },
                { icon: Stethoscope,  label: 'Diagnostiques',  count: 0,      href: '/dashboard/diagnostiques' },
                { icon: Settings,     label: 'Entretiens',     count: 0,      href: '/dashboard/entretien' },
                { icon: ClipboardList,label: "Plans entretien",count: 0,      href: '/dashboard/plan-entretien' },
                { icon: TrendingUp,   label: 'Distance',       count: '0 km', href: '/dashboard/kilometrages' },
                { icon: Gauge,        label: 'En panne',       count: 0,      href: '/dashboard/interventions' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                  <item.icon className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600" />
                  <span className="text-base font-bold text-gray-800">{item.count}</span>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Finance / Achats / Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SectionCard edge="#06b6d4">
              <SectionHeader icon={FileText} title="Finance" bg="bg-cyan-500" />
              <AlertItem icon={FileText} label="Factures clients" count={0} href="/dashboard/factures" accent="text-cyan-500" />
            </SectionCard>
            <SectionCard edge="#7c3aed">
              <SectionHeader icon={ShoppingCart} title="Achats" bg="bg-violet-500" />
              <AlertItem icon={FileText}      label="Factures fournisseurs" count={0} href="/dashboard/depenses" accent="text-violet-500" />
              <AlertItem icon={ClipboardList} label="Bons de commande"     count={0} href="/dashboard/depenses" accent="text-purple-500" />
            </SectionCard>
            <SectionCard edge="#f97316">
              <SectionHeader icon={Package} title="Stock" bg="bg-orange-500" />
              <AlertItem icon={AlertTriangle} label="Ruptures stock"        count={0} href="/dashboard/depenses" accent="text-orange-500" />
              <AlertItem icon={ClipboardList} label="Bons de commande int." count={0} href="/dashboard/depenses" accent="text-amber-500" />
            </SectionCard>
          </div>

        </div>

        {/* ══ RIGHT COLUMN — Alertes ══ */}
        <div className="space-y-3" id="alertes">

          {/* Alertes — Administratifs */}
          <SectionCard edge="#ef4444">
            <SectionHeader icon={Bell} title="Alertes — Administratifs" bg="bg-red-500" />
            <div className="space-y-0">
              <AlertItem icon={Car}         label="Cartes grises"                count={0} href="/dashboard/cartes-grises"              accent="text-blue-500" />
              <AlertItem icon={Settings}    label="Visites techniques"            count={0} href="/dashboard/visites-techniques"         accent="text-amber-500" />
              <AlertItem icon={BookOpen}    label="Carnets métrologiques"         count={0} href="/dashboard/carnets-metrologiques"      accent="text-teal-500" />
              <AlertItem icon={ShieldCheck} label="Vignettes"                    count={0} href="/dashboard/vignettes"                  accent="text-green-500" />
              <AlertItem icon={ShieldCheck} label="Assurances"                   count={0} href="/dashboard/assurances"                 accent="text-indigo-500" />
              <AlertItem icon={Receipt}     label="Taxes"                        count={0} href="/dashboard/taxes"                      accent="text-violet-500" />
              <AlertItem icon={FileCheck}   label="Autorisations circulation"    count={0} href="/dashboard/autorisations"              accent="text-cyan-500" />
              <AlertItem icon={Key}         label="Permis de circulation"         count={0} href="/dashboard/permis-circulation"         accent="text-orange-500" />
              <AlertItem icon={Flame}       label="Extincteurs"                  count={0} href="/dashboard/extincteurs"                accent="text-red-500" />
              <AlertItem icon={Award}       label="Agréments"                    count={0} href="/dashboard/agrements"                  accent="text-yellow-600" />
              <AlertItem icon={Globe}       label="Assurances Internationales"   count={0} href="/dashboard/assurances-internationales" accent="text-blue-400" />
              <AlertItem icon={Archive}     label="Réforme"                      count={0} href="/dashboard/vehicules-reformes"         accent="text-gray-500" />
              <AlertItem icon={RotateCcw}   label="Fin mise en circulation"      count={0} href="/dashboard/vehicules"                  accent="text-rose-500" />
            </div>
          </SectionCard>

          {/* Alertes — Location */}
          <SectionCard edge="#f59e0b">
            <SectionHeader icon={AlertTriangle} title="Alertes location" bg="bg-amber-500" />
            <AlertItem icon={Gauge} label="Plafond kilométrique" count={0} href="/dashboard/contrats-location" accent="text-amber-500" />
          </SectionCard>

          {/* Alertes — Techniques */}
          <SectionCard edge="#f97316">
            <SectionHeader icon={Wrench} title="Alertes techniques" bg="bg-orange-500" />
            <AlertItem icon={Gauge}       label="Saisie du kilométrage"   count={0} href="/dashboard/kilometrages"  accent="text-orange-500" />
            <AlertItem icon={Truck}       label="Véhicules en panne"      count={0} href="/dashboard/interventions" accent="text-red-500" />
            <AlertItem icon={TrendingUp}  label="Opérations techniques KM"count={0} href="/dashboard/entretien"    accent="text-amber-600" />
            <AlertItem icon={Navigation}  label="Pneumatique"             count={0} href="/dashboard/entretien"     accent="text-blue-500" />
          </SectionCard>

          {/* Consommations */}
          <SectionCard edge="#10b981">
            <SectionHeader icon={Fuel} title="Consommations" bg="bg-emerald-500" />
            <AlertItem icon={Fuel} label="Citerne" count={0} href="/dashboard/carburant" accent="text-emerald-500" />
          </SectionCard>

          {/* Collaborateurs */}
          <SectionCard edge="#7c3aed">
            <SectionHeader icon={Users} title="Collaborateurs" bg="bg-violet-500" />
            <AlertItem icon={Key}           label="Validité permis"            count={0} href="/dashboard/collaborateurs"  accent="text-blue-500" />
            <AlertItem icon={HeartPulse}    label="Visite médicale"            count={0} href="/dashboard/visite-medicale" accent="text-rose-500" />
            <AlertItem icon={GraduationCap} label="Formations collaborateur"   count={0} href="/dashboard/formations"      accent="text-violet-500" />
            <AlertItem icon={Umbrella}      label="Contrats collaborateur"     count={0} href="/dashboard/contrats"        accent="text-indigo-500" />
            <AlertItem icon={BookMarked}    label="Passeports"                 count={0} href="/dashboard/passeports"      accent="text-teal-500" />
            <AlertItem icon={Stamp}         label="Visas"                      count={0} href="/dashboard/visas"           accent="text-cyan-500" />
            <AlertItem icon={ShieldCheck}   label="Assurance collaborateur"    count={0} href="/dashboard/collaborateurs"  accent="text-green-500" />
            <AlertItem icon={FileCheck}     label="Autorisations échantillon"  count={0} href="/dashboard/autorisations"   accent="text-amber-500" />
          </SectionCard>

        </div>
      </div>
    </div>
  );
}


