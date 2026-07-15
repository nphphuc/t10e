import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseMap from './pages/CourseMap';
import LessonPage from './pages/LessonPage';
import ReviewPage from './pages/ReviewPage';
import PeReviewLanding from './pages/PeReviewLanding';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0c0d0e] text-[#f3f4f6]">
        <Routes>
          <Route path="/" element={<CourseMap />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/review/:levelId" element={<ReviewPage />} />
          <Route path="/pe-review" element={<PeReviewLanding />} />
          <Route path="/pe-review/:levelId" element={<ReviewPage isPeReview={true} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
