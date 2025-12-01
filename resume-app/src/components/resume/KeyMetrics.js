import React, { useEffect, useRef, useState } from 'react';

const metricIcons = {
    'Products': '🚀',
    'Conversion Lift': '📈',
    'Peak DAU': '👥',
    'MAU': '🌐',
    'User Interviews': '🎯',
    'Domains': '💼'
};

const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [displayValue, setDisplayValue] = useState('0');
    const elementRef = useRef(null);
    const animatedRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animatedRef.current) {
                        animatedRef.current = true;
                        animateValue();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [value]);

    const animateValue = () => {
        // Extract numeric part and suffix
        const match = value.match(/^([\d.]+)(.*)$/);
        if (!match) {
            setDisplayValue(value);
            return;
        }

        const numericValue = parseFloat(match[1]);
        const suffix = match[2] || '';
        const startTime = performance.now();
        const isDecimal = value.includes('.');

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = numericValue * easeOutQuart;

            if (isDecimal) {
                setDisplayValue(currentValue.toFixed(0) + suffix);
            } else {
                setDisplayValue(Math.floor(currentValue) + suffix);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };

        requestAnimationFrame(animate);
    };

    return <span ref={elementRef}>{displayValue}</span>;
};

const KeyMetrics = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <section id="metrics" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">
                    <span style={{ marginRight: '0.5rem' }}>📊</span>
                    Impact at a Glance
                </h2>
                <div className="scrollable-content">
                    <div className="metrics-grid fade-stagger">
                        {data.map((metric, index) => (
                            <div
                                key={index}
                                className={`metric-card ${metric.accent ? 'metric-accent' : ''}`}
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <span className="metric-icon">
                                    {metricIcons[metric.label] || '✨'}
                                </span>
                                <div className="metric-value">
                                    <AnimatedNumber value={metric.value} duration={1500 + index * 200} />
                                </div>
                                <div className="metric-label">{metric.label}</div>
                                <div className="metric-sublabel">{metric.sublabel}</div>
                                {/* Decorative ring */}
                                <svg className="metric-ring" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" style={{ animationDelay: `${index * 0.2}s` }} />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KeyMetrics;
