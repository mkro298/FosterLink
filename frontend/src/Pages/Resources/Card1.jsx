import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Card1.css';
import { LogNav } from '../../Components/index.js';
import { data1, data2 } from './data.js';

// Card Component
const Card = ({ image, title, paragraph, link }) => (
  <a href={link} className="resource-card" target="_blank" rel="noopener noreferrer">
    <img src={image} alt={title} className="resource-card-image" />
    <div className="resource-card-content">
      <h3 className="resource-card-title">{title}</h3>
      <p className="resource-card-paragraph">{paragraph}</p>
    </div>
  </a>
);

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

// Carousel Component
const Carousel = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 2;
  const totalSlides = Math.ceil(data.length / slidesToShow);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="resource-carousel">
      <button className="resource-nav-button prev" onClick={prevSlide}>
        &#9664;
      </button>
      <div className="resource-carousel-wrapper">
        <div
          className="resource-carousel-track"
          style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
        >
          {data.map((item, index) => (
            <div className="resource-carousel-slide" key={index}>
              <Card {...item} />
            </div>
          ))}
        </div>
      </div>
      <button className="resource-nav-button next" onClick={nextSlide}>
        &#9654;
      </button>
    </div>
  );
};

Carousel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      paragraph: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Main Component
const Card1 = () => (
  <div className="resource-page">
    <LogNav />
    <main className="resource-mentors-content">
      <h1 className="resource-page-title">Resources</h1>

      <section className="resource-section">
        <h2 className="resource-section-title">Education</h2>
        <div className="resource-carousel-wrapper">
          <Carousel data={data1} />
        </div>
      </section>

      <section className="resource-section">
        <h2 className="resource-section-title">Mental Health</h2>
        <div className="resource-carousel-wrapper">
          <Carousel data={data2} />
        </div>
      </section>
    </main>
    <footer className="resource-footer">
      <p>&copy; 2024 FosterLink</p>
    </footer>
  </div>
);

export default Card1;
