import React, { useEffect } from 'react';

const MiniMap = ({ refs, minimap }) => {
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

    const handleClick = (e, ref) => {
        e.preventDefault();
        ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <nav className="mini-map">
            {minimap && minimap.map(item => (
                <a
                    key={item.refName}
                    href={`#${item.refName}`}
                    className="map-item"
                    onClick={(e) => handleClick(e, refs[item.refName])}
                >
                    <span className="map-label">{item.label}</span>
                    <span className="map-dot"></span>
                </a>
            ))}
        </nav>
    );
};

export default MiniMap;
