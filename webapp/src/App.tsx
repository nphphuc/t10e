import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CourseMap from './pages/CourseMap';
import LessonPage from './pages/LessonPage';
import ReviewPage from './pages/ReviewPage';
import PeReviewLanding from './pages/PeReviewLanding';
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><CourseMap /></PageTransition>} />
        <Route path="/lesson/:lessonId" element={<PageTransition><LessonPage /></PageTransition>} />
        <Route path="/review/:levelId" element={<PageTransition><ReviewPage /></PageTransition>} />
        <Route path="/pe-review" element={<PageTransition><PeReviewLanding /></PageTransition>} />
        <Route path="/pe-review/:levelId" element={<PageTransition><ReviewPage isPeReview={true} /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter basename="/t10e">
      <div className="min-h-screen bg-[#0c0d0e] text-[#f3f4f6]">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;

