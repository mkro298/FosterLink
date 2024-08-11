import React from 'react';
import mentorsData from './data.json';
import './Mentors.css';
import { LogNav } from '../../Components/index.js';

const Mentors = () => {
  return (
    <div className="mentors-page">
      <LogNav />

      <main className="mentors-content">
        <h1 className="page-title">Our Mentors</h1>
        <div className="mentors-grid">
          {mentorsData.map((mentor, index) => (
            <div key={index} className="mentor-card">
              <img src={mentor.Image ?? ''} alt={mentor.Name} className="mentor-image" />
              <h3>{mentor.Name}</h3>
              <p>
                <strong>Subjects:</strong> {mentor.Subjects.join(', ')}
              </p>
              <p>
                <strong>Availability:</strong> {mentor.Availability}
              </p>
              <p>
                <strong>Hourly Rate:</strong> {mentor['Mentor (free)'] ? 'Free' : mentor['Hourly Rate']}
              </p>
              <p>
                <strong>Contact:</strong> <a href={`mailto:${mentor['Contact Info']}`}>{mentor['Contact Info']}</a>
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 FosterLink</p>
      </footer>
    </div>
  );
};

export default Mentors;
