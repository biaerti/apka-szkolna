import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Classes } from './pages/Classes';
import { ClassDetail } from './pages/ClassDetail';
import { Questions } from './pages/Questions';
import { QuestionSetDetail } from './pages/QuestionSetDetail';
import { RecapScreen } from './pages/RecapScreen';
import { Lessons } from './pages/Lessons';
import { LessonEditor } from './pages/LessonEditor';
import { LessonPresent } from './pages/LessonPresent';
import { Textbook } from './pages/Textbook';
import { SettingsPage } from './pages/Settings';
import { ModulePlaceholder } from './pages/ModulePlaceholder';
import { RulesPrint } from './pages/RulesPrint';

export default function App() {
  return (
    <Routes>
      {/* Ekrany projektora - bez paska bocznego, pelny ekran */}
      {/* Trasa zostaje: uruchamia ja slajd "recap" w prezentacji lekcji (LessonPresent) */}
      <Route path="/powtorka/:classId/:setId" element={<RecapScreen />} />
      <Route path="/lekcje/:id/pokaz/:classId" element={<LessonPresent />} />
      <Route path="/lekcje/:id/pokaz" element={<LessonPresent />} />
      {/* Wydruk zasad - bez paska bocznego, wlasny uklad A4 */}
      <Route path="/zasady/druk" element={<RulesPrint />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/klasy" element={<Classes />} />
        <Route path="/klasy/:id" element={<ClassDetail />} />
        <Route path="/pytania" element={<Questions />} />
        <Route path="/pytania/:id" element={<QuestionSetDetail />} />
        <Route path="/lekcje" element={<Lessons />} />
        <Route path="/lekcje/:id/edytuj" element={<LessonEditor />} />
        <Route path="/podrecznik" element={<Textbook />} />
        <Route path="/ustawienia" element={<SettingsPage />} />
        <Route path="*" element={<ModulePlaceholder title="Nie znaleziono strony" />} />
      </Route>
    </Routes>
  );
}
