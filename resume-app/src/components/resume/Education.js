import React from 'react';

const Education = ({ education }) => (
  <section id="education" className="resume-section">
    <h2>Formal Education</h2>
    <div className="education-entry">
      {education.map((edu, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: `<b>${edu.degree}</b> from <a href="${edu.institutionUrl}" target="_blank" rel="noopener noreferrer"><b>${edu.institution}</b></a>, ${edu.date}. ${edu.details}` }} />
      ))}
    </div>
  </section>
);

export default Education;
