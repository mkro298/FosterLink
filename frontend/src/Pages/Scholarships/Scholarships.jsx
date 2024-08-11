import React from 'react';
import './Scholarships.css';
import LogNav from '../../Components/LogNav/LogNav';
import Card from '../../Components/Card/Card';
import { scholarshipData } from './ScholarshipData.js';

const Scholarships = () => {
  return (
    <div className="scholarship-page">
      <LogNav />
      <main className="scholarship-main-content">
        <br />
        <h1 className="scholarship-title">Scholarships</h1>
        <br />
        <div className="scholarship-card-container">
          {scholarshipData.map((scholarship, index) => (
            <div key={index} className="scholarship-card-item">
              <Card
                title={scholarship.title}
                description={scholarship.description}
                link={scholarship.link}
                pres={false}
              />
            </div>
          ))}
        </div>
      </main>
      <footer className="scholarship-footer">
        <p>&copy; 2024 FosterLink</p>
      </footer>
    </div>
  );
};

export default Scholarships;
