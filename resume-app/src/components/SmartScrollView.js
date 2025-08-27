import React, { useEffect, useRef } from 'react';

const SmartScrollView = ({ children }) => {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const sections = scrollContainerRef.current.querySelectorAll('.page-section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        return () => {
            sections.forEach(section => {
                sectionObserver.unobserve(section);
            });
        };
    }, [children]);

    return (
        <div className="scroll-container" ref={scrollContainerRef}>
            {children}
        </div>
    );
};

export default SmartScrollView;
