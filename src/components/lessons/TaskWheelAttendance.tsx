// Kompaktowa lista obecnosci w szufladzie kola na lekcji (TaskWheelDrawer):
// chipy "numer + nazwisko", klik = nieobecny/obecny. Nieobecni sa przekresleni
// na szaro, a kto juz dzis odpowiadal ma czerwona kropke - ten sam kolor, co
// jego sektor na kole (Wheel.tsx: "juz byl/a").

import type { Student } from '../../data/types';

export interface TaskWheelAttendanceProps {
  students: Student[];
  absentSet: Set<string>;
  usedFor: (studentId: string) => number;
  onTogglePresent: (studentId: string) => void;
}

export function TaskWheelAttendance({ students, absentSet, usedFor, onTogglePresent }: TaskWheelAttendanceProps) {
  if (students.length === 0) {
    return <p className="px-1 text-xs text-gray-500">Ta klasa nie ma jeszcze uczniów.</p>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {students.map((st) => {
        const absent = absentSet.has(st.id);
        const answered = usedFor(st.id) > 0;
        return (
          <button
            key={st.id}
            type="button"
            onClick={() => onTogglePresent(st.id)}
            title={absent ? 'Nieobecny/a - kliknij, aby przywrócić' : 'Obecny/a - kliknij, aby oznaczyć nieobecność'}
            className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs ${
              absent
                ? 'border-gray-800 text-gray-600 line-through'
                : 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            <span className="tabular-nums text-gray-400">{st.number}.</span>
            <span>{st.lastName}</span>
            {answered && !absent && (
              <span className="h-2 w-2 rounded-full bg-red-500" title="już dziś odpowiadał/a" aria-label="już dziś odpowiadał/a" />
            )}
          </button>
        );
      })}
    </div>
  );
}
