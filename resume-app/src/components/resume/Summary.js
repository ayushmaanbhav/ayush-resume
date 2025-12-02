import React, { useEffect, useRef } from 'react';

const Summary = ({ data }) => {
    const { name, title, subtitle, contact, hashtags, personalSummary } = data || {};
    const nameRef = useRef(null);

    useEffect(() => {
        if (!data) return;

        const nameEl = nameRef.current;
        if (nameEl) {
            const nameText = name;
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
                span.style.animationDuration = `${Math.random() * 0.5 + 4.5}s`;
                nameEl.appendChild(span);
                lastOffset = newOffset;
            });
        }

        // Create sparks
        const sparksContainer = document.querySelector('.sparks');
        if (sparksContainer && sparksContainer.children.length === 0) {
            for (let i = 0; i < 8; i++) {
                const spark = document.createElement('div');
                spark.classList.add('spark');
                spark.style.setProperty('--tx', `${Math.random() * 40 + 15}px`);
                spark.style.setProperty('--ty', `${Math.random() * 60 - 30}px`);
                spark.style.animationDelay = `${Math.random() * 1.5}s`;
                sparksContainer.appendChild(spark);
            }
        }
    }, [data, name]);

    if (!data) return null;

    return (
        <section id="summary" className="page-section">
            <div className="container">
                <header className="header-section">
                    <div className="header-main">
                        <div className="profile-pic-container">
                            <img src="/ayush.png" alt="Ayush Jain" className="profile-pic" />
                            <div className="orbital-ring orbital-ring-1">
                                <div className="orbital-dot" style={{ top: '0', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                            </div>
                            <div className="orbital-ring orbital-ring-2">
                                <div className="orbital-dot" style={{ bottom: '0', left: '50%', transform: 'translate(-50%, 50%)' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="name-container">
                                <h1><span ref={nameRef}>{name}</span></h1>
                            </div>
                            <div className="magic-wand-container">
                                <div className="sparks"></div>
                                <p><span className="burning-highlight">{title}</span></p>
                                {subtitle && <p className="subtitle-text">{subtitle}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="contact-info">
                        {contact.phone && (
                            <p>
                                <span className="contact-icon">📞</span>
                                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}>{contact.phone}</a>
                            </p>
                        )}
                        {contact.email && (
                            <p>
                                <span className="contact-icon">✉️</span>
                                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                            </p>
                        )}
                        {contact.linkedin && (
                            <p>
                                <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                                    <img src="/linkedin-logo.svg" alt="LinkedIn" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
                                    {contact.linkedin}
                                </a>
                            </p>
                        )}
                        {contact.website && (
                            <p>
                                <span className="contact-icon">🌐</span>
                                <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer">
                                    {contact.website}
                                </a>
                            </p>
                        )}
                        {hashtags && <p className="hashtags">{hashtags}</p>}
                    </div>
                </header>
                <p className="summary-text" dangerouslySetInnerHTML={{ __html: personalSummary }}></p>
            </div>
        </section>
    );
};

export default Summary;
