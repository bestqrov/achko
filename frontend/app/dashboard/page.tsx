'use client';

import Link from 'next/link';
import {
  Truck, Fuel, Bell, Car, FileText, Wrench, Users,
  ShieldCheck, BookOpen, Flame, Award, Globe, Receipt, Key,
  FileCheck, AlertTriangle, RotateCcw, Gauge, Settings,
  Stethoscope, Package, CreditCard, HeartPulse, GraduationCap,
  Stamp, BookMarked, Umbrella, Navigation, BarChart3, TrendingUp,
  ShoppingCart, Archive, ClipboardList,
} from 'lucide-react';

/* ─── tiny reusable components ──────────────────────── */
function SectionHeader({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function AlertItem({
  icon: Icon, label, count, href, accent,
}: { icon: React.ElementType; label: string; count: number; href: string; accent: string }) {
  return (
    <Link href={href}
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${accent}`} />
        <span className="text-xs text-gray-600 truncate group-hover:text-gray-900">{label}</span>
      </div>
      <span className={`flex-shrink-0 min-w-[1.5rem] text-center text-xs font-bold px-1.5 py-0.5 rounded-full ${
        count > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
      }`}>{count}</span>
    </Link>
  );
}

function KpiCard({ icon: Icon, label, value, sub, accent, bg, href }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  accent: string; bg: string; href: string;
}) {
  return (
    <Link href={href}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition-shadow overflow-hidden group">
      <div className={`flex-shrink-0 rounded-xl p-2.5 ${bg}`}>
        <Icon className={`w-5 h-5 ${accent}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium leading-tight">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: accent.replace('text-[', '').replace(']', '') }} />
    </Link>
  );
}

/* ─── page ───────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="space-y-6">

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
        <KpiCard icon={Truck}      label="Véhicules"       value={0}  href="/dashboard/vehicules"    accent="text-blue-600"   bg="bg-blue-50" />
        <KpiCard icon={Users}      label="Collaborateurs"  value={0}  href="/dashboard/collaborateurs" accent="text-violet-600" bg="bg-violet-50" />
        <KpiCard icon={Fuel}       label="Dépenses carb."  value="0 DH" href="/dashboard/carburant"  accent="text-green-600"  bg="bg-green-50" />
        <KpiCard icon={Wrench}     label="Interventions"   value={0}  href="/dashboard/interventions" accent="text-amber-600"  bg="bg-amber-50" />
        <KpiCard icon={FileText}   label="Factures"        value={0}  href="/dashboard/factures"     accent="text-cyan-600"   bg="bg-cyan-50" />
        <KpiCard icon={Bell}       label="Alertes actives" value={0}  href="#alertes"                accent="text-red-600"    bg="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ══ LEFT COLUMN (2/3) ══ */}
        <div className="xl:col-span-2 space-y-4">

          {/* ── Flotte ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={Truck} title="Flotte" color="bg-blue-500" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { icon: Truck,   label: 'Total véhicules',     count: 0, href: '/dashboard/vehicules' },
                { icon: Settings,label: 'En maintenance',      count: 0, href: '/dashboard/entretien' },
                { icon: RotateCcw,label: 'Remplacement',       count: 0, href: '/dashboard/vehicules-remplacement' },
                { icon: Archive, label: 'Réformés',            count: 0, href: '/dashboard/vehicules-reformes' },
                { icon: Gauge,   label: 'Kilométrages saisis', count: 0, href: '/dashboard/kilometrages' },
                { icon: Car,     label: 'Équipements',         count: 0, href: '/dashboard/equipements-vehicule' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group">
                  <item.icon className="w-5 h-5 text-blue-400 group-hover:text-blue-600" />
                  <span className="text-lg font-bold text-gray-800">{item.count}</span>
                  <span className="text-xs text-gray-500 text-center leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Statistiques Carburant ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={Fuel} title="Statistiques Carburant" color="bg-emerald-500" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total plein',    value: '0 L',   accent: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Coût mensuel',   value: '0 DH',  accent: 'text-teal-600',    bg: 'bg-teal-50' },
                { label: 'Moy. conso.',    value: '0 L/100', accent: 'text-cyan-600',  bg: 'bg-cyan-50' },
                { label: 'Km parcourus',   value: '0 km',  accent: 'text-blue-600',    bg: 'bg-blue-50' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 ${s.bg}`}>
                  <p className={`text-lg font-bold ${s.accent}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Maintenance ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={Wrench} title="Maintenance" color="bg-indigo-500" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { icon: Wrench,      label: 'Interventions',           count: 0, href: '/dashboard/interventions' },
                { icon: Stethoscope, label: 'Diagnostiques',           count: 0, href: '/dashboard/diagnostiques' },
                { icon: Settings,    label: 'Entretiens planifiés',    count: 0, href: '/dashboard/entretien' },
                { icon: ClipboardList,label: "Plans d'entretien",      count: 0, href: '/dashboard/plan-entretien' },
                { icon: TrendingUp,  label: 'Distance parcourue',      count: '0 km', href: '/dashboard/kilometrages' },
                { icon: Gauge,       label: 'Véhicules en panne',      count: 0, href: '/dashboard/interventions' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group">
                  <item.icon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600" />
                  <span className="text-lg font-bold text-gray-800">{item.count}</span>
                  <span className="text-xs text-gray-500 text-center leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Finance / Achats / Stock ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Finance */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <SectionHeader icon={FileText} title="Finance" color="bg-cyan-500" />
              <div className="space-y-1">
                <AlertItem icon={FileText}  label="Factures clients"    count={0} href="/dashboard/factures"        accent="text-cyan-500" />
              </div>
            </div>
            {/* Achats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <SectionHeader icon={ShoppingCart} title="Achats" color="bg-violet-500" />
              <div className="space-y-1">
                <AlertItem icon={FileText}     label="Factures fournisseurs" count={0} href="/dashboard/depenses"   accent="text-violet-500" />
                <AlertItem icon={ClipboardList} label="Bons de commande"     count={0} href="/dashboard/depenses"   accent="text-purple-500" />
              </div>
            </div>
            {/* Stock */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <SectionHeader icon={Package} title="Stock" color="bg-orange-500" />
              <div className="space-y-1">
                <AlertItem icon={AlertTriangle} label="Ruptures stock"       count={0} href="/dashboard/depenses"   accent="text-orange-500" />
                <AlertItem icon={ClipboardList} label="Bons de commande int." count={0} href="/dashboard/depenses"  accent="text-amber-500" />
              </div>
            </div>
          </div>

        </div>

        {/* ══ RIGHT COLUMN (1/3) ══ */}
        <div className="space-y-4" id="alertes">

          {/* ── Alertes — Administratifs ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={Bell} title="Alertes — Administratifs" color="bg-red-500" />
            <div className="space-y-0.5">
              <AlertItem icon={Car}          label="Cartes grises"               count={0} href="/dashboard/cartes-grises"              accent="text-blue-500" />
              <AlertItem icon={Settings}     label="Visites techniques"           count={0} href="/dashboard/visites-techniques"         accent="text-amber-500" />
              <AlertItem icon={BookOpen}     label="Carnets métrologiques"        count={0} href="/dashboard/carnets-metrologiques"      accent="text-teal-500" />
              <AlertItem icon={ShieldCheck}  label="Vignettes"                   count={0} href="/dashboard/vignettes"                  accent="text-green-500" />
              <AlertItem icon={ShieldCheck}  label="Assurances"                  count={0} href="/dashboard/assurances"                 accent="text-indigo-500" />
              <AlertItem icon={Receipt}      label="Taxes"                       count={0} href="/dashboard/taxes"                      accent="text-violet-500" />
              <AlertItem icon={FileCheck}    label="Autorisations de circulation" count={0} href="/dashboard/autorisations"             accent="text-cyan-500" />
              <AlertItem icon={Key}          label="Permis de circulation"        count={0} href="/dashboard/permis-circulation"         accent="text-orange-500" />
              <AlertItem icon={Flame}        label="Extincteurs"                 count={0} href="/dashboard/extincteurs"                accent="text-red-500" />
              <AlertItem icon={Award}        label="Agréments"                   count={0} href="/dashboard/agrements"                  accent="text-yellow-600" />
              <AlertItem icon={Globe}        label="Assurances Internationales"  count={0} href="/dashboard/assurances-internationales" accent="text-blue-400" />
              <AlertItem icon={Archive}      label="Réforme"                     count={0} href="/dashboard/vehicules-reformes"         accent="text-gray-500" />
              <AlertItem icon={RotateCcw}    label="Fin mise en circulation"     count={0} href="/dashboard/vehicules"                  accent="text-rose-500" />
            </div>
          </div>

          {/* ── Alertes — Location ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={AlertTriangle} title="Alertes location" color="bg-amber-500" />
            <div className="space-y-0.5">
              <AlertItem icon={Gauge}        label="Plafond kilométrique"  count={0} href="/dashboard/contrats-location" accent="text-amber-500" />
            </div>
          </div>

          {/* ── Alertes — Techniques ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={Wrench} title="Alertes techniques" color="bg-orange-500" />
            <div className="space-y-0.5">
              <AlertItem icon={Gauge}        label="Saisie du kilométrage"  count={0} href="/dashboard/kilometrages"   accent="text-orange-500" />
              <AlertItem icon={Truck}        label="Véhicules en panne"     count={0} href="/dashboard/interventions"  accent="text-red-500" />
              <AlertItem icon={TrendingUp}   label="Opérations techniques KM" count={0} href="/dashboard/entretien"   accent="text-amber-600" />
              <AlertItem icon={Navigation}   label="Pneumatique"            count={0} href="/dashboard/entretien"      accent="text-blue-500" />
            </div>
          </div>

          {/* ── Consommations ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={Fuel} title="Consommations" color="bg-emerald-500" />
            <div className="space-y-0.5">
              <AlertItem icon={Fuel}         label="Citerne"               count={0} href="/dashboard/carburant"       accent="text-emerald-500" />
            </div>
          </div>

          {/* ── Collaborateurs ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <SectionHeader icon={Users} title="Collaborateurs" color="bg-violet-500" />
            <div className="space-y-0.5">
              <AlertItem icon={Key}          label="Validité permis"         count={0} href="/dashboard/collaborateurs"  accent="text-blue-500" />
              <AlertItem icon={HeartPulse}   label="Visite médicale"         count={0} href="/dashboard/visite-medicale" accent="text-rose-500" />
              <AlertItem icon={GraduationCap}label="Formations collaborateur" count={0} href="/dashboard/formations"     accent="text-violet-500" />
              <AlertItem icon={Umbrella}     label="Contrats collaborateur"  count={0} href="/dashboard/contrats"        accent="text-indigo-500" />
              <AlertItem icon={BookMarked}   label="Passeports"             count={0} href="/dashboard/passeports"       accent="text-teal-500" />
              <AlertItem icon={Stamp}        label="Visas"                  count={0} href="/dashboard/visas"            accent="text-cyan-500" />
              <AlertItem icon={ShieldCheck}  label="Assurance collaborateur" count={0} href="/dashboard/collaborateurs"  accent="text-green-500" />
              <AlertItem icon={FileCheck}    label="Autorisations d'échantillon" count={0} href="/dashboard/autorisations" accent="text-amber-500" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
