import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../database/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import MainHero from '../MainHero';
import { ThreeDots } from 'react-loader-spinner';
import TableOfContents from './TableofContent';
import './CourseDetail.css';
import Footer from '../comp/footer';
import Editor from '@monaco-editor/react';
import { SaveIcon, Copy, Code2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { updateDoc } from 'firebase/firestore';

const CodeEditor = ({ initialCode, language, onSave }) => {
  const [code, setCode] = useState(initialCode || '// Write your code here');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-gray-600" />
          <select 
            className="text-sm bg-transparent border-none outline-none"
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
            onClick={() => navigator.clipboard.writeText(code)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          {isEditing ? (
            <button
              onClick={() => {
                onSave(code);
                setIsEditing(false);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <SaveIcon className="w-4 h-4 text-gray-600" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ThreeDots color="#003656" height={80} width={80} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <MainHero
                title={course.title}
                description={course.description}
                image={course.icon}
            />
            <div className="flex mt-6 scrollbar-hidden scrollbar">
                {/* Course Content Section */}
                <div
                    className={`w-full md:w-4/5 pr-6 overflow-y-auto overflow-hidden max-h-[80vh] ${isTocVisible ? 'hidden' : 'block'} sm:block scrollbar-hidden scrollbar`}
                >
                    {course ? (
                        <div className="course-content grid grid-cols-1 gap-6 scrollbar-hidden scrollbar">
                            {sections.length > 0 ? (
                                sections.map((section, index) => (
                                    <div key={index} id={`section-${index}`} className="bg-white rounded-lg shadow-sm p-4  transition-shadow duration-300">
                                        {section.type === 'subHeading' && (

                                            <h3 className="text-2xl font-bold mb-2 mt-5  text-gray-800">
                                                {section.value}
                                            </h3>

                                        )}
                                        {section.type === 'content' && (
                                            <div className="mb-4 text-lg text-gray-800" dangerouslySetInnerHTML={{ __html: section.value }} />
                                        )}
                                        {section.type === 'code' && (
                                            <pre className="bg-blue-100 p-4 rounded-md overflow-x-auto">
                                                <code className="text-lg text-green-900">{section.value}</code>
                                            </pre>
                                        )}
                                        {section.type === 'unorderedList' && (
                                            <ul className="list-disc list-outside pl-5 mb-4 text-lg text-gray-800">
                                                {Array.isArray(section.value) ? section.value.map((item, itemIndex) => (
                                                    <li key={itemIndex}>{item}</li>
                                                )) : null}
                                            </ul>
                                        )}
                                        {section.type === 'orderedList' && (
                                            <ol className="list-decimal list-outside pl-4 mb-4 text-lg text-orange-800">
                                                {Array.isArray(section.value) ? section.value.map((item, itemIndex) => (
                                                    <li key={itemIndex}>{item}</li>
                                                )) : null}
                                            </ol>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No content available for this course.</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-center">Course not found</p>
                    )}
                    <p className="text-gray-400 mt-6 text-center">
                        Loaded {sections.length} sections
                    </p>
                </div>

                {/* Table of Contents Section */}
                <div className={`w-1/5 hidden md:block sticky top-20`}>
                    {course && <TableOfContents sections={sections} />}
                </div>
            </div>

            {/* Toggle button for mobile */}
            <button
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 sm:hidden"
                onClick={() => setTocVisible(!isTocVisible)}
            >
                {isTocVisible ? '✖' : '☰'}
            </button>

            {/* Mobile TOC */}
            {isTocVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-white p-6 overflow-y-auto z-40 sm:hidden">
                    <TableOfContents sections={sections} />
                    <button
                        className="absolute top-4 right-4 text-2xl text-blue-500"
                        onClick={() => setTocVisible(false)}
                    >
                        ✖
                    </button>
                </div>
            )}
    <div className="max-w-4xl mx-auto p-4">
      {course.code && (
        <CodeEditor
          initialCode={course.code}
          language={course.codeLanguage || 'javascript'}
          onSave={handleCodeSave}
        />
      )}
    </div>



            <Footer />
        </div>

    );
};

export default CourseDetail;
