import type { StudentAction } from '../../data/types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export function StudentActionFields({
  action,
  customText,
  onChange,
}: {
  action?: StudentAction;
  customText?: string;
  onChange: (action: StudentAction | undefined, customText?: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Komunikat dla uczniów</label>
        <Select value={action ?? ''} onChange={(event) => onChange((event.target.value || undefined) as StudentAction | undefined, customText)}>
          <option value="">Brak plakietki</option>
          <option value="write-answer">Zapisz tylko odpowiedź - bez przepisywania polecenia</option>
          <option value="copy">Przepisz treść slajdu</option>
          <option value="oral">Przygotuj odpowiedź ustnie - nic nie zapisuj</option>
          <option value="look">Patrz - nic nie zapisuj</option>
          <option value="textbook">Uzupełnij w podręczniku</option>
        </Select>
      </div>
      {action && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Własny krótki tekst (opcjonalnie)</label>
          <Input
            value={customText ?? ''}
            onChange={(event) => onChange(action, event.target.value || undefined)}
            placeholder="Puste = standardowy komunikat"
          />
        </div>
      )}
    </div>
  );
}
