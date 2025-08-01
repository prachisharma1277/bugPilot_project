import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppLayout.css';
import Footer from './Footer';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <Header toggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="layout-body">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AppLayout;
