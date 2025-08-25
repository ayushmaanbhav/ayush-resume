import React from 'react';

const Summary = ({ name, title, contact, summary }) => (
  <section id="summary" className="resume-section">
    <header className="header-section">
      <div>
        <h1>{name}</h1>
        <p>{title}</p>
      </div>
      <div className="contact-info">
        <p><a href={`tel://${contact.phone}`}>{contact.phone}</a></p>
        <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        <p><a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">{contact.linkedin}</a></p>
        <p className="hashtags">{contact.hashtags}</p>
      </div>
    </header>
    <h2>Personal Summary</h2>
    <p dangerouslySetInnerHTML={{ __html: summary }} />
  </section>
);

export default Summary;
