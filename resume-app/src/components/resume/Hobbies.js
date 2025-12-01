import React, { useState } from 'react';

const Hobbies = ({ data, alsoInterests }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!data) return null;

    const hobbyIcons = {
        "yoga": "🧘",
        "guitar": "🎸",
        "chess": "♟️",
        "skating": "⛸️",
        "swimming": "🏊",
        "scuba": "🤿",
        "traveling": "✈️",
        "cooking": "🍳",
        "heritage": "🏛️",
        "pilgrimages": "🛕"
    };

    const hobbyColors = {
        "skating": "#60a5fa",
        "guitar": "#f59e0b",
        "scuba": "#06b6d4",
        "traveling": "#a78bfa",
        "heritage": "#f97316",
        "pilgrimages": "#ec4899",
        "cooking": "#ef4444",
        "chess": "#8b5cf6",
        "yoga": "#10b981",
        "swimming": "#3b82f6"
    };

    // Check if data is array of strings (old format) or array of objects (new format)
    const isSimpleArray = typeof data[0] === 'string';

    if (isSimpleArray) {
        const simpleIcons = {
            "Yoga": "🧘", "Guitar": "🎸", "Chess": "♟️", "Geopolitics": "🌍",
            "Science": "🔬", "History": "📜", "Facts": "💡", "Skating": "⛸️",
            "Swimming": "🏊", "Scuba": "🤿", "Traveling": "✈️", "Cooking": "🍳",
            "Painting": "🎨", "Movies": "🎬"
        };

        return (
            <section id="hobbies" className="page-section">
                <div className="scrollable-content-wrapper">
                    <h2 className="text-center mb-4 flex-shrink-0">
                        <span style={{ marginRight: '0.5rem' }}>🎯</span>
                        Hobbies & Interests
                    </h2>
                    <div className="scrollable-content">
                        <div className="skills-list">
                            <div className="tags-container">
                                {data.map((hobby, index) => (
                                    <span className="skill-tag" key={index}>
                                        {simpleIcons[hobby] || '✨'} {hobby}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // New format with rich hobby data
    return (
        <section id="hobbies" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">
                    <span style={{ marginRight: '0.5rem' }}>🎯</span>
                    Beyond Work
                </h2>
                <div className="scrollable-content">
                    <div className="hobbies-grid">
                        {data.map((hobby, index) => {
                            const color = hobbyColors[hobby.icon] || '#a78bfa';
                            const isHovered = hoveredIndex === index;

                            return (
                                <div
                                    className="hobby-card"
                                    key={index}
                                    style={{
                                        animationDelay: `${index * 0.08}s`,
                                        '--hobby-color': color,
                                        borderColor: isHovered ? color : undefined,
                                        boxShadow: isHovered ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${color}40` : undefined
                                    }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div
                                        className="hobby-icon"
                                        style={{
                                            filter: isHovered ? `drop-shadow(0 0 15px ${color})` : undefined
                                        }}
                                    >
                                        {hobbyIcons[hobby.icon] || '✨'}
                                    </div>
                                    <div className="hobby-name">{hobby.name}</div>
                                    <div
                                        className="hobby-detail"
                                        style={{ color: color }}
                                    >
                                        {hobby.detail}
                                    </div>
                                    <div className="hobby-places">{hobby.places}</div>
                                </div>
                            );
                        })}
                    </div>
                    {alsoInterests && (
                        <div className="also-interests">
                            <strong>Also passionate about:</strong> {alsoInterests}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hobbies;
