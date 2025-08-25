import React from 'react';

const Hobbies = ({ hobbies }) => (
  <section id="hobbies" className="resume-section">
    <h2>Other Skills and Hobbies</h2>
    <div className="skills-list">
      <p dangerouslySetInnerHTML={{ __html: hobbies }} />
    </div>
  </section>
);

export default Hobbies;
