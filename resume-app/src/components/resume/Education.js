import React from 'react';

const Education = ({ data }) => {
    if (!data) return null;

    const renderStars = (score, max) => {
        let scoreOutOf10 = (score / max) * 10;
        let roundedScore = Math.round(scoreOutOf10);
        let stars = [];
        for (let i = 0; i < 10; i++) {
            stars.push(<span key={i} className={`star ${i < roundedScore ? 'glowing' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>★</span>);
        }
        return stars;
    };

    return (
        <section id="education" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">Formal Education</h2>
                <div className="scrollable-content">
                    {data.map((edu, index) => (
                        <div className="education-item mb-12" key={index}>
                            <div className="sticky-header">
                                <div className="degree-field-line">
                                    <h3 className="text-glow">{edu.degree}</h3>
                                    {edu.field && <h3 className="text-glow">{edu.field}</h3>}
                                </div>
                            </div>
                            <div className="item-content">
                                <div className="education-line">
                                    <span><a href={edu.institution_url} target="_blank" rel="noopener noreferrer">{edu.institution}</a></span>
                                    <span>{edu.date}</span>
                                </div>
                                <div className="score-line">
                                    <span className="score-highlight">{edu.score}</span>
                                    <div className="star-rating">{renderStars(edu.score_value, edu.score_max)}</div>
                                </div>
                                <div className="badge-container">
                                    {edu.badges.map((badge, i) => (
                                        <div className="badge" key={i}>
                                            <span className="tooltip">🎖️ {badge}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
