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
import { Meetings } from './pages/Meetings';
import { MeetingDetail } from './pages/MeetingDetail';
import { Quizzes } from './pages/Quizzes';
import { QuizDetail } from './pages/QuizDetail';
import { QuizPresent } from './pages/QuizPresent';
import { Timetable } from './pages/Timetable';
import { SettingsPage } from './pages/Settings';
import { Podstawa } from './pages/Podstawa';
import { Lektury } from './pages/Lektury';
import { ModulePlaceholder } from './pages/ModulePlaceholder';
import { RulesPrint } from './pages/RulesPrint';
import { Panel } from './pages/Panel';

export default function App() {
  return (
    <Routes>
      {/* Ekrany projektora - bez paska bocznego, pelny ekran */}
      {/* Trasa zostaje: uruchamia ja slajd "recap" w prezentacji lekcji (LessonPresent) */}
      <Route path="/powtorka/:classId/:setId" element={<RecapScreen />} />
      <Route path="/lekcje/:id/pokaz/:classId" element={<LessonPresent />} />
      <Route path="/lekcje/:id/pokaz" element={<LessonPresent />} />
      <Route path="/kartkowki/:id/pokaz" element={<QuizPresent />} />
      {/* Plywajacy panel desktopowy (folder desktop/) - kolo nad multipodrecznikiem */}
      <Route path="/panel" element={<Panel />} />
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
        <Route path="/kartkowki" element={<Quizzes />} />
        <Route path="/kartkowki/:id" element={<QuizDetail />} />
        <Route path="/plan" element={<Timetable />} />
        <Route path="/zebrania" element={<Meetings />} />
        <Route path="/zebrania/:id" element={<MeetingDetail />} />
        <Route path="/podstawa" element={<Podstawa />} />
        <Route path="/lektury" element={<Lektury />} />
        <Route path="/ustawienia" element={<SettingsPage />} />
        <Route path="*" element={<ModulePlaceholder title="Nie znaleziono strony" />} />
      </Route>
    </Routes>
  );
}
