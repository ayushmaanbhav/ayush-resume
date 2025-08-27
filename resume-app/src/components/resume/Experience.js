import React, { useState, useEffect } from 'react';
import TimelinePopup from './TimelinePopup';

const Experience = ({ data }) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(0);

    const showTimelinePopup = (index) => {
        setHighlightIndex(index);
        setPopupVisible(true);
    };

    const hideTimelinePopup = () => {
        setPopupVisible(false);
    };

    const handleTimelineSelect = (index) => {
        hideTimelinePopup();
        const jobElement = document.getElementById(`job-${index}`);
        if (jobElement) {
            // Use a timeout to ensure the popup is gone before scrolling
            setTimeout(() => {
                jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    useEffect(() => {
        const mapIcon = document.getElementById('work-experience-map-icon');
        
        const handleIconClick = () => {
            showTimelinePopup(0);
        };

        if (mapIcon) {
            mapIcon.addEventListener('click', handleIconClick);
        }

        const jobDateElements = document.querySelectorAll('.job-date');
        const handleDateClick = (index) => {
            showTimelinePopup(index);
        };

        jobDateElements.forEach((el, index) => {
            el.addEventListener('click', () => handleDateClick(index));
        });

        return () => {
            if (mapIcon) {
                mapIcon.removeEventListener('click', handleIconClick);
            }
            jobDateElements.forEach((el, index) => {
                el.removeEventListener('click', () => handleDateClick(index));
            });
        };
    }, [data]);

    return (
        <section id="experience" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="mb-4 flex-shrink-0" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Work Experience</span> <span id="work-experience-map-icon">🗺️</span>
                </h2>
                <div className="scrollable-content">
                    {data.map((job, index) => (
                        <div className="job mb-12" key={index} id={`job-${index}`}>
                            <div className="sticky-header">
                                <h3 className="job-title">{job.title} at <span><a href={job.company_url} target="_blank" rel="noopener noreferrer">{job.company}</a></span></h3>
                                <div className="job-date">{job.date}</div>
                            </div>
                            <div className="item-content">
                                <div className="job-details">
                                    {job.team && <p><span className="detail-heading">Team:</span> <span dangerouslySetInnerHTML={{ __html: job.team }}></span></p>}
                                    {job.role && <p><span className="detail-heading">Role:</span> <span dangerouslySetInnerHTML={{ __html: job.role }}></span></p>}
                                    {job.technologies && <p><span className="detail-heading">Technologies:</span> <span dangerouslySetInnerHTML={{ __html: job.technologies }}></span></p>}
                                </div>
                                <ul className="achievements-list">
                                    {job.achievements.map((achievement, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <TimelinePopup
                jobs={data}
                highlightIndex={highlightIndex}
                isVisible={isPopupVisible}
                onClose={hideTimelinePopup}
                onSelect={handleTimelineSelect}
            />
        </section>
    );
};

export default Experience;
