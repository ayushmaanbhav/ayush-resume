import React from 'react';

const Hobbies = ({ hobbies }) => (
    <section id="hobbies" className="resume-section">
        <h2>Other Skills and Hobbies</h2>
        <div className="hobbies-list">
            <div className="hobby-tags-container">
                {hobbies.map((hobby, index) => (
                    <span key={index} className="hobby-tag">
                        <span className="hobby-icon">{hobby.icon}</span>
                        {hobby.name}
                    </span>
                ))}
            </div>
        </div>
    </section>
);

export default Hobbies;
