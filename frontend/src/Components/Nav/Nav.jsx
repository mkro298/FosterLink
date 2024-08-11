import React from 'react'
import logo from '../../Pages/Home/Logo.png';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  return (
    <header className="home-header">
    <button onClick={() => navigate('/')}>
      <img src={logo} alt="" className="logo" />
      </button>
    {/* <img src = {headerImage} alt="header Image" /> */}
    <nav className="nav">
      <a href="#introduction">Introduction</a>
      <a href="#about">Who we are</a>
      <a href="#Contact">Contact</a>
      <a href="/login">Login/Register</a> {/*button for login, works */}
    </nav>
  </header>
  )
}

export default Nav