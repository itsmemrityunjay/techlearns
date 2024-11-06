import React, { useState, useEffect } from 'react';

const TableOfContents = ({ sections }) => {
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(Number(entry.target.dataset.index));
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '0px',
            threshold: 0.6,
        });

        sections.forEach((_, index) => {
            const sectionElement = document.getElementById(`section-${index}`);
            if (sectionElement) {
                sectionElement.dataset.index = index;
                observer.observe(sectionElement);
            }
        });

        return () => {
            sections.forEach((_, index) => {
                const sectionElement = document.getElementById(`section-${index}`);
                if (sectionElement) observer.unobserve(sectionElement);
            });
        };
    }, [sections]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-16 ml-8 transition-all transform hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Table of Contents</h2>
            <ul className="space-y-3">
                {sections.map((section, index) => {
                    if (section.type === 'subHeading') {
                        const isActive = activeSection === index;
                        return (
                            <li key={index} className="transition transform duration-200 hover:scale-105">
                                <a
                                    href={`#section-${index}`}
                                    className={`block text-lg font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600'
                                        } ${isActive ? 'font-bold' : 'hover:text-indigo-400'}`}
                                >
                                    {section.value}
                                </a>
                                {isActive && (
                                    <div className="h-1 w-full bg-indigo-600 mt-1 rounded transition-all duration-300" />
                                )}
                            </li>
                        );
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export default TableOfContents;
