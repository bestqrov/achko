'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/helpers';
import {
  ChevronDown, ChevronRight, ChevronUp, LogOut, X, Truck,
  Gauge, Clock, FileSignature, MapPin, Package, RotateCcw, Cpu, Archive,
  Truck as _Truck, FileText, FileX, ClipboardList, Calendar, Navigation,
  Wrench, Stethoscope, Settings, Fuel, CreditCard, BarChart3,
  DollarSign, Shield, Car, CheckCircle, Receipt, Award,
  Key, FileCheck, Globe, BookOpen, Flame, AlertTriangle,
  Briefcase, Users, Users2, UserX, Umbrella, GraduationCap, HeartPulse, Stamp, BookMarked,
  Menu, Building2, UserCog, Palette, HardDrive,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth/authStore';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    section: 'ADMINISTRATIF',
    items: [
      { label: 'Vignettes', href: '/dashboard/vignettes', icon: Shield },
      { label: 'Cartes Grises', href: '/dashboard/cartes-grises', icon: Car },
      { label: 'Visites Techniques', href: '/dashboard/visites-techniques', icon: CheckCircle },
      { label: 'Taxes', href: '/dashboard/taxes', icon: Receipt },
      { label: 'Agréments', href: '/dashboard/agrements', icon: Award },
      { label: 'Permis de Circulation', href: '/dashboard/permis-circulation', icon: Key },
      { label: 'Autorisations', href: '/dashboard/autorisations', icon: FileCheck },
      { label: 'Assurances', href: '/dashboard/assurances', icon: Shield },
      { label: 'Assurances Intl.', href: '/dashboard/assurances-internationales', icon: Globe },
      { label: 'Carnets Métro.', href: '/dashboard/carnets-metrologiques', icon: BookOpen },
      { label: 'Extincteurs', href: '/dashboard/extincteurs', icon: Flame },
      { label: 'Sinistres', href: '/dashboard/sinistres', icon: AlertTriangle },
    ],
  },
  {
    section: 'FLOTTE',
    items: [
      { label: 'Véhicules',                href: '/dashboard/vehicules',                 icon: Truck },
      { label: 'Kilométrages',             href: '/dashboard/kilometrages',              icon: Gauge },
      { label: 'Indexe horaire',           href: '/dashboard/indexe-horaire',            icon: Clock },
      { label: 'Contrats de leasing',      href: '/dashboard/contrats-leasing',          icon: FileSignature },
      { label: 'Contrats de location',     href: '/dashboard/contrats-location',         icon: MapPin },
      { label: "Contrats d'achat",         href: '/dashboard/contrats-achat',            icon: FileText },
      { label: 'Véhicules de remplacement',href: '/dashboard/vehicules-remplacement',    icon: RotateCcw },
      { label: 'Equipements véhicule',     href: '/dashboard/equipements-vehicule',      icon: Cpu },
      { label: 'Véhicules réformés',       href: '/dashboard/vehicules-reformes',        icon: Archive },
    ],
  },
  {
    section: 'TRANSPORT',
    items: [
      { label: 'Factures', href: '/dashboard/factures', icon: FileText },
      { label: 'Facture Avoir', href: '/dashboard/facture-avoir', icon: FileX },
      { label: 'Demandes Transport', href: '/dashboard/demandes-transport', icon: ClipboardList },
      { label: 'Planning', href: '/dashboard/planning', icon: Calendar },
      { label: 'Missions', href: '/dashboard/missions', icon: Navigation },
    ],
  },
  {
    section: 'GESTION',
    items: [
      { label: 'Collaborateurs',   href: '/dashboard/collaborateurs',  icon: Users2 },
      { label: 'Contrats',         href: '/dashboard/contrats',         icon: Briefcase },
      { label: 'Salaires',         href: '/dashboard/salaires',         icon: Users },
      { label: 'Absence',          href: '/dashboard/absence',           icon: UserX },
      { label: 'Congés',           href: '/dashboard/conges',            icon: Umbrella },
      { label: 'Formations',       href: '/dashboard/formations',        icon: GraduationCap },
      { label: 'Visite Médicale',  href: '/dashboard/visite-medicale',  icon: HeartPulse },
      { label: 'Visas',            href: '/dashboard/visas',             icon: Stamp },
      { label: 'Passeports',       href: '/dashboard/passeports',        icon: BookMarked },
    ],
  },
  {
    section: 'CONSOMMATION',
    items: [
      { label: 'Carburant', href: '/dashboard/carburant', icon: Fuel },
      { label: 'Cartes', href: '/dashboard/cartes', icon: CreditCard },
      { label: 'Autoroutes', href: '/dashboard/autoroutes', icon: BarChart3 },
      { label: 'Dépenses', href: '/dashboard/depenses', icon: DollarSign },
    ],
  },
  {
    section: 'MAINTENANCE',
    items: [
      { label: 'Interventions', href: '/dashboard/interventions', icon: Wrench },
      { label: 'Diagnostiques', href: '/dashboard/diagnostiques', icon: Stethoscope },
      { label: 'Entretien',        href: '/dashboard/entretien',      icon: Settings },
      { label: "Plan d'entretien", href: '/dashboard/plan-entretien',  icon: ClipboardList },
    ],
  },
  {
    section: 'PARAMÈTRES',
    items: [
      { label: 'Profil projet',  href: '/dashboard/parametres/profil-projet', icon: Building2 },
      { label: 'Utilisateurs',   href: '/dashboard/parametres/utilisateurs',  icon: UserCog },
      { label: 'Thème',          href: '/dashboard/parametres/theme',         icon: Palette },
      { label: 'Sauvegarde',     href: '/dashboard/parametres/sauvegarde',    icon: HardDrive },
    ],
  },
];

const PREVIEW = 3;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [expanded,  setExpanded]  = useState<Record<string, boolean>>({});

  /* Auto-expand section when active item is beyond PREVIEW */
  useEffect(() => {
    NAV.forEach(({ section, items }) => {
      const idx = items.findIndex(
        ({ href }) => pathname === href || pathname.startsWith(href + '/')
      );
      if (idx >= PREVIEW) {
        setExpanded(prev => ({ ...prev, [section]: true }));
      }
    });
  }, [pathname]);

  const toggleSection = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleExpand = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-sidebar z-30 flex flex-col transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">ArwaPark</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ section, items }) => (
            <div key={section} className="mb-3">
              <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full px-2 mb-1 group"
              >
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#D4AF37' }}>
                  {section}
                </span>
                {collapsed[section] ? (
                  <ChevronRight className="w-3 h-3" style={{ color: '#D4AF37' }} />
                ) : (
                  <ChevronDown className="w-3 h-3" style={{ color: '#D4AF37' }} />
                )}
              </button>

              {!collapsed[section] && (
                <ul className="space-y-0.5">
                  {(expanded[section] ? items : items.slice(0, PREVIEW)).map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + '/');
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                            active
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'text-white/60 hover:bg-sidebar-hover hover:text-white'
                          )}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{label}</span>
                        </Link>
                      </li>
                    );
                  })}

                  {/* Show more / show less */}
                  {items.length > PREVIEW && (
                    <li>
                      <button
                        onClick={(e) => toggleExpand(section, e)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 text-white/40 hover:text-white/70 hover:bg-white/5"
                      >
                        {expanded[section] ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Réduire</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>+{items.length - PREVIEW} de plus</span>
                          </>
                        )}
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
