import type { Slide } from '../../data/types';
import { Input } from '../ui/Input';

type ImageSlide = Extract<Slide, { kind: 'image' }>;

export function ImageSlideForm({ slide, onChange }: { slide: ImageSlide; onChange: (next: ImageSlide) => void }) {
  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({ ...slide, url: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Adres URL obrazu</label>
        <Input
          value={slide.url.startsWith('data:') ? '' : slide.url}
          onChange={(e) => onChange({ ...slide, url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">albo wgraj plik</label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-600"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <p className="mt-1 text-xs text-amber-600">
          Uwaga: wgrany plik jest zapisywany jako długi tekst (data URL) w bazie w localStorage - duże obrazy
          znacząco ją powiększają.
        </p>
        {slide.url.startsWith('data:') && <p className="mt-1 text-xs text-gray-500">Wgrano obraz z pliku.</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Podpis (opcjonalnie)</label>
        <Input
          value={slide.caption ?? ''}
          onChange={(e) => onChange({ ...slide, caption: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
