import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../database/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import MainHero from '../MainHero';
import { ThreeDots } from 'react-loader-spinner';
import TableOfContents from './TableofContent';
import './CourseDetail.css';
import Footer from '../comp/footer';
import Editor from '@monaco-editor/react';
import { SaveIcon, Copy, Code2, Menu, X, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const CodeEditor = ({ initialCode, language, onSave }) => {
  const [code, setCode] = useState(initialCode || '// Write your code here');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-gray-600" />
          <select
            className="text-sm bg-transparent border-none outline-none text-gray-700 font-medium"
            defaultValue={language}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              toast.success('Code copied to clipboard');
            }}
            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          {isEditing ? (
            <button
              onClick={() => {
                onSave(code);
                setIsEditing(false);
              }}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
              title="Save code"
            >
              <SaveIcon className="w-4 h-4 text-gray-600" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-2.5 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="h-[300px] border-t">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            readOnly: !isEditing,
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTocVisible, setTocVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const handleCodeSave = async (newCode) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        code: newCode
      });
      toast.success('Code saved successfully');
    } catch (error) {
      console.error('Error saving code:', error);
      toast.error('Failed to save code');
    }
  };

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const docRef = doc(db, 'courses', courseId);
        const courseDoc = await getDoc(docRef);
        if (courseDoc.exists()) {
          const courseData = courseDoc.data();
          setCourse(courseData);
          setSections(Array.isArray(courseData.sections) ? courseData.sections : []);
        } else {
          setError('Course not found.');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Error fetching course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [courseId]);

  useEffect(() => {
    // Observer for section scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId.startsWith('section-')) {
              setActiveSection(parseInt(sectionId.split('-')[1]));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all section elements
    document.querySelectorAll('[id^="section-"]').forEach(section => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#003656" height={80} width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg border border-red-100 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Course</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <MainHero
        title={course.title}
        description={course.description}
        image={course.icon}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4 order-2 lg:order-1">
            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                  Course Content
                </h2>

                {sections.length > 0 ? (
                  <div className="space-y-8">
                    {sections.map((section, index) => (
                      <div
                        key={index}
                        id={`section-${index}`}
                        className="scroll-mt-20 transition-all"
                      >
                        {section.type === 'subHeading' && (
                          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                            <ChevronRight className="inline-block mr-2 h-5 w-5 text-blue-600" />
                            {section.value}
                          </h3>
                        )}

                        {section.type === 'content' && (
                          <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: section.value }}
                          />
                        )}

                        {section.type === 'code' && (
                          <div className="my-6">
                            <pre className="bg-gray-900 text-gray-50 p-4 rounded-md overflow-x-auto">
                              <code className="text-sm font-mono">{section.value}</code>
                            </pre>
                          </div>
                        )}

                        {section.type === 'unorderedList' && (
                          <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700">
                            {Array.isArray(section.value) ? section.value.map((item, itemIndex) => (
                              <li key={itemIndex} className="pl-2">{item}</li>
                            )) : null}
                          </ul>
                        )}

                        {section.type === 'orderedList' && (
                          <ol className="list-decimal list-outside pl-5 space-y-2 text-gray-700">
                            {Array.isArray(section.value) ? section.value.map((item, itemIndex) => (
                              <li key={itemIndex} className="pl-2">{item}</li>
                            )) : null}
                          </ol>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p>No content available for this course.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Code Editor */}
            {course.code && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                  Interactive Code Lab
                </h2>
                <p className="text-gray-600 mb-4">
                  Try out the concepts you've learned in this interactive coding environment.
                  You can edit and save your code as you practice.
                </p>
                <CodeEditor
                  initialCode={course.code}
                  language={course.codeLanguage || 'javascript'}
                  onSave={handleCodeSave}
                />
              </div>
            )}
          </div>

          {/* Sidebar with Table of Contents */}
          <div className="lg:w-1/4 order-1 lg:order-2">
            <div className="sticky top-20">
              <div className="bg-white rounded-xl shadow-sm p-6 hidden lg:block">
                <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
                {course && sections.length > 0 &&
                  <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
                    {sections
                      .filter(section => section.type === 'subHeading')
                      .map((section, index) => {
                        // Find the actual index in the full sections array
                        const sectionIndex = sections.findIndex((s, i) => s === section);
                        return (
                          <a
                            href={`#section-${sectionIndex}`}
                            key={index}
                            className={`block py-2 px-3 rounded-md text-sm transition-colors ${activeSection === sectionIndex
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                              }`}
                          >
                            {section.value}
                          </a>
                        );
                      })
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile TOC toggle button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 lg:hidden flex items-center justify-center"
        onClick={() => setTocVisible(!isTocVisible)}
        aria-label={isTocVisible ? 'Close table of contents' : 'Open table of contents'}
      >
        {isTocVisible ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile TOC */}
      {isTocVisible && (
        <div className="fixed inset-0 bg-white z-50 lg:hidden overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-gray-900">Table of Contents</h2>
              <button
                onClick={() => setTocVisible(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                aria-label="Close table of contents"
              >
                <X size={24} />
              </button>
            </div>

            {sections
              .filter(section => section.type === 'subHeading')
              .map((section, index) => {
                // Find the actual index in the full sections array
                const sectionIndex = sections.findIndex((s, i) => s === section);
                return (
                  <a
                    href={`#section-${sectionIndex}`}
                    key={index}
                    className="block py-3 px-4 border-b border-gray-100 text-gray-800"
                    onClick={() => setTocVisible(false)}
                  >
                    {section.value}
                  </a>
                );
              })
            }
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetail;
