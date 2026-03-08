// Pack configuration for ArwaPark SaaS
// currentPack is driven by user.pack coming from the auth store / JWT.
// To switch a user's pack, update user.pack in the JWT payload and call setAuth().

import { useAuthStore } from '@/lib/auth/authStore';

export type PackName = 'basic' | 'pro';

export interface PackConfig {
  name: PackName;
  label: string;
  price: string;
  priceNote: string;
  color: string;
  maxVehicules: number;
  maxChauffeurs: number;
  maxUsers: number;
  features: string[];
  lockedHrefs: string[];
}

export const PACKS: Record<PackName, PackConfig> = {
  basic: {
    name: 'basic',
    label: 'Basic',
    price: '990 DH',
    priceNote: '/mois',
    color: '#6366f1',
    maxVehicules: 20,
    maxChauffeurs: 20,
    maxUsers: 2,
    features: [
      'Jusqu\'à 20 véhicules',
      'Jusqu\'à 20 chauffeurs',
      '2 utilisateurs (Admin + Secrétaire)',
      'Administratif complet',
      'Gestion flotte de base',
      'Factures & Missions',
      'Suivi carburant & cartes',
      'Maintenance de base',
      'Paramètres projet',
    ],
    lockedHrefs: [
      // FLOTTE
      '/dashboard/indexe-horaire',
      '/dashboard/contrats-leasing',
      '/dashboard/contrats-location',
      '/dashboard/contrats-achat',
      '/dashboard/vehicules-remplacement',
      '/dashboard/vehicules-reformes',
      // TRANSPORT
      '/dashboard/facture-avoir',
      '/dashboard/planning',
      // GESTION
      '/dashboard/contrats',
      '/dashboard/salaires',
      '/dashboard/absence',
      '/dashboard/conges',
      '/dashboard/formations',
      '/dashboard/visite-medicale',
      '/dashboard/visas',
      '/dashboard/passeports',
      // CONSOMMATION
      '/dashboard/autoroutes',
      '/dashboard/depenses',
      // MAINTENANCE
      '/dashboard/diagnostiques',
      '/dashboard/entretien',
      '/dashboard/plan-entretien',
      // PARAMÈTRES
      '/dashboard/parametres/sauvegarde',
    ],
  },

  pro: {
    name: 'pro',
    label: 'Pro',
    price: '2 490 DH',
    priceNote: '/mois',
    color: '#f59e0b',
    maxVehicules: 100,
    maxChauffeurs: 200,
    maxUsers: 10,
    features: [
      'Jusqu\'à 100 véhicules',
      'Jusqu\'à 200 chauffeurs',
      '10 utilisateurs',
      'Toutes les fonctions Basic',
      'Planning multi-véhicule avancé',
      'Gestion RH complète (Salaires, Congés, Absences, Formations)',
      'Contrats & Leasing',
      'Diagnostiques & Entretien planifié',
      'Suivi Autoroutes & Dépenses détaillées',
      'Sauvegarde automatique',
      'Export Excel / PDF',
      'Support prioritaire 24/7',
    ],
    lockedHrefs: [],
  },
};

// ── Hook — use this in every component that needs pack info ────────────────────
export function usePack() {
  const user = useAuthStore((s) => s.user);
  const packName: PackName = (user?.pack as PackName) ?? 'basic';
  const pack = PACKS[packName];

  return {
    packName,
    pack,
    isLocked: (href: string) => pack.lockedHrefs.includes(href),
  };
}

