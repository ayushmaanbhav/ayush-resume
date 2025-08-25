import React from 'react';

const Summary = ({ summary }) => (
  <section id="summary" className="resume-section">
    <h2>Personal Summary</h2>
    <p dangerouslySetInnerHTML={{ __html: summary }} />
  </section>
);

export default Summary;
