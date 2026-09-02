import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

export function Recap() {
  const navigate = useNavigate();
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);

  const [classId, setClassId] = useState<string>(sortedClasses[0]?.id ?? '');
  const [showAllSets, setShowAllSets] = useState(false);
  const [setId, setSetId] = useState<string>('');
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());

  const classStudents = useMemo(
    () =>
      students
        .filter((st) => st.classId === classId && st.active)
        .sort((a, b) => a.number - b.number),
    [students, classId],
  );

  const availableSets = useMemo(() => {
    const filtered = showAllSets ? questionSets : questionSets.filter((qs) => qs.classIds.includes(classId));
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'pl'));
  }, [questionSets, classId, showAllSets]);

  const questionCount = useMemo(() => questions.filter((q) => q.setId === setId).length, [questions, setId]);

  useEffect(() => {
    if (setId && !availableSets.some((qs) => qs.id === setId)) {
      setSetId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSets]);

  useEffect(() => {
    setPresentIds(new Set(classStudents.map((st) => st.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  function togglePresent(id: string) {
    setPresentIds((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleStart() {
    if (!classId || !setId) return;
    const absentIds = classStudents.filter((st) => !presentIds.has(st.id)).map((st) => st.id);
    navigate(`/powtorka/${classId}/${setId}`, { state: { absentIds } });
  }

  if (sortedClasses.length === 0) {
    return (
      <div>
        <PageHeader title="Powtórka" description="Koło fortuny do odpytywania uczniów." />
        <EmptyState title="Brak klas" description="Dodaj klasę i uczniów, aby uruchomić powtórkę." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Powtórka" description="Wybierz klasę i zestaw pytań, odhacz obecność, a następnie rozpocznij." />

      <div className="max-w-xl space-y-5 rounded-lg border border-gray-200 bg-white p-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Klasa</label>
          <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {sortedClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Zestaw pytań</label>
            <label className="flex items-center gap-1.5 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={showAllSets}
                onChange={(e) => setShowAllSets(e.target.checked)}
                className="rounded border-gray-300"
              />
              pokaż wszystkie zestawy
            </label>
          </div>
          {availableSets.length === 0 ? (
            <p className="text-sm text-gray-500">Brak zestawów pytań przypisanych do tej klasy.</p>
          ) : (
            <Select value={setId} onChange={(e) => setSetId(e.target.value)}>
              <option value="">Wybierz zestaw...</option>
              {availableSets.map((qs) => (
                <option key={qs.id} value={qs.id}>
                  {qs.name}
                </option>
              ))}
            </Select>
          )}
          {setId && <p className="mt-1.5 text-xs text-gray-500">Liczba pytań w zestawie: {questionCount}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Obecni uczniowie ({presentIds.size}/{classStudents.length})
          </label>
          {classStudents.length === 0 ? (
            <p className="text-sm text-gray-500">Brak aktywnych uczniów w tej klasie.</p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-gray-200 p-2">
              {classStudents.map((st) => (
                <label key={st.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={presentIds.has(st.id)}
                    onChange={() => togglePresent(st.id)}
                    className="rounded border-gray-300"
                  />
                  <span>
                    {st.lastName} {st.firstName}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <Button onClick={handleStart} disabled={!classId || !setId || classStudents.length === 0} className="w-full">
          Start
        </Button>
      </div>
    </div>
  );
}
