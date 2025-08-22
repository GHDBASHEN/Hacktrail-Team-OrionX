import React, { useState, useEffect } from 'react';

const Help = ({ tz }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState([]);

  useEffect(() => {
    if (tz?.sections?.length) {
      setActiveSection(tz.sections[0].id);
      setFilteredSections(tz.sections);
    }
  }, [tz]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSections(tz?.sections || []);
      return;
    }
    
    const filtered = tz?.sections?.filter(section => 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.intro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.features.some(feature => 
        feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    setFilteredSections(filtered || []);
  }, [searchTerm, tz]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-800 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Help Center</h1>
              <p className="text-gray-300">
                Documentation and guides for all features
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute right-3 top-3 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 max-w-6xl mx-auto w-full p-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit md:sticky md:top-16">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Help Topics</h2>
          <nav className="space-y-1">
            {filteredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-3 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-3 ${activeSection === section.id ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  {section.title}
                </div>
              </button>
            ))}
            
            {filteredSections.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No help topics found for "{searchTerm}"
              </div>
            )}
          </nav>
          
          {/* {tz?.contact && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-2 text-gray-700 text-sm">Need additional help?</h3>
              <p className="text-xs text-gray-600">
                {tz.contact.email && `Email: ${tz.contact.email}`}
                {tz.contact.phone && <br />}
                {tz.contact.phone && `Phone: ${tz.contact.phone}`}
              </p>
            </div>
          )} */}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {filteredSections.map((section) => (
            activeSection === section.id && (
              <Section 
                key={section.id}
                title={section.title}
                intro={section.intro}
                features={section.features}
                notes={section.notes}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, intro, features, notes }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="bg-gray-800 p-5">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-gray-300 mt-1">{intro}</p>
    </div>
    
    <div className="p-5">
      <div className="space-y-4">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            bullets={feature.bullets}
            subsections={feature.subsections}
            table={feature.table}
          />
        ))}
      </div>
      
      {notes && notes.map((note, index) => (
        <NoteCard 
          key={index}
          type={note.type}
          title={note.title}
          content={note.content}
          bullets={note.bullets}
        />
      ))}
    </div>
  </div>
);

// Reusable Feature Card Component
const FeatureCard = ({ title, description, icon, bullets, subsections, table }) => (
  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
    <div className="flex items-start">
      <div className="text-xl mr-3 mt-0.5 text-blue-600">{icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        {description && <p className="text-gray-600 text-sm mb-3">{description}</p>}
        
        {bullets && (
          <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="py-1">{bullet}</li>
            ))}
          </ul>
        )}
        
        {subsections && subsections.map((subsection, idx) => (
          <div key={idx} className="mt-3">
            <p className="font-medium mb-1 text-gray-700 text-sm">{subsection.title}:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
              {subsection.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="py-1">{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
        
        {table && (
          <div className="mt-4 overflow-x-auto rounded-md border border-gray-200 text-sm">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  {table.columns.map((col, idx) => (
                    <th key={idx} className="p-2 text-left text-gray-700 font-medium">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="p-2 text-gray-600">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Reusable Note Card Component
const NoteCard = ({ type, title, content, bullets }) => {
  const colors = {
    tip: { 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      title: 'text-green-800', 
      text: 'text-green-700',
      icon: '💡'
    },
    important: { 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200', 
      title: 'text-yellow-800', 
      text: 'text-yellow-700',
      icon: '⚠️'
    },
    consideration: { 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      title: 'text-blue-800', 
      text: 'text-blue-700',
      icon: 'ℹ️'
    },
    default: { 
      bg: 'bg-gray-50', 
      border: 'border-gray-200', 
      title: 'text-gray-800', 
      text: 'text-gray-700',
      icon: '📌'
    }
  };
  
  const colorSet = colors[type] || colors.default;
  
  return (
    <div className={`mt-5 p-4 rounded-md border ${colorSet.bg} ${colorSet.border}`}>
      <div className="flex items-start">
        <div className="text-lg mr-2">{colorSet.icon}</div>
        <div>
          <p className={`font-medium ${colorSet.title}`}>{title}</p>
          
          {content && <p className={`mt-1 text-sm ${colorSet.text}`}>{content}</p>}
          
          {bullets && (
            <ul className={`list-disc pl-5 mt-1 space-y-1 text-sm ${colorSet.text}`}>
              {bullets.map((bullet, idx) => (
                <li key={idx} className="py-0.5">{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;