import React from 'react';

const StarRating = ({ score }) => {
  const rating = score / 10;
  const roundedRating = Math.round(rating * 2) / 2;
  const numFull = Math.floor(roundedRating);
  const hasHalf = roundedRating % 1 !== 0;
  const numEmpty = 10 - numFull - (hasHalf ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(numFull)].map((_, i) => <span key={`full-${i}`} className="star full">★</span>)}
      {hasHalf && (
        <span className="star half-star-container">
          <span className="star half">★</span>
          <span className="star">☆</span>
        </span>
      )}
      {[...Array(numEmpty)].map((_, i) => <span key={`empty-${i}`} className="star empty">☆</span>)}
    </div>
  );
};

const Education = ({ education }) => {
  return (
    <section id="education" className="resume-section">
      <h2>Formal Education</h2>
      <div className="education-list">
        {education.map((edu, index) => (
          <div key={index} className="education-card" data-watermark={edu.watermark}>
            <div className="education-card-content">
              <h3>{edu.degree}</h3>
              <h4>
                <a href={edu.institutionUrl} target="_blank" rel="noopener noreferrer">
                  {edu.institution}
                </a>
              </h4>
              <p className="education-date">{edu.date}</p>
              <div className="education-details">
                <span dangerouslySetInnerHTML={{ __html: edu.details }}></span>
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                  <StarRating score={getScore(edu)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const getScore = (edu) => {
  if (edu.cgpa) {
    return (edu.cgpa / 10) * 100;
  }
  if (edu.percentage) {
    return edu.percentage;
  }
  return 0;
};

export default Education;
