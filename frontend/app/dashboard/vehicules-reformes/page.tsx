'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
export default function Page() {
  return <GenericPage title="Véhicules réformés" description="Liste des véhicules réformés" resource="vehicules-reformes" columns={[]} createLabel="Nouveau" searchPlaceholder="Rechercher..." />;
}
