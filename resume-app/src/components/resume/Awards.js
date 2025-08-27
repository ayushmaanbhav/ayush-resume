import React from 'react';

const Awards = ({ data }) => {
    if (!data) return null;

    return (
        <section id="awards" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">Additional Experience and Awards</h2>
                <div className="scrollable-content">
                    <ul className="awards-list">
                        {data.map((award, index) => (
                            <li key={index} className="award-entry" dangerouslySetInnerHTML={{ __html: award }}></li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Awards;
