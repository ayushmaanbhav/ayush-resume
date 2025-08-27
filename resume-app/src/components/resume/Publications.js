import React from 'react';

const Publications = ({ data }) => {
    if (!data) return null;

    return (
        <section id="publications" className="page-section">
            <div className="scrollable-content-wrapper">
                <h2 className="text-center mb-4 flex-shrink-0">Publications and Open Source</h2>
                <div className="scrollable-content">
                    <ul className="publication-list">
                        {data.map((pub, index) => (
                            <li key={index} className="publication-entry">
                                <div className="publication-title">
                                    <div dangerouslySetInnerHTML={{ __html: pub.title }} />
                                    <div className="publication-links">
                                        {pub.links.map((link, i) => (
                                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Publications;
