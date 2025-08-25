import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SpaceBackground from './components/SpaceBackground';
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
  const summaryRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const publicationsRef = useRef(null);
  const awardsRef = useRef(null);
  const skillsRef = useRef(null);
  const hobbiesRef = useRef(null);

  useEffect(() => {
    fetch('/resume.json')
      .then(response => response.json())
      .then(data => setResumeData(data));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [resumeData]);

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  const { name, title, contact, summary, minimap, experience, education, publications, awards, skills, hobbies } = resumeData;

  const refs = {
    summary: summaryRef,
    experience: experienceRef,
    education: educationRef,
    publications: publicationsRef,
    awards: awardsRef,
    skills: skillsRef,
    hobbies: hobbiesRef,
  };

  return (
    <>
      <SpaceBackground />
      <MiniMap refs={refs} minimap={minimap} />
      <div className="container">
        <Header name={name} title={title} contact={contact} />
        <main>
          <div ref={summaryRef} className="animate-on-scroll"><Summary summary={summary} /></div>
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <div ref={experienceRef} className="animate-on-scroll"><Experience experience={experience} /></div>
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <div ref={educationRef} className="animate-on-scroll"><Education education={education} /></div>
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <div ref={publicationsRef} className="animate-on-scroll"><Publications publications={publications} /></div>
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <div ref={awardsRef} className="animate-on-scroll"><Awards awards={awards} /></div>
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <div ref={skillsRef} className="animate-on-scroll"><Skills skills={skills} /></div>
          <hr style={{ border: '0', height: '1px', background: 'var(--border-color)', margin: '3rem 0' }} />
          <div ref={hobbiesRef} className="animate-on-scroll"><Hobbies hobbies={hobbies} /></div>
        </main>
      </div>
    </>
  );
}

export default App;
