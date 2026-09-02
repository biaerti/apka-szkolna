import { useState } from 'react';
import type { SlideKind } from './slideDefaults';
import { SLIDE_KIND_LABELS } from './slideDefaults';
import { Button } from '../ui/Button';

const KINDS: SlideKind[] = ['title', 'text', 'task', 'recap', 'image'];

export function AddSlideMenu({ onAdd }: { onAdd: (kind: SlideKind) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button className="w-full" onClick={() => setOpen((v) => !v)}>
        Dodaj slajd
      </Button>
      {open && (
        <div className="absolute left-0 right-0 z-10 mt-1 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                onAdd(kind);
                setOpen(false);
              }}
            >
              {SLIDE_KIND_LABELS[kind]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
