import { Routes, Route } from 'react-router-dom';
import ProjectSelectPage from './ProjectSelectPage';

import DashboardPage from './DashboardPage';

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* your sidebar and layout here */}
      <Routes>
        <Route path="/" element={<ProjectSelectPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
};

export default Home;
