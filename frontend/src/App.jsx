// File: src/App.jsx

import {Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

import AboutPage from './pages/AboutPage';

import Home from './pages/home/Home';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage/>}  />
        </Routes> 
         
  );
}

export default App;
