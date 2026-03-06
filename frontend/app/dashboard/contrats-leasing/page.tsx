'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
export default function Page() {
  return (
    <GenericPage
      title="Contrats de leasing"
      description="Gestion des contrats de leasing"
      resource="contrats-leasing"
      columns={[]}
      createLabel="Nouveau"
      searchPlaceholder="Rechercher..."
    />
  );
}
