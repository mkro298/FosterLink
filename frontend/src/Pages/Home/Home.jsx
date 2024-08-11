import React, { useState } from 'react';

import { Nav, LogNav } from '../../Components/index.js';

import us from '../../Pages/Home/us.jpeg';
import pic from '../../Pages/Home/pic.png';
import transparentlogo from '../../Pages/Home/transparent logo.png';

import './Home.css';

const Home = ({ logged }) => {
  //setLogged(true) based on confirmation of login if login is successful
  return (
    <div className="home">
      {logged ? <LogNav /> : <Nav />}

      <main className="home-content">
        <section className="hero">
          <div className="content">
            <img src={transparentlogo} alt="Transparent Logo" className="transparent_logo" />
            <div className="text-below-logo">
              <h1>FosterLink</h1>
              <p>Empowering Foster Youth: Bridging the Gap to Adulthood </p>
              <p>with Support and Resources</p>
            </div>
          </div>
        </section>

        <section id="introduction" className="home-intro">
          <h2>Introduction</h2>
          <p>
            Welcome to the Fosterlink Website, a platform designed to support foster care youth as they transition to
            adulthood. Fosterlink aims to bridge this gap by providing resources and support specifically for those who
            have aged out of the foster care system. We collaborate with organizations like Casey Family Programs to
            integrate our services and offer essential assistance directly to these young adults, helping them build a
            brighter future.
          </p>
          <div className="video">
            <iframe
              width="800"
              height="500"
              src="https://www.youtube.com/embed/qA8V1B1KBRo?si=0rXsOXetb4suRKHD"
              title="YouTube video player"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
          <p>
            Simone Biles overcame a challenging childhood in foster care to become one of the greatest gymnasts of all
            time, demonstrating that resilience and determination can lead to extraordinary success. Her story is a
            powerful example of how one's beginnings do not dictate their future achievements.
          </p>
        </section>
        <hr />
        <section id="about" className="home-about">
          <div className="who-we-are">
            <h2>Who we are</h2>
            <p>
              At Fosterlink, we recognize the unique challenges foster children face as they transition to adulthood.
              Our platform was created in response to feedback from social workers and foster care alumni, emphasizing
              the need for resources specifically for foster youth. Unlike apps focused on foster parents, Fosterlink
              provides direct support to young adults who have aged out of the system.
              <br />
              <div className="box">
                <div className="services">
                  Key features include:
                  <br />
                  <ul>
                    <li>
                      <strong> - Tutoring/Mentoring Services:</strong> Tools to find affordable tutors or mentors based
                      on location and subject needs.
                    </li>
                    <li>
                      <strong> - Scholarship Database:</strong> A comprehensive database of scholarships filtered by
                      criteria like income and ethnicity.
                    </li>
                    <li>
                      <strong> - Educational Resources:</strong> Access to valuable educational websites and materials.
                    </li>
                    <li>
                      <strong> - Mental Health Resources:</strong> Access to mental health resources and support
                      services.
                    </li>
                    <li>
                      <strong> - Community:</strong> A chat service for users to connect, share experiences, and support
                      one another.
                    </li>
                  </ul>
                </div>
              </div>
              <br />
              Our mission is to empower foster youth with the resources and support they need to succeed, helping them
              transition smoothly into adulthood and reach their full potential.
            </p>
          </div>
          <div className="who_pic">{<img src={pic} alt="" className="pic" />}</div>
        </section>

        <hr />
        <section id="Contact" className="home-Contact">
          <h2>Contact</h2>

          <ul>Email: support@fosterlink.org</ul>
          <ul>Phone: 1-800-555-1234</ul>
          <ul>Office Hours: Monday to Friday, 9 AM - 5 PM</ul>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 FosterLink</p>
      </footer>
    </div>
  );
};

export default Home;
