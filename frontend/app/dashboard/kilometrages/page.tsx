'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
export default function Page() {
  return (
    <GenericPage
      title="Kilométrages"
      description="Suivi des kilométrages"
      resource="kilometrages"
      columns={[]}
      createLabel="Nouveau"
      searchPlaceholder="Rechercher..."
    />
  );
}
