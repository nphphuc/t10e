import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CourseMap from './pages/CourseMap';
import LessonPage from './pages/LessonPage';
import ReviewPage from './pages/ReviewPage';
import PeReviewLanding from './pages/PeReviewLanding';
import PracticePage from './pages/PracticePage';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';

// LƯU Ý: KHÔNG bọc Routes trong <AnimatePresence mode="wait"> nữa — pattern đó
// là nguồn gốc bug "màn hình đen phải reload": framer-motion có bug đã biết
// khiến animation của trang mới không bao giờ start khi mount ngay sau exit.
// Overlay FoxFallTransition (thuần CSS) đã che việc swap trang tức thời rồi,
// exit fade 0.2s không ai nhìn thấy — bỏ đi không mất gì về mặt hình ảnh.
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/home" element={<PageTransition><CourseMap /></PageTransition>} />
        <Route path="/lesson/:lessonId" element={<PageTransition><LessonPage /></PageTransition>} />
        <Route path="/review/:levelId" element={<PageTransition><ReviewPage /></PageTransition>} />
        <Route path="/pe-review" element={<PageTransition><PeReviewLanding /></PageTransition>} />
        <Route path="/pe-review/:levelId" element={<PageTransition><ReviewPage isPeReview={true} /></PageTransition>} />
        <Route path="/practice" element={<PageTransition><PracticePage /></PageTransition>} />
      </Routes>
    </ErrorBoundary>
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

