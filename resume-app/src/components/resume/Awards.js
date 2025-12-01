import React, { useState } from 'react';

const Awards = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data) return null;

    const awardIcons = [
        '🏆', '🥇', '⭐', '🎖️', '🏅', '🌟', '💎'
    ];

    return (
        <section id="awards" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">
                    <span style={{ marginRight: '0.5rem' }}>🏆</span>
                    Awards & Recognition
                </h2>
                <div className="scrollable-content">
                    <ul className="awards-list">
                        {data.map((award, index) => (
                            <li
                                key={index}
                                className="award-entry"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    borderLeftColor: hoveredIndex === index ? 'var(--accent-color)' : undefined
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: '-2rem',
                                        top: '50%',
                                        transform: `translateY(-50%) ${hoveredIndex === index ? 'scale(1.3)' : 'scale(1)'}`,
                                        fontSize: '1.5rem',
                                        transition: 'transform 0.3s ease',
                                        filter: hoveredIndex === index ? 'drop-shadow(0 0 10px var(--chandan-color))' : 'none'
                                    }}
                                >
                                    {awardIcons[index % awardIcons.length]}
                                </span>
                                <span dangerouslySetInnerHTML={{ __html: award }}></span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Awards;
