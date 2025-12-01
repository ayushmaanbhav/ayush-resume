import React from 'react';

const Education = ({ data }) => {
    if (!data) return null;

    const badgeIcons = {
        "CS Club Coordinator": "💻",
        "Coding Awards": "🏆",
        "Marathon Runner": "🏃",
        "Artist Awards": "🎨",
        "Band Music": "🎸",
        "Special Services Award": "⭐",
        "Academic Topper": "📚",
        "Cultural Awards": "🎭",
        "Full Attendance": "✅",
        "Music Awards": "🎵",
        "Yoga Awards": "🧘"
    };

    const renderStars = (score, max) => {
        let scoreOutOf10 = (score / max) * 10;
        let roundedScore = Math.round(scoreOutOf10);
        let stars = [];
        for (let i = 0; i < 10; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i < roundedScore ? 'glowing' : ''}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <section id="education" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">
                    <span style={{ marginRight: '0.5rem' }}>🎓</span>
                    Education
                </h2>
                <div className="scrollable-content">
                    {data.map((edu, index) => (
                        <div
                            className="education-item mb-12"
                            key={index}
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="sticky-header">
                                <div className="degree-field-line">
                                    <h3 className="text-glow">{edu.degree}</h3>
                                    {edu.field && <h3 className="text-glow" style={{ opacity: 0.8 }}>{edu.field}</h3>}
                                </div>
                            </div>
                            <div className="item-content">
                                <div className="education-line">
                                    <span>
                                        <a href={edu.institution_url} target="_blank" rel="noopener noreferrer">
                                            {edu.institution}
                                        </a>
                                    </span>
                                    <span style={{
                                        background: 'rgba(167, 139, 250, 0.1)',
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '15px',
                                        color: 'var(--accent-color)',
                                        fontWeight: '600'
                                    }}>
                                        {edu.date}
                                    </span>
                                </div>
                                <div className="score-line">
                                    <span className="score-highlight">{edu.score}</span>
                                    <div className="star-rating">
                                        {renderStars(edu.score_value, edu.score_max)}
                                    </div>
                                </div>
                                {edu.note && (
                                    <p style={{
                                        marginTop: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        background: 'rgba(167, 139, 250, 0.1)',
                                        borderRadius: '8px',
                                        borderLeft: '3px solid var(--accent-color)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {edu.note}
                                    </p>
                                )}
                                <div className="badge-container">
                                    {edu.badges.map((badge, i) => (
                                        <div
                                            className="badge"
                                            key={i}
                                            style={{ animationDelay: `${i * 0.05}s` }}
                                        >
                                            <span className="tooltip">
                                                {badgeIcons[badge] || '🎖️'} {badge}
                                            </span>
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
