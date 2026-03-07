'use client';

import Link from 'next/link';
import {
  Truck, Fuel, Bell, Car, FileText, Wrench, Users,
  ShieldCheck, BookOpen, Flame, Award, Globe, Receipt, Key,
  FileCheck, AlertTriangle, RotateCcw, Gauge, Settings,
  Stethoscope, Package, HeartPulse, GraduationCap,
  Stamp, BookMarked, Umbrella, Navigation, BarChart3, TrendingUp,
  ShoppingCart, ClipboardList, Activity, CheckCircle2, Clock, Zap,
} from 'lucide-react';

/* ─── SVG Donut Chart ─────────────────────────────────── */
function DonutChart({ segments, size = 80 }: {
  segments: { value: number; color: string }[];
  size?: number;
}) {
  const r = (size - 18) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={9}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset} />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r={r - 7} fill="white" />
    </svg>
  );
}

/* ─── SVG Mini Bar Chart ─────────────────────────────── */
function MiniBar({ values, color = '#3b82f6' }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-px" style={{ height: 36 }}>
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm"
          style={{
            height: `${Math.max(3, (v / max) * 36)}px`,
            background: color,
            opacity: 0.55 + (i / values.length) * 0.45,
          }} />
      ))}
    </div>
  );
}

/* ─── SVG Spark Line ──────────────────────────────────── */
function Spark({ values, color = '#10b981', w = 70, h = 22 }: {
  values: number[]; color?: string; w?: number; h?: number;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8}
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Progress bar row ────────────────────────────────── */
function StatusRow({ label, value, pct, color }: {
  label: string; value: number | string; pct: number; color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-500 w-[78px] flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-bold text-gray-700 w-6 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

/* ─── KPI Card (top strip) ───────────────────────────── */
function KpiCard({ icon: Icon, label, value, trend, color, bg, href }: {
  icon: React.ElementType; label: string; value: string | number;
  trend?: number; color: string; bg: string; href: string;
}) {
  return (
    <Link href={href}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className={`p-1.5 rounded-xl ${bg}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            trend > 0 ? 'bg-emerald-50 text-emerald-600' :
            trend < 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
          }`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '—'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 font-medium truncate">{label}</p>
      </div>
    </Link>
  );
}

/* ─── Section Block ──────────────────────────────────── */
function Block({ title, icon: Icon, color, headBg, border, children }: {
  title: string; icon: React.ElementType;
  color: string; headBg: string; border: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${border}`}>
      <div className={`flex items-center gap-2 px-4 py-2 border-b ${border} ${headBg}`}>
        <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${color}`}>{title}</span>
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}

/* ─── Alert Row ──────────────────────────────────────── */
function AlertRow({ icon: Icon, label, count, href, dot }: {
  icon: React.ElementType; label: string; count: number | string;
  href: string; dot: string;
}) {
  const has = Number(count) > 0;
  return (
    <Link href={href}
      className="flex items-center justify-between gap-1.5 px-1.5 py-1 rounded-lg hover:bg-gray-50 transition group">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
        <Icon className="w-3 h-3 text-gray-400 flex-shrink-0 group-hover:text-gray-600" />
        <span className="text-[11px] text-gray-600 truncate group-hover:text-gray-800">{label}</span>
      </div>
      <span className={`flex-shrink-0 text-[10px] font-bold min-w-[22px] text-center px-1.5 py-0.5 rounded-full ${
        has ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
      }`}>{count}</span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // data hooks for analytics
  const { data: vehData, refetch: refetchVeh } = useResource<any>('vehicles');
  const { data: collabData } = useResource<any>('users');

  // calculate fleet segments by status
  const fleetSegments = [
    { value: vehData?.data.filter((v:any)=>v.status==='available').length || 0, color: '#22c55e' },
    { value: vehData?.data.filter((v:any)=>v.status==='in_use').length || 0, color: '#f59e0b' },
    { value: vehData?.data.filter((v:any)=>v.status==='maintenance').length || 0, color: '#ef4444' },
    { value: vehData?.data.filter((v:any)=>v.status==='retired').length || 0, color: '#94a3b8' },
  ];

  const fuelBars  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const costSpark = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  return (
    /* Full-height flex column — each inner col scrolls independently */
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 96px)' }}>

      {/* ── Slim top bar ── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-base font-extrabold text-gray-800 tracking-tight">Tableau de bord</h1>
          <p className="text-[11px] text-gray-400 capitalize mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          Données en temps réel
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-shrink-0">
        <KpiCard icon={Truck}    label="Véhicules"        value={vehData?.total ?? 0}        trend={0}   color="text-blue-600"   bg="bg-blue-50"   href="/dashboard/vehicules" />
        <KpiCard icon={Users}    label="Collaborateurs"   value={collabData?.total ?? 0}    trend={0}   color="text-violet-600" bg="bg-violet-50" href="/dashboard/collaborateurs" />
        <KpiCard icon={Fuel}     label="Carburant (mois)" value="0 DH"      trend={0}   color="text-emerald-600" bg="bg-emerald-50" href="/dashboard/carburant" />
        <KpiCard icon={Wrench}   label="Interventions"    value={0}         trend={0}   color="text-amber-600"  bg="bg-amber-50"  href="/dashboard/interventions" />
        <KpiCard icon={FileText} label="Factures"         value={0}         trend={0}   color="text-cyan-600"   bg="bg-cyan-50"   href="/dashboard/factures" />
        <KpiCard icon={Bell}     label="Alertes actives"  value={0}                     color="text-red-600"    bg="bg-red-50"    href="#alertes" />
      </div>

      {/* ── Dual scroll columns ── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">

        {/* ── LEFT — main content ── */}
        <div className="overflow-y-auto space-y-3.5 pr-0.5 pb-2">

          {/* Fleet status */}
          <Block title="État de la flotte" icon={Truck}
            color="text-blue-600" headBg="bg-blue-50/70" border="border-blue-100">
            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative">
                  <DonutChart segments={fleetSegments} size={90} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-lg font-extrabold text-gray-800">0</span>
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5">Total</span>
              </div>
              <div className="flex-1 space-y-2 min-w-[140px]">
                {[
                  { label: 'Disponibles', value: 0, pct: 0, color: '#22c55e' },
                  { label: 'En mission',  value: 0, pct: 0, color: '#f59e0b' },
                  { label: 'En panne',    value: 0, pct: 0, color: '#ef4444' },
                  { label: 'Réformés',    value: 0, pct: 0, color: '#94a3b8' },
                ].map(r => <StatusRow key={r.label} {...r} />)}
              </div>
              <div className="grid grid-cols-2 gap-1.5 content-start flex-shrink-0">
                {[
                  { icon: Settings,  label: 'Entretien',    href: '/dashboard/entretien',              color: 'text-indigo-500', bg: 'bg-indigo-50' },
                  { icon: RotateCcw, label: 'Remplacement', href: '/dashboard/vehicules-remplacement', color: 'text-teal-500',   bg: 'bg-teal-50' },
                  { icon: Gauge,     label: 'Kilométrage',  href: '/dashboard/kilometrages',           color: 'text-blue-500',   bg: 'bg-blue-50' },
                  { icon: Car,       label: 'Équipements',  href: '/dashboard/equipements-vehicule',   color: 'text-violet-500', bg: 'bg-violet-50' },
                ].map(l => (
                  <Link key={l.label} href={l.href}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition">
                    <div className={`p-1 rounded-md ${l.bg}`}>
                      <l.icon className={`w-3 h-3 ${l.color}`} />
                    </div>
                    <span className="text-[10px] text-gray-600 truncate">{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Block>

          {/* Carburant */}
          <Block title="Consommation carburant" icon={Fuel}
            color="text-emerald-600" headBg="bg-emerald-50/70" border="border-emerald-100">
            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex-1 min-w-[180px]">
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-[10px] text-gray-400">Litres / mois (12 mois)</span>
                  <div className="flex items-center gap-1">
                    <Spark values={costSpark} color="#10b981" w={56} h={18} />
                    <span className="text-[10px] text-gray-400 font-bold">— 0%</span>
                  </div>
                </div>
                <MiniBar values={fuelBars} color="#10b981" />
                <div className="flex justify-between mt-1">
                  {['J','F','M','A','M','J','J','A','S','O','N','D'].map(m => (
                    <span key={m} className="text-[9px] text-gray-300 flex-1 text-center">{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-1.5 min-w-[108px]">
                {[
                  { label: 'Total litres',  value: '0 L',      color: '#10b981' },
                  { label: 'Coût mensuel',  value: '0 DH',     color: '#0d9488' },
                  { label: 'Moy. conso.',   value: '0 L/100',  color: '#0891b2' },
                  { label: 'Km total',      value: '0 km',     color: '#2563eb' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-[10px] text-gray-500">{s.label}</span>
                    <span className="text-[11px] font-extrabold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Block>

          {/* Maintenance */}
          <Block title="Maintenance" icon={Wrench}
            color="text-indigo-600" headBg="bg-indigo-50/70" border="border-indigo-100">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { icon: Wrench,        label: 'Interventions', count: 0,   href: '/dashboard/interventions',  bg: 'bg-indigo-50', color: 'text-indigo-500' },
                { icon: Stethoscope,   label: 'Diagnostiques', count: 0,   href: '/dashboard/diagnostiques',  bg: 'bg-purple-50', color: 'text-purple-500' },
                { icon: Settings,      label: 'Entretiens',    count: 0,   href: '/dashboard/entretien',      bg: 'bg-blue-50',   color: 'text-blue-500' },
                { icon: ClipboardList, label: 'Plans',         count: 0,   href: '/dashboard/plan-entretien', bg: 'bg-teal-50',   color: 'text-teal-500' },
                { icon: TrendingUp,    label: 'Km moyen',      count: '0', href: '/dashboard/kilometrages',   bg: 'bg-cyan-50',   color: 'text-cyan-500' },
                { icon: AlertTriangle, label: 'En panne',      count: 0,   href: '/dashboard/interventions',  bg: 'bg-red-50',    color: 'text-red-500' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all">
                  <div className={`p-1.5 rounded-lg ${item.bg}`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-base font-extrabold text-gray-800">{item.count}</span>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </Block>

          {/* Finance / Achats / Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: 'Finance', icon: FileText, color: 'text-cyan-600', headBg: 'bg-cyan-50/70', border: 'border-cyan-100',
                items: [
                  { icon: FileText,  label: 'Factures clients', count: 0, href: '/dashboard/factures',      dot: 'bg-cyan-400' },
                  { icon: Receipt,  label: 'Avoirs',           count: 0,  href: '/dashboard/facture-avoir', dot: 'bg-sky-400' },
                ],
              },
              {
                title: 'Achats', icon: ShoppingCart, color: 'text-violet-600', headBg: 'bg-violet-50/70', border: 'border-violet-100',
                items: [
                  { icon: FileText,      label: 'Fact. fournisseurs', count: 0, href: '/dashboard/depenses', dot: 'bg-violet-400' },
                  { icon: ClipboardList, label: 'Bons de commande',   count: 0, href: '/dashboard/depenses', dot: 'bg-purple-400' },
                ],
              },
              {
                title: 'Stock', icon: Package, color: 'text-orange-600', headBg: 'bg-orange-50/70', border: 'border-orange-100',
                items: [
                  { icon: AlertTriangle, label: 'Ruptures stock', count: 0, href: '/dashboard/depenses', dot: 'bg-orange-400' },
                  { icon: ClipboardList, label: 'Bons int.',      count: 0, href: '/dashboard/depenses', dot: 'bg-amber-400' },
                ],
              },
            ].map(sec => (
              <Block key={sec.title} title={sec.title} icon={sec.icon}
                color={sec.color} headBg={sec.headBg} border={sec.border}>
                <div className="space-y-0.5">
                  {sec.items.map(it => <AlertRow key={it.label} {...it} />)}
                </div>
              </Block>
            ))}
          </div>

          {/* Activity feed */}
          <Block title="Activité récente" icon={Activity}
            color="text-sky-600" headBg="bg-sky-50/70" border="border-sky-100">
            <div className="space-y-1">
              {[
                { icon: CheckCircle2, label: 'Mission TNG-CASA terminée',      time: 'il y a 2h',  color: 'text-emerald-500' },
                { icon: Wrench,       label: 'Intervention véhicule AB-456',   time: 'il y a 4h',  color: 'text-amber-500' },
                { icon: Fuel,         label: 'Plein réalisé — 120 L',          time: 'il y a 6h',  color: 'text-blue-500' },
                { icon: AlertTriangle,label: 'Alerte vignette expirée (×3)',   time: 'il y a 1j',  color: 'text-red-500' },
                { icon: Zap,          label: 'Entretien planifié — 5 000 km',  time: 'il y a 2j',  color: 'text-violet-500' },
              ].map((ev, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition">
                  <ev.icon className={`w-3.5 h-3.5 flex-shrink-0 ${ev.color}`} />
                  <span className="text-[11px] text-gray-700 flex-1">{ev.label}</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
                    <Clock className="w-2.5 h-2.5" />{ev.time}
                  </span>
                </div>
              ))}
            </div>
          </Block>

        </div>

        {/* ── RIGHT — alerts panel (scrollable) ── */}
        <div className="overflow-y-auto space-y-3 pb-2" id="alertes">

          <div className="flex items-center gap-2 px-1">
            <Bell className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 flex-1">
              Alertes &amp; Expirations
            </span>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">0</span>
          </div>

          <Block title="Administratifs" icon={ShieldCheck}
            color="text-red-500" headBg="bg-red-50/60" border="border-red-100">
            <div className="space-y-0.5">
              <AlertRow icon={Car}         label="Cartes grises"               count={0} href="/dashboard/cartes-grises"              dot="bg-blue-400" />
              <AlertRow icon={Settings}    label="Visites techniques"           count={0} href="/dashboard/visites-techniques"         dot="bg-amber-400" />
              <AlertRow icon={BookOpen}    label="Carnets métrologiques"        count={0} href="/dashboard/carnets-metrologiques"      dot="bg-teal-400" />
              <AlertRow icon={ShieldCheck} label="Vignettes"                   count={0} href="/dashboard/vignettes"                  dot="bg-green-400" />
              <AlertRow icon={ShieldCheck} label="Assurances"                  count={0} href="/dashboard/assurances"                 dot="bg-indigo-400" />
              <AlertRow icon={Receipt}     label="Taxes"                       count={0} href="/dashboard/taxes"                      dot="bg-violet-400" />
              <AlertRow icon={FileCheck}   label="Autorisations"               count={0} href="/dashboard/autorisations"              dot="bg-cyan-400" />
              <AlertRow icon={Key}         label="Permis circulation"           count={0} href="/dashboard/permis-circulation"         dot="bg-orange-400" />
              <AlertRow icon={Flame}       label="Extincteurs"                 count={0} href="/dashboard/extincteurs"                dot="bg-red-400" />
              <AlertRow icon={Award}       label="Agréments"                   count={0} href="/dashboard/agrements"                  dot="bg-yellow-500" />
              <AlertRow icon={Globe}       label="Assurances intern."          count={0} href="/dashboard/assurances-internationales" dot="bg-blue-300" />
            </div>
          </Block>

          <Block title="Location" icon={AlertTriangle}
            color="text-amber-600" headBg="bg-amber-50/60" border="border-amber-100">
            <div className="space-y-0.5">
              <AlertRow icon={Gauge}     label="Plafond kilométrique"    count={0} href="/dashboard/contrats-location" dot="bg-amber-400" />
              <AlertRow icon={RotateCcw} label="Fin mise en circulation" count={0} href="/dashboard/vehicules"         dot="bg-rose-400" />
            </div>
          </Block>

          <Block title="Techniques" icon={Wrench}
            color="text-orange-600" headBg="bg-orange-50/60" border="border-orange-100">
            <div className="space-y-0.5">
              <AlertRow icon={Gauge}      label="Saisie kilométrage"  count={0} href="/dashboard/kilometrages"  dot="bg-orange-400" />
              <AlertRow icon={Truck}      label="Véhicules en panne"  count={0} href="/dashboard/interventions" dot="bg-red-400" />
              <AlertRow icon={TrendingUp} label="Opérations KM"       count={0} href="/dashboard/entretien"     dot="bg-amber-400" />
              <AlertRow icon={Navigation} label="Pneumatique"         count={0} href="/dashboard/entretien"     dot="bg-blue-400" />
            </div>
          </Block>

          <Block title="Consommations" icon={Fuel}
            color="text-emerald-600" headBg="bg-emerald-50/60" border="border-emerald-100">
            <div className="space-y-0.5">
              <AlertRow icon={Fuel} label="Citerne" count={0} href="/dashboard/carburant" dot="bg-emerald-400" />
            </div>
          </Block>

          <Block title="Collaborateurs" icon={Users}
            color="text-violet-600" headBg="bg-violet-50/60" border="border-violet-100">
            <div className="space-y-0.5">
              <AlertRow icon={Key}           label="Validité permis"         count={0} href="/dashboard/collaborateurs"  dot="bg-blue-400" />
              <AlertRow icon={HeartPulse}    label="Visite médicale"         count={0} href="/dashboard/visite-medicale" dot="bg-rose-400" />
              <AlertRow icon={GraduationCap} label="Formations"              count={0} href="/dashboard/formations"      dot="bg-violet-400" />
              <AlertRow icon={Umbrella}      label="Contrats"                count={0} href="/dashboard/contrats"        dot="bg-indigo-400" />
              <AlertRow icon={BookMarked}    label="Passeports"              count={0} href="/dashboard/passeports"      dot="bg-teal-400" />
              <AlertRow icon={Stamp}         label="Visas"                   count={0} href="/dashboard/visas"           dot="bg-cyan-400" />
              <AlertRow icon={ShieldCheck}   label="Assurance collaborateur" count={0} href="/dashboard/collaborateurs"  dot="bg-green-400" />
            </div>
          </Block>

        </div>
      </div>
    </div>
  );
}

