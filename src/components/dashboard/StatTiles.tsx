export function StatTiles({
  classCount,
  activeStudentCount,
  questionSetCount,
  plannedLessonCount,
}: {
  classCount: number;
  activeStudentCount: number;
  questionSetCount: number;
  plannedLessonCount: number;
}) {
  const tiles = [
    { label: 'Klasy', value: classCount },
    { label: 'Aktywni uczniowie', value: activeStudentCount },
    { label: 'Zestawy pytań', value: questionSetCount },
    { label: 'Zaplanowane lekcje', value: plannedLessonCount },
  ];

  return (
    <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-2xl font-semibold text-gray-900">{t.value}</p>
          <p className="text-sm text-gray-500">{t.label}</p>
        </div>
      ))}
    </section>
  );
}
