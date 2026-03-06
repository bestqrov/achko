'use client';
import GenericPage from '@/components/GenericPage/GenericPage';
export default function Page() {
  return (
    <GenericPage
      title="Indexe horaire"
      description="Suivi de l'indexe horaire"
      resource="indexe-horaire"
      columns={[]}
      createLabel="Nouveau"
      searchPlaceholder="Rechercher..."
    />
  );
}
