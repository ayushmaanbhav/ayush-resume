import React from 'react';

const Publications = ({ publications }) => (
  <section id="publications" className="resume-section">
    <h2>Publications and Open Source Contributions</h2>
    <div className="publication-entry">
      <ul>
        {publications.map((pub, index) => (
          <li key={index}>
            <span dangerouslySetInnerHTML={{ __html: pub.title }} />
            {pub.links && pub.links.length > 0 && (
              <i>
                {' ['}
                {pub.links.map((link, i) => (
                  <React.Fragment key={i}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                    {i < pub.links.length - 1 && '] ['}
                  </React.Fragment>
                ))}
                {']'}
              </i>
            )}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Publications;
