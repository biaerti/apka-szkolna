import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Classes } from './pages/Classes';
import { ClassDetail } from './pages/ClassDetail';
import { Questions } from './pages/Questions';
import { QuestionSetDetail } from './pages/QuestionSetDetail';
import { Recap } from './pages/Recap';
import { RecapScreen } from './pages/RecapScreen';
import { Lessons } from './pages/Lessons';
import { LessonEditor } from './pages/LessonEditor';
import { LessonPresent } from './pages/LessonPresent';
import { Calendar } from './pages/Calendar';
import { Statistics } from './pages/Statistics';
import { SettingsPage } from './pages/Settings';
import { ModulePlaceholder } from './pages/ModulePlaceholder';

export default function App() {
  return (
    <Routes>
      {/* Ekrany projektora - bez paska bocznego, pelny ekran */}
      <Route path="/powtorka/:classId/:setId" element={<RecapScreen />} />
      <Route path="/lekcje/:id/pokaz" element={<LessonPresent />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/klasy" element={<Classes />} />
        <Route path="/klasy/:id" element={<ClassDetail />} />
        <Route path="/pytania" element={<Questions />} />
        <Route path="/pytania/:id" element={<QuestionSetDetail />} />
        <Route path="/powtorka" element={<Recap />} />
        <Route path="/lekcje" element={<Lessons />} />
        <Route path="/lekcje/:id/edytuj" element={<LessonEditor />} />
        <Route path="/kalendarz" element={<Calendar />} />
        <Route path="/statystyki" element={<Statistics />} />
        <Route path="/ustawienia" element={<SettingsPage />} />
        <Route path="*" element={<ModulePlaceholder title="Nie znaleziono strony" />} />
      </Route>
    </Routes>
  );
}
