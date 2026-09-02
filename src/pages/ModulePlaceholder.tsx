import { PageHeader } from '../components/ui/PageHeader';

export function ModulePlaceholder({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <p className="text-sm text-gray-500">Moduł w przygotowaniu.</p>
    </div>
  );
}
