import React from 'react';

const TimelinePopup = ({ jobs, highlightIndex, isVisible, onClose, onSelect }) => {
    // Using a ref to hold the popup element
    const popupRef = React.useRef(null);

    React.useEffect(() => {
        if (!isVisible || !popupRef.current) return;

        const handleClose = () => {
            if (onClose) onClose();
        };

        const handleSelect = (event) => {
            const group = event.target.closest('.timeline-stop-group');
            if (group && onSelect) {
                const index = parseInt(group.dataset.index, 10);
                if (!isNaN(index)) {
                    onSelect(index);
                }
            }
        };

        // Add event listener for the close button
        const closeButton = popupRef.current.querySelector('#close-popup-btn');
        if (closeButton) {
            closeButton.addEventListener('click', handleClose);
        }

        // Add event listeners for each timeline stop
        const timelineGroups = popupRef.current.querySelectorAll('.timeline-stop-group');
        timelineGroups.forEach(group => {
            group.addEventListener('click', handleSelect);
        });

        // Cleanup function to remove event listeners
        return () => {
            if (closeButton) {
                closeButton.removeEventListener('click', handleClose);
            }
            timelineGroups.forEach(group => {
                group.removeEventListener('click', handleSelect);
            });
        };
    }, [isVisible, onClose, onSelect, jobs]); // Rerun when jobs change as well

    if (!isVisible) return null;

    const generateTimelineHTML = () => {
        // --- CONFIGURATION ---
        const xStep = 180;
        const yStep = 150;
        const topPadding = 80;
        const sidePadding = 80;
        const textYOffset = 50;
        const textLineHeight = 18;
        const iconYOffset = -5;
        const cornerRadius = 20;
        const turnClearance = 80;
        const maxWidth = Math.min(window.innerWidth * 0.9, 900);

        // --- CALCULATE LAYOUT ---
        const itemsPerRow = Math.max(1, Math.floor((maxWidth - sidePadding * 2) / xStep));
        // const numRows = Math.ceil(jobs.length / itemsPerRow);

        let points = [];
        jobs.forEach((job, i) => {
            const rowIndex = Math.floor(i / itemsPerRow);
            const colIndex = i % itemsPerRow;
            const isReversedRow = rowIndex % 2 !== 0;
            const effectiveColIndex = isReversedRow ? itemsPerRow - 1 - colIndex : colIndex;
            
            const x = sidePadding + effectiveColIndex * xStep;
            const y = topPadding + rowIndex * yStep;
            points.push({ x, y, job, rowIndex, isReversedRow });
        });

        const minX = Math.min(...points.map(p => p.x));
        const maxX = Math.max(...points.map(p => p.x));

        const actualMinX = minX - turnClearance - 20;
        const actualMaxX = maxX + turnClearance + 20;
        
        const svgContentWidth = actualMaxX - actualMinX;
        
        const lastPoint = points[points.length - 1];
        const svgHeight = lastPoint.y + topPadding;

        // --- GENERATE SVG ELEMENTS ---
        let pathPoints = '';
        let elements = '';

        points.forEach((p, i) => {
            if (i === 0) {
                pathPoints += `M ${p.x} ${p.y}`;
            } else {
                const prev = points[i - 1];
                if (p.rowIndex > prev.rowIndex) { // A row transition
                    const turnDirection = prev.isReversedRow ? -1 : 1;
                    const turnX = prev.x + (turnClearance * turnDirection);
                    
                    pathPoints += ` L ${turnX - (cornerRadius * turnDirection)} ${prev.y}`;
                    pathPoints += ` Q ${turnX} ${prev.y}, ${turnX} ${prev.y + cornerRadius}`;
                    pathPoints += ` L ${turnX} ${p.y - cornerRadius}`;
                    pathPoints += ` Q ${turnX} ${p.y}, ${turnX - (cornerRadius * turnDirection)} ${p.y}`;
                    pathPoints += ` L ${p.x} ${p.y}`;
                } else { // Same row
                    pathPoints += ` L ${p.x} ${p.y}`;
                }
            }

            // --- Draw Text and Icons ---
            const isHighlighted = i === highlightIndex ? 'highlighted' : '';
            const textDirection = -1; // ALWAYS show text above the line
            
            const textAnchorY = p.y + (textDirection * textYOffset);
            const dateAnchorY = textAnchorY + textLineHeight; // ALWAYS show date below company name
            const originalJobIndex = i;
            
            elements += `
                <g class="timeline-stop-group" data-index="${originalJobIndex}" style="animation-delay: ${i * 0.2}s;">
                    <text x="${p.x}" y="${p.y + iconYOffset}" class="location-icon ${isHighlighted}" text-anchor="middle">📍</text>
                    <text x="${p.x}" y="${textAnchorY}" class="company-text ${isHighlighted}" text-anchor="middle">${p.job.company}</text>
                    <text x="${p.x}" y="${dateAnchorY}" class="company-text company-date ${isHighlighted}" text-anchor="middle">${p.job.date}</text>
                </g>
            `;
        });

        const pathCasing = `<path class="timeline-path-casing" d="${pathPoints}" />`;
        const path = `<path class="timeline-path" d="${pathPoints}" />`;
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const closeButtonHTML = isTouchDevice ? `<button id="close-popup-btn">Close</button>` : '';

        return `
            <div class="timeline-scroll-wrapper">
                <svg class="timeline-svg" width="${svgContentWidth}" height="${svgHeight}" viewBox="${actualMinX} 0 ${svgContentWidth} ${svgHeight}">
                    ${pathCasing}
                    ${path}
                    ${elements}
                </svg>
            </div>
            ${closeButtonHTML}
        `;
    };

    return (
        <div id="timeline-popup" ref={popupRef} className={isVisible ? 'visible' : ''} dangerouslySetInnerHTML={{ __html: generateTimelineHTML() }}></div>
    );
};

export default TimelinePopup;
