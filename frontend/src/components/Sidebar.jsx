import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <div className={`sidebar${open ? ' open' : ' closed'}`}>
      <button className="sidebar-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '<' : '>'}
      </button>
      {open && (
        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">Dashboard</Link>
            </li>
            <li className={location.pathname.startsWith('/reviews') ? 'active' : ''}>
              <Link to="/reviews">Reviews</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Sidebar;
