import React from 'react';

const Hobbies = ({ data }) => {
    if (!data) return null;

    const hobbyIcons = {
        "Yoga": "🧘",
        "Guitar": "🎸",
        "Chess": "♟️",
        "Geopolitics": "🌍",
        "Science": "🔬",
        "History": "📜",
        "Facts": "💡",
        "Skating": "🛹",
        "Swimming": "🏊",
        "Scuba": "🤿",
        "Traveling": "✈️",
        "Cooking": "🍳",
        "Painting": "🎨",
        "Movies": "🎬"
    };

    return (
        <section id="hobbies" className="page-section">
            <div className="container">
                <h2>Hobbies & Interests</h2>
                <div className="skills-list">
                    <div className="tags-container">
                        {data.map((hobby, index) => (
                            <span className="skill-tag" key={index}>
                                {hobbyIcons[hobby] || '✨'} {hobby}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hobbies;
