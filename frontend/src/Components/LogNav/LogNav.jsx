import React from 'react'
import logo from '../../Pages/Home/Logo.png';
import { useNavigate } from 'react-router-dom';
import  './LogNav.css';

const LogNav = () => {
  const navigate = useNavigate();
  return (
    <header className="home-header">
      <button onClick={() => navigate('/')}>
      <img src={logo} alt="" className="logo" />
      </button>
        {/* <img src = {headerImage} alt="header Image" /> */}
        <nav className="nav">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/mentors')}>Mentors/Tutors</button>
          <button onClick={() => navigate('/scholarships')}>Scholarships</button>
          <button onClick={() => navigate('/resources')}>Resources</button>
          <button onClick={() => navigate('/community')}>Community</button>
        </nav>
      </header>
  )
}

export default LogNav;