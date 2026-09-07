// Edycja jednej komorki planu "w miejscu": wybor klasy (albo "brak") i sala.
// Kazda zmiana (select, kazda litera w sali) zapisuje od razu - klik poza
// edytor odmontowuje go, zanim input dostanie blur, wiec zapis "przy wyjsciu"
// gubilby sale. Bez osobnego modala - nauczyciel klika komorke i wybiera.

import { useEffect, useRef, useState } from 'react';
import type { SchoolClass, TimetableEntry } from '../../data/types';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

export interface TimetableCellEditorProps {
  entry: TimetableEntry | undefined;
  classes: SchoolClass[];
  /** Sala podpowiadana dla nowej komorki (najczestsza w planie), moze byc pusta. */
  defaultRoom: string;
  onSave: (classId: string, room: string) => void;
  onClose: () => void;
}

export function TimetableCellEditor({ entry, classes, defaultRoom, onSave, onClose }: TimetableCellEditorProps) {
  const [classId, setClassId] = useState(entry?.classId ?? '');
  const [room, setRoom] = useState(entry?.room ?? defaultRoom);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    selectRef.current?.focus();
  }, []);

  // Klik poza edytorem = zamknij (to, co wybrano, jest juz zapisane).
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [onClose]);

  function changeClass(next: string) {
    setClassId(next);
    onSave(next, room);
    if (!next) onClose();
  }

  function changeRoom(next: string) {
    setRoom(next);
    if (classId) onSave(classId, next);
  }

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-1.5"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <Select ref={selectRef} value={classId} onChange={(e) => changeClass(e.target.value)} className="px-2 py-1 text-xs">
        <option value="">brak</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Input
        value={room}
        onChange={(e) => changeRoom(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onClose();
          }
        }}
        placeholder="sala"
        aria-label="Sala"
        disabled={!classId}
        className="px-2 py-1 text-xs"
      />
    </div>
  );
}
