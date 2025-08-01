// File: src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav>
        <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>

        
      </nav>
    </aside>
  );
}

export default Sidebar;
