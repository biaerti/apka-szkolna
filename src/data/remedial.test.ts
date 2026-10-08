import { describe, expect, it } from 'vitest';
import { lessonSections } from '../lib/lessonMaterial';
import { buildRemedialMaterials, REMEDIAL_SECTION, REMEDIAL_WORKSHEETS } from './remedial';

describe('buildRemedialMaterials', () => {
  it.each(['IV', 'V'])('tworzy wspolny dzial Wyrównawcze dla rocznika %s', (grade) => {
    const bundle = buildRemedialMaterials(grade, []);

    expect(bundle.lessons).toHaveLength(REMEDIAL_WORKSHEETS.length);
    expect(bundle.lessons.every((lesson) => lesson.grade === grade && lesson.dzial === REMEDIAL_SECTION)).toBe(true);
    const inserted = bundle.lessons.map((lesson, index) => ({ ...lesson, id: `remedial-${index}`, order: index }));
    expect(lessonSections(inserted).map((section) => section.label)).toContain(REMEDIAL_SECTION);
  });
});
