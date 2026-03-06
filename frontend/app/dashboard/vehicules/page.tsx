'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
export default function Page() {
  return (
    <GenericPage
      title="Véhicules"
      description="Liste des véhicules"
      resource="vehicles"
      columns={[]}
      createLabel="Nouveau"
      searchPlaceholder="Rechercher..."
    />
  );
}
