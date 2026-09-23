import type { Slide } from '../../data/types';
import { FILMIKI } from '../../data/filmiki';
import { Input } from '../ui/Input';

type VideoSlide = Extract<Slide, { kind: 'video' }>;

export function VideoSlideForm({ slide, onChange }: { slide: VideoSlide; onChange: (next: VideoSlide) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Film</label>
        <select
          value={slide.videoId}
          onChange={(e) => onChange({ ...slide, videoId: e.target.value })}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">- wybierz film -</option>
          {FILMIKI.map((f) => (
            <option key={f.id} value={f.id}>
              {f.lekcja}. {f.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tytuł nad filmem (opcjonalnie)</label>
        <Input
          value={slide.title ?? ''}
          onChange={(e) => onChange({ ...slide, title: e.target.value || undefined })}
          placeholder="Domyślnie tytuł filmu"
        />
      </div>
    </div>
  );
}
