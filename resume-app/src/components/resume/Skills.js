import React, { useState } from 'react';

const Skills = ({ data }) => {
    const [activeCategory, setActiveCategory] = useState(null);

    if (!data) return null;

    const categoryConfig = {
        "Product": { icon: "📋", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
        "Analytics": { icon: "📊", color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)" },
        "Technical": { icon: "💻", color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)" },
        "AI/GenAI": { icon: "🧠", color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
        "Domains": { icon: "🏢", color: "#ec4899", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
        "Leadership": { icon: "👥", color: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" }
    };

    // Handle both array format (old) and object format (new categorized)
    const isArray = Array.isArray(data);

    if (isArray) {
        const skillIcons = {
            "C++": "💻", "Java": "☕", "Kotlin": "🤖", "Android": "📱",
            "JS": "📜", "React": "⚛️", "Go": "🐹", "C#": "#️⃣",
            "Unity": "🎮", "SQL": "🗃️", "AWS": "☁️", "GCP": "🌐",
            "Azure": "💠", "Unix": "🐧", "Databases": "💾", "Queues": "➡️",
            "Workflows": "⚙️", "Temporal": "⏳", "LLMs": "🧠"
        };

        return (
            <section id="skills" className="page-section">
                <div className="scrollable-content-wrapper">
                    <h2 className="text-center mb-4 flex-shrink-0">
                        <span style={{ marginRight: '0.5rem' }}>🛠️</span>
                        Languages and Technologies
                    </h2>
                    <div className="scrollable-content">
                        <div className="skills-list">
                            <div className="tags-container">
                                {data.map((skill, index) => (
                                    <span
                                        className="skill-tag"
                                        key={index}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <span>{skillIcons[skill] || '✨'}</span>{skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // New format - categorized object
    const categories = Object.keys(data);

    return (
        <section id="skills" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">
                    <span style={{ marginRight: '0.5rem' }}>🛠️</span>
                    Skills & Expertise
                </h2>
                <div className="scrollable-content">
                    <div className="skills-categorized">
                        {categories.map((category, catIndex) => {
                            const config = categoryConfig[category] || { icon: '✨', color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #818cf8)' };
                            const isActive = activeCategory === category;

                            return (
                                <div
                                    key={catIndex}
                                    className={`skill-category ${isActive ? 'active' : ''}`}
                                    style={{
                                        animationDelay: `${catIndex * 0.1}s`,
                                        '--category-color': config.color
                                    }}
                                    onMouseEnter={() => setActiveCategory(category)}
                                    onMouseLeave={() => setActiveCategory(null)}
                                >
                                    <div className="skill-category-header">
                                        <span
                                            className="category-icon"
                                            style={{
                                                filter: `drop-shadow(0 0 8px ${config.color})`,
                                            }}
                                        >
                                            {config.icon}
                                        </span>
                                        <span
                                            className="category-name"
                                            style={{ color: config.color }}
                                        >
                                            {category}
                                        </span>
                                        <span className="skill-count" style={{
                                            background: `${config.color}20`,
                                            color: config.color,
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            marginLeft: 'auto'
                                        }}>
                                            {data[category].length}
                                        </span>
                                    </div>
                                    <div className="tags-container">
                                        {data[category].map((skill, index) => (
                                            <span
                                                className="skill-tag skill-tag-small"
                                                key={index}
                                                style={{
                                                    '--tag-accent': config.color,
                                                    animationDelay: `${(catIndex * 0.1) + (index * 0.03)}s`
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
