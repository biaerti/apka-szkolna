import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function QuickStart() {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Szybki start</h2>
      <div className="flex flex-wrap gap-2">
        <Link to="/lekcje">
          <Button variant="secondary">Nowa lekcja</Button>
        </Link>
        <Link to="/powtorka">
          <Button variant="secondary">Powtórka</Button>
        </Link>
        <Link to="/pytania">
          <Button variant="secondary">Pytania</Button>
        </Link>
      </div>
    </section>
  );
}
