import React, { useState, useEffect } from 'react';
import './App.css';
import SpaceBackground from './components/SpaceBackground';
import SmartScrollView from './components/SmartScrollView';
import Summary from './components/resume/Summary';
import KeyMetrics from './components/resume/KeyMetrics';
import Experience from './components/resume/Experience';
import Education from './components/resume/Education';
import Skills from './components/resume/Skills';
import Hobbies from './components/resume/Hobbies';
import Publications from './components/resume/Publications';
import Awards from './components/resume/Awards';
import AIAssistant from './components/resume/AIAssistant';
import Navigation from './components/Navigation';

function App() {
    const [resumeData, setResumeData] = useState(null);
    const [activeSection, setActiveSection] = useState('summary');

    useEffect(() => {
        fetch('/resume.json')
            .then(response => response.json())
            .then(data => setResumeData(data));
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll('.page-section');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach(section => {
            observer.observe(section);
        });

        return () => {
            sections.forEach(section => {
                observer.unobserve(section);
            });
        };
    }, [resumeData]);

    return (
        <div className="App">
            <SpaceBackground />
            <Navigation activeSection={activeSection} />
            <SmartScrollView>
                {resumeData && (
                    <>
                        <Summary data={resumeData.summary} />
                        {resumeData.keyMetrics && <KeyMetrics data={resumeData.keyMetrics} />}
                        <Experience data={resumeData.experience} />
                        {resumeData.entrepreneurialExperience && (
                            <Experience
                                data={resumeData.entrepreneurialExperience}
                                title="Entrepreneurial Experience"
                                isEntrepreneurial={true}
                            />
                        )}
                        <Education data={resumeData.education} />
                        <Publications data={resumeData.publications} />
                        <Awards data={resumeData.awards} />
                        <Skills data={resumeData.skills} />
                        <Hobbies data={resumeData.hobbies} alsoInterests={resumeData.alsoInterests} />
                        <AIAssistant resumeData={resumeData} />
                    </>
                )}
            </SmartScrollView>
        </div>
    );
}

export default App;
