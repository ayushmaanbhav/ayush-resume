import React from 'react';

const Navigation = ({ activeSection }) => {
    const navItems = [
        { id: 'summary', label: 'Summary' },
        { id: 'experience', label: 'Experience' },
        { id: 'education', label: 'Education' },
        { id: 'publications', label: 'Publications' },
        { id: 'awards', label: 'Awards' },
        { id: 'skills', label: 'Skills' },
        { id: 'hobbies', label: 'Hobbies' },
        { id: 'ai-tool', label: 'AI Assistant' }
    ];

    return (
        <nav className="navigation-sidebar">
            <ul>
                {navItems.map(item => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className={activeSection === item.id ? 'active' : ''}
                        >
                            <span>{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
