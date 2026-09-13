import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { RecapSession } from '../components/recap/RecapSession';

export function RecapScreen() {
  const { classId, setId } = useParams<{ classId: string; setId: string }>();
  const navigate = useNavigate();

  const schoolClass = useStore((s) => s.classes.find((c) => c.id === classId));
  const questionSet = useStore((s) => s.questionSets.find((qs) => qs.id === setId));

  if (!classId || !setId || !schoolClass || !questionSet) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 text-white">
        <p className="text-xl">Nie znaleziono klasy lub zestawu pytań.</p>
        <Link to="/lekcje" className="rounded-md bg-accent-600 px-4 py-2 text-sm font-medium hover:bg-accent-700">
          Wróć do lekcji
        </Link>
      </div>
    );
  }

  return (
    <RecapSession
      classId={classId}
      setId={setId}
      onExit={() => navigate(`/lekcje?klasa=${classId}`)}
    />
  );
}
