import React, { useState, useEffect } from 'react';
import './App.css';
import MiniMap from './components/MiniMap';
import Header from './components/resume/Header';
import Summary from './components/resume/Summary';
import Experience from './components/resume/Experience';
import Education from './components/resume/Education';
import Publications from './components/resume/Publications';
import Awards from './components/resume/Awards';
import Skills from './components/resume/Skills';
import Hobbies from './components/resume/Hobbies';

function App() {
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    fetch('/resume.json')
      .then(response => response.json())
      .then(data => setResumeData(data));
  }, []);

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  const { name, title, contact, summary, experience, education, publications, awards, skills, hobbies } = resumeData;

  return (
    <>
      <MiniMap />
      <div className="container">
        <Header name={name} title={title} contact={contact} />
        <main>
          <Summary summary={summary} />
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <Experience experience={experience} />
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <Education education={education} />
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <Publications publications={publications} />
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <Awards awards={awards} />
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <Skills skills={skills} />
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <Hobbies hobbies={hobbies} />
        </main>
      </div>
    </>
  );
}

export default App;
