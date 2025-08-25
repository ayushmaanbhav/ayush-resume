import React from 'react';

const Skills = ({ skills }) => (
  <section id="skills" className="resume-section">
    <h2>Languages and Technologies</h2>
    <div className="skills-list">
      <div className="tech-tags-container">
        {skills.map((skill, index) => (
          <span key={index} className="tech-tag" title={skill.title}>
            {skill.name}
            <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
