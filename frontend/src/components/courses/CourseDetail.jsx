import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../database/Firebase';
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import MainHero from '../MainHero';
import { ThreeDots } from 'react-loader-spinner';
import TableOfContents from './TableofContent';
import './CourseDetail.css';
import Footer from '../comp/footer';
import Editor from '@monaco-editor/react';
import { SaveIcon, Copy, Code2, Menu, X, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';

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

// Quiz Component
const QuizComponent = ({ courseId, courseName, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    // Function to generate quiz questions
    const generateQuiz = async () => {
      try {
        setLoading(true);

        // This would be your API call to generate questions with AI
        // For now, we'll use placeholder questions
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId }),
        });

        // If you don't have the API ready, use these sample questions
        const sampleQuestions = [
          {
            id: 1,
            question: "What is the main purpose of this course?",
            options: [
              "Entertainment only",
              "Learning new skills",
              "Social networking",
              "Gaming"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Which programming concept was covered in the course?",
            options: [
              "Database design",
              "Machine learning",
              "Object-oriented programming",
              "Network security"
            ],
            correctAnswer: 2
          },
          {
            id: 3,
            question: "What is a key benefit of the technique taught in section 2?",
            options: [
              "Reduces code complexity",
              "Increases loading speed",
              "Improves security",
              "All of the above"
            ],
            correctAnswer: 3
          },
          {
            id: 4,
            question: "Which tool was recommended for productivity?",
            options: [
              "VS Code",
              "Eclipse",
              "Notepad",
              "Word"
            ],
            correctAnswer: 0
          },
          {
            id: 5,
            question: "What was the main challenge discussed in the final section?",
            options: [
              "Code optimization",
              "User interface design",
              "Deployment strategies",
              "Testing methods"
            ],
            correctAnswer: 2
          }
        ];

        setQuestions(sampleQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error generating quiz:", error);
        toast.error("Failed to generate quiz questions");
        setLoading(false);
      }
    };

    generateQuiz();
  }, [courseId]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex
    });
  };

  const calculateScore = async () => {
    let correct = 0;

    questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const percentage = (correct / questions.length) * 100;
    setScore(percentage);

    // If score is 70% or higher, award badge
    if (percentage >= 70 && user) {
      try {
        const badgeData = {
          courseId,
          courseName,
          earnedAt: new Date(),
          score: percentage,
          badgeType: percentage >= 90 ? "gold" : percentage >= 80 ? "silver" : "bronze"
        };

        // Update user document with badge and score
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          badges: arrayUnion(badgeData),
          completedCourses: arrayUnion({
            id: courseId,
            completedAt: new Date(),
            score: percentage
          })
        });

        toast.success(`Congratulations! You've earned a ${badgeData.badgeType} badge!`);

        // Notify parent component
        if (onComplete) {
          onComplete(percentage, badgeData.badgeType);
        }
      } catch (error) {
        console.error("Error saving badge:", error);
        toast.error("Failed to save your achievement");
      }
    } else if (user) {
      toast.info("You need to score at least 70% to earn a badge. Try again!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <ThreeDots color="#003656" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Completion Quiz</h2>

      {score !== null ? (
        <div className="text-center py-8">
          <div className={`text-5xl font-bold mb-4 ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.round(score)}%
          </div>
          <p className="text-xl mb-6">
            You answered {Object.keys(userAnswers).filter(qId =>
              userAnswers[qId] === questions.find(q => q.id.toString() === qId.toString())?.correctAnswer
            ).length} out of {questions.length} questions correctly.
          </p>

          {score >= 70 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4">
                <img
                  src={`/badges/${score >= 90 ? 'gold' : score >= 80 ? 'silver' : 'bronze'}-badge.png`}
                  alt="Achievement Badge"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
              <p className="text-green-700">
                You've earned a {score >= 90 ? 'Gold' : score >= 80 ? 'Silver' : 'Bronze'} badge for this course!
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-amber-800 mb-2">Almost there!</h3>
              <p className="text-amber-700 mb-4">
                You need to score at least 70% to earn a badge. Review the course content and try again.
              </p>
              <button
                onClick={() => setScore(null)}
                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="border-b pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
              <h3 className="text-lg font-semibold mb-3">
                Question {index + 1}: {question.question}
              </h3>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${userAnswers[question.id] === optionIndex
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50'
                      }`}
                    onClick={() => handleAnswerSelect(question.id, optionIndex)}
                  >
                    <label className="flex items-center cursor-pointer w-full">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={userAnswers[question.id] === optionIndex}
                        onChange={() => { }}
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={calculateScore}
            disabled={Object.keys(userAnswers).length < questions.length}
            className={`w-full py-3 rounded-lg font-medium ${Object.keys(userAnswers).length === questions.length
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              } transition-colors`}
          >
            Submit Answers
          </button>

          {Object.keys(userAnswers).length < questions.length && (
            <p className="text-center text-amber-600 text-sm">
              Please answer all questions to submit
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTocVisible, setTocVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [courseProgress, setCourseProgress] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

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

  // Fetch user's course progress
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const progress = userData.courseProgress || {};
          const userCourseProgress = progress[courseId] || { lastSectionViewed: 0, completed: false };
          setCourseProgress(userCourseProgress);

          // Check if user has completed this course but not taken quiz
          if (userCourseProgress.completed && !userCourseProgress.quizTaken) {
            setShowQuiz(true);
          }

          // Check if user has earned badge for this course
          const badge = (userData.badges || []).find(b => b.courseId === courseId);
          if (badge) {
            setEarnedBadge(badge);
          }
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    fetchUserProgress();
  }, [user, courseId]);

  // Update user's progress as they view sections
  const updateUserProgress = async (sectionIndex) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const progress = userData.courseProgress || {};
        const currentProgress = progress[courseId] || { lastSectionViewed: 0, completed: false };

        // Only update if viewing a later section
        if (sectionIndex > currentProgress.lastSectionViewed) {
          const updatedProgress = {
            ...progress,
            [courseId]: {
              ...currentProgress,
              lastSectionViewed: sectionIndex,
              completed: sectionIndex >= sections.length - 1
            }
          };

          await updateDoc(userRef, {
            courseProgress: updatedProgress
          });

          setCourseProgress({
            ...currentProgress,
            lastSectionViewed: sectionIndex,
            completed: sectionIndex >= sections.length - 1
          });

          // Show quiz when user reaches the end
          if (sectionIndex >= sections.length - 1) {
            setShowQuiz(true);
          }
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Calculate visible sections (10% for unregistered users)
  const getVisibleSections = () => {
    if (!sections.length) return [];

    if (user) {
      return sections; // Registered users see all content
    } else {
      // Unregistered users see only 10% of content
      const visibleCount = Math.max(1, Math.ceil(sections.length * 0.1));
      return sections.slice(0, visibleCount);
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (score, badgeType) => {
    setEarnedBadge({
      courseId,
      courseName: course.title,
      score,
      badgeType,
      earnedAt: new Date()
    });
  };

  useEffect(() => {
    // Observer for section scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId.startsWith('section-')) {
              const sectionIndex = parseInt(sectionId.split('-')[1]);
              setActiveSection(sectionIndex);
              updateUserProgress(sectionIndex);
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
  }, [sections, user]);

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

  const visibleSections = getVisibleSections();

  return (
    <div className="bg-gray-50">
      <MainHero
        title={course.title}
        description={course.description}
        image={course.icon}
      />

      <div className="container mx-auto px-4 py-8">
        {earnedBadge && (
          <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 flex items-center">
            <div className="w-16 h-16 mr-6">
              <img
                src={`/badges/${earnedBadge.badgeType}-badge.png`}
                alt="Achievement Badge"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800">Achievement Unlocked!</h3>
              <p className="text-amber-700">
                You've earned a {earnedBadge.badgeType.charAt(0).toUpperCase() + earnedBadge.badgeType.slice(1)} badge for this course with a score of {Math.round(earnedBadge.score)}%.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4 order-2 lg:order-1">
            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">
                  Course Content
                </h2>

                {visibleSections.length > 0 ? (
                  <div className="space-y-8">
                    {visibleSections.map((section, index) => (
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m-6-6h6m-6 0H6" />
                    </svg>
                    <p>No content available for this course.</p>
                  </div>
                )}

                {/* Content restriction message for non-registered users */}
                {!user && sections.length > visibleSections.length && (
                  <div className="mt-10 border-t pt-10 border-dashed">
                    <div className="bg-gradient-to-b from-transparent to-white relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center bg-white border border-gray-200 shadow-lg rounded-xl p-8 max-w-lg">
                          <div className="flex justify-center mb-4">
                            <Lock className="w-12 h-12 text-blue-500" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Unlock the Full Course
                          </h3>
                          <p className="text-gray-600 mb-6">
                            You're currently viewing just 10% of this course content. Register or log in to access the complete course, interactive features, and earn certificates.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                              onClick={() => navigate("/login")}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Log In
                            </button>
                            <button
                              onClick={() => navigate("/signup")}
                              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                            >
                              Register Now
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Blurred preview of remaining content */}
                      <div className="h-40 overflow-hidden blur-sm opacity-40">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                          Next Section
                        </h3>
                        <p className="text-gray-700">
                          This content is only available to registered users. Sign up to continue learning and access all features.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Code Editor - only for registered users */}
            {user && course.code && (
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

            {/* Quiz component - shows when user has completed the course */}
            {user && showQuiz && !earnedBadge && (
              <QuizComponent
                courseId={courseId}
                courseName={course.title}
                onComplete={handleQuizComplete}
              />
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

                        // Check if this section is accessible to the user
                        const isAccessible = user || sectionIndex < visibleSections.length;

                        return (
                          <a
                            href={isAccessible ? `#section-${sectionIndex}` : "#"}
                            key={index}
                            className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors ${!isAccessible
                                ? 'text-gray-400 cursor-not-allowed'
                                : activeSection === sectionIndex
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                          >
                            {!isAccessible && <Lock className="w-3 h-3 mr-2 text-gray-400" />}
                            {section.value}
                          </a>
                        );
                      })
                    }
                  </div>
                }

                {/* Course progress for registered users */}
                {user && courseProgress && sections.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-bold text-gray-900 mb-2">Your Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, (courseProgress.lastSectionViewed / (sections.length - 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {courseProgress.completed ? "Course completed" : `${Math.round((courseProgress.lastSectionViewed / (sections.length - 1)) * 100)}% complete`}
                    </p>
                  </div>
                )}
              </div>

              {/* If user has earned a badge, show it in sidebar */}
              {user && earnedBadge && (
                <div className="mt-4 bg-white rounded-xl shadow-sm p-6 hidden lg:block">
                  <h3 className="font-bold text-gray-900 mb-2">Your Achievement</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 my-4">
                      <img
                        src={`/badges/${earnedBadge.badgeType}-badge.png`}
                        alt="Achievement Badge"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-center text-gray-600">
                      {earnedBadge.badgeType.charAt(0).toUpperCase() + earnedBadge.badgeType.slice(1)} Badge
                    </p>
                    <p className="text-center font-bold text-blue-600">
                      {Math.round(earnedBadge.score)}% Score
                    </p>
                  </div>
                </div>
              )}
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

                // Check if this section is accessible to the user
                const isAccessible = user || sectionIndex < visibleSections.length;

                return (
                  <a
                    href={isAccessible ? `#section-${sectionIndex}` : "#"}
                    key={index}
                    className={`flex items-center py-3 px-4 border-b border-gray-100 ${!isAccessible ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'
                      }`}
                    onClick={() => isAccessible && setTocVisible(false)}
                  >
                    {!isAccessible && <Lock className="w-4 h-4 mr-2 text-gray-400" />}
                    {section.value}
                  </a>
                );
              })
            }

            {!user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 mb-3">
                  Register to unlock the complete course and earn a certificate
                </p>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setTocVisible(false);
                  }}
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetail;
