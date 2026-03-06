import { FileText, Navigation, Wrench, Fuel, Car, Users } from 'lucide-react';
import StatsCard from '@/components/StatsCard/StatsCard';
import Link from 'next/link';

const stats = [
  { title: 'Total Factures', value: '128', icon: FileText, trend: 12, trendLabel: 'ce mois', color: 'blue' as const },
  { title: 'Missions Actives', value: '24', icon: Navigation, trend: 5, trendLabel: 'vs hier', color: 'green' as const },
  { title: 'En Maintenance', value: '6', icon: Wrench, trend: -2, trendLabel: 'vs semaine', color: 'yellow' as const },
  { title: 'Carburant / mois', value: '12 450 MAD', icon: Fuel, trend: -8, trendLabel: 'vs mois', color: 'red' as const },
  { title: 'Véhicules', value: '42', icon: Car, trend: 0, trendLabel: '', color: 'purple' as const },
  { title: 'Employés', value: '18', icon: Users, trend: 2, trendLabel: 'nouveau', color: 'green' as const },
];

const quickLinks = [
  { label: 'Nouvelle Facture', href: '/dashboard/factures', color: 'bg-blue-500' },
  { label: 'Nouvelle Mission', href: '/dashboard/missions', color: 'bg-green-500' },
  { label: 'Intervention', href: '/dashboard/interventions', color: 'bg-yellow-500' },
  { label: 'Plein Carburant', href: '/dashboard/carburant', color: 'bg-red-500' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord</h2>
        <p className="text-gray-500 text-sm mt-1">Bienvenue sur ArwaPark — vue d'ensemble de votre flotte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.color} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
            >
              + {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {[
            { text: 'Facture #FAC-089 créée pour Client XYZ', time: 'Il y a 2h', color: 'bg-blue-500' },
            { text: 'Mission Casablanca → Marrakech en cours', time: 'Il y a 4h', color: 'bg-green-500' },
            { text: 'Entretien planifié pour véhicule 12A-7845', time: 'Il y a 6h', color: 'bg-yellow-500' },
            { text: 'Assurance véhicule 34B-2210 expire dans 15 jours', time: 'Hier', color: 'bg-red-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.color}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{item.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
