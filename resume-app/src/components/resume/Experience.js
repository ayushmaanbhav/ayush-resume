import React from 'react';

const Experience = ({ experience }) => (
  <section id="experience" className="resume-section">
    <h2>Work Experience</h2>
    {experience.map((job, index) => (
      <div className="job animate-on-scroll" key={index}>
        <div className="job-header">
          <div>
            <h3 className="job-title">
              {job.title} at <span><a href={job.companyUrl} target="_blank" rel="noopener noreferrer">{job.company}</a>
              {job.companySubtitle && ` (${job.companySubtitle})`}</span>
            </h3>
          </div>
          <div className="job-date">{job.date}</div>
        </div>
        <div className="job-details">
          {job.details && job.details.length > 0 && (
            <div className="job-meta">
              {job.details.map((detail, i) => (
                <div className="meta-item" key={i}>
                  <span className="meta-label">
                    {/* You can add icons here based on detail.label */}
                    {detail.label}
                  </span>
                  <div className="meta-content" dangerouslySetInnerHTML={{ __html: detail.value }} />
                </div>
              ))}
            </div>
          )}
          {job.technologies && job.technologies.length > 0 && (
              <div className="job-meta">
                <div className="meta-item">
                  <span className="meta-label">
                    Technologies
                  </span>
                  <div className="meta-content tech-tags-container">
                    {job.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag" title={tech.title}>
                        {tech.name}
                        <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
          )}
          {job.achievements && job.achievements.length > 0 && (
            <ul className="achievements-list">
              {job.achievements.map((achievement, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: achievement }} />
              ))}
            </ul>
          )}
        </div>
      </div>
    ))}
  </section>
);

export default Experience;
