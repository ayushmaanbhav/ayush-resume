import React from 'react';

const Awards = ({ awards }) => (
  <section id="awards" className="resume-section">
    <h2>Additional Experience and Awards</h2>
    <div className="award-entry">
      <ul>
        {awards.map((award, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: award }} />
        ))}
      </ul>
    </div>
  </section>
);

export default Awards;
