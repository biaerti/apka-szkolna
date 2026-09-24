import { describe, expect, it } from 'vitest';
import { buildTextbook4 } from '../../data/textbook4';
import { codeVersion } from './refreshMaterials';

function versions() {
  const bundle = buildTextbook4('IV', ['4a']);
  return bundle.lessons.map((lesson) =>
    codeVersion(lesson, bundle.questions.filter((q) => q.setId === lesson.questionSetId), bundle),
  );
}

describe('codeVersion', () => {
  it('jest taka sama przy kazdym buildzie (losowe id nie wchodza do wersji)', () => {
    expect(versions()).toEqual(versions());
  });

  it('rozni sie miedzy lekcjami i zmienia sie ze zmiana tresci', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const lesson = bundle.lessons[0];
    const questions = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
    const v = codeVersion(lesson, questions, bundle);
    expect(new Set(versions()).size).toBe(bundle.lessons.length);
    expect(codeVersion({ ...lesson, notebookNote: 'inna notatka' }, questions, bundle)).not.toBe(v);
    expect(codeVersion(lesson, questions.slice(1), bundle)).not.toBe(v);
  });
});
