
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReviewList from './pages/ReviewList';
import ReviewDetail from './pages/ReviewDetail';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/review/:id" element={<ReviewDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
