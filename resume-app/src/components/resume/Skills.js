import React from 'react';

const Skills = ({ data }) => {
    if (!data) return null;

    const skillIcons = {
        "C++": "💻",
        "Java": "☕",
        "Kotlin": "🤖",
        "Android": "📱",
        "JS": "📜",
        "React": "⚛️",
        "Go": "🐹",
        "C#": "#️⃣",
        "Unity": "🎮",
        "SQL": "🗃️",
        "AWS": "☁️",
        "GCP": "🌐",
        "Azure": "💠",
        "Unix": "🐧",
        "Databases": "💾",
        "Queues": "➡️",
        "Workflows": "⚙️",
        "Temporal": "⏳",
        "LLMs": "🧠"
    };

    return (
        <section id="skills" className="page-section">
            <div className="container">
                <h2>Languages and Technologies</h2>
                <div className="skills-list">
                    <div className="tags-container">
                        {data.map((skill, index) => (
                            <span className="skill-tag" key={index}>
                                <span>{skillIcons[skill] || '✨'}</span>{skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
