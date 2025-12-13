import React, { useState } from 'react';

const Publications = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data) return null;

    const getIcon = (links) => {
        if (links.some(l => l.name.includes('ACM'))) return '📄';
        if (links.some(l => l.name.includes('GitHub'))) return '💻';
        return '📖';
    };

    return (
        <section id="publications" className="page-section publications-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">
                    <span style={{ marginRight: '0.5rem' }}>📚</span>
                    Publications & Open Source
                </h2>
                <div className="scrollable-content">
                    <ul className="publication-list">
                        {data.map((pub, index) => (
                            <li
                                key={index}
                                className="publication-entry"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="publication-title">
                                    <span
                                        style={{
                                            fontSize: '1.5rem',
                                            marginRight: '0.75rem',
                                            filter: hoveredIndex === index ? 'drop-shadow(0 0 10px var(--accent-color))' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {getIcon(pub.links)}
                                    </span>
                                    <div className="publication-title-text" dangerouslySetInnerHTML={{ __html: pub.title }} />
                                    <div className="publication-links-wrapper">
                                        <div className="publication-links">
                                            {pub.links.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.3rem'
                                                    }}
                                                >
                                                    {link.name === 'GitHub' && '💻'}
                                                    {link.name === 'PDF' && '📑'}
                                                    {link.name.includes('ACM') && '🔗'}
                                                    {link.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Publications;
