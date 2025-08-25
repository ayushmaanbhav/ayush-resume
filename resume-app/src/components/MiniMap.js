import React, { useEffect } from 'react';

const MiniMap = () => {
    useEffect(() => {
        const sections = document.querySelectorAll('.resume-section');
        const navItems = document.querySelectorAll('.mini-map .map-item');

        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.4
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navItems.forEach(item => {
                            item.classList.remove('active');
                            if (item.getAttribute('href') === `#${id}`) {
                                item.classList.add('active');
                             }
                        });
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                observer.observe(section);
            });
        }
    }, []);

    return (
        <nav className="mini-map">
            <a href="#summary" className="map-item">
                <span className="map-label">Summary</span>
                <span className="map-dot"></span>
            </a>
            <a href="#experience" className="map-item">
                <span className="map-label">Experience</span>
                <span className="map-dot"></span>
            </a>
            <a href="#education" className="map-item">
                <span className="map-label">Education</span>
                <span className="map-dot"></span>
            </a>
            <a href="#publications" className="map-item">
                <span className="map-label">Publications</span>
                <span className="map-dot"></span>
            </a>
            <a href="#awards" className="map-item">
                <span className="map-label">Awards</span>
                <span className="map-dot"></span>
            </a>
            <a href="#skills" className="map-item">
                <span className="map-label">Skills</span>
                <span className="map-dot"></span>
            </a>
            <a href="#hobbies" className="map-item">
                <span className="map-label">Hobbies</span>
                <span className="map-dot"></span>
            </a>
        </nav>
    );
};

export default MiniMap;
