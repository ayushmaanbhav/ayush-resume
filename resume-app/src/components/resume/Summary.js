import React, { useEffect } from 'react';

const Summary = ({ data }) => {
    const { name, title, contact, hashtags, personalSummary } = data || {};

    useEffect(() => {
        if (!data) return;
        const nameEl = document.getElementById('name-animate');
        if (nameEl) {
            const nameText = nameEl.textContent;
            nameEl.innerHTML = '';
            let lastOffset = 0;
            nameText.split('').forEach((char, i) => {
                const span = document.createElement('span');
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }
                span.classList.add('name-char');
                if (char === 'A' || char === 'J') {
                    span.classList.add('name-char-large');
                }
                
                let newOffset = lastOffset + (Math.random() * 16 - 8);
                newOffset = Math.max(-8, Math.min(8, newOffset));
                
                span.style.setProperty('--y-offset', `${newOffset}px`);
                span.style.animationDelay = `${i * 0.1}s`;
                nameEl.appendChild(span);
                lastOffset = newOffset;
            });
        }

        /*const nameContainer = document.querySelector('.name-container');
        if (nameContainer) {
            for (let i = 0; i < 8; i++) {
                const star = document.createElement('span');
                star.classList.add('circling-star');
                star.textContent = '✦';
                star.style.animationDelay = `${i * 0.5}s`;
                nameContainer.appendChild(star);
            }
        }*/

        const sparksContainer = document.querySelector('.sparks');
        if (sparksContainer) {
            for (let i = 0; i < 5; i++) {
                const spark = document.createElement('div');
                spark.classList.add('spark');
                spark.style.setProperty('--tx', `${Math.random() * 30 + 20}px`);
                spark.style.setProperty('--ty', `${Math.random() * 60 - 30}px`);
                spark.style.animationDelay = `${Math.random() * 1.5}s`;
                sparksContainer.appendChild(spark);
            }
        }
    }, [data, name]);

    return (
        <section id="summary" className="page-section">
            <div className="container">
                <header className="header-section">
                    <div className="header-main">
                        <img src="/ayush.png" alt="Ayush Jain" className="profile-pic" />
                        <div>
                            <div className="name-container">
                                <h1><span id="name-animate">{name}</span></h1>
                            </div>
                            <div className="magic-wand-container">
                                <div className="sparks"></div>
                                <p><span className="burning-highlight">{title}</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="contact-info">
                        <p><a href={`tel://${contact.phone}`}>{contact.phone}</a></p>
                        <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                        <p><a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">{contact.linkedin}</a></p>
                        <p className="hashtags">{hashtags}</p>
                    </div>
                </header>
                <h2>Personal Summary</h2>
                <p dangerouslySetInnerHTML={{ __html: personalSummary }}></p>
            </div>
        </section>
    );
};

export default Summary;
