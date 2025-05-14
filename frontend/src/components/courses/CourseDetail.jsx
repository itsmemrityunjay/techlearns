"use client"

import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { db, auth } from "../../database/Firebase"
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore"
import MainHero from "../MainHero"
import { ThreeDots } from "react-loader-spinner"
import { format } from "date-fns"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import "./CourseDetail.css"
import Footer from "../comp/footer"
import Editor from "@monaco-editor/react"
import ReactDOM from "react-dom/client"
import {
  SaveIcon,
  Copy,
  Code2,
  Menu,
  X,
  ChevronRight,
  Lock,
  Loader2,
  GraduationCap,
  LogIn,
  UserPlus,
  Check,
} from "lucide-react"
import { toast } from "react-toastify"
import { useAuthState } from "react-firebase-hooks/auth"
import bronzeBadge from "../../assets/bronze-badge.png" // Adjust path as needed
import silverBadge from "../../assets/silver-badge.png"
import goldBadge from "../../assets/gold-badge.png"

const badgeImages = {
  bronze: bronzeBadge,
  silver: silverBadge,
  gold: goldBadge,
}

const Certificate = React.forwardRef(({ user, course, completionDate }, ref) => (
  <div ref={ref} style={{ width: "1000px", height: "700px", backgroundColor: "#ffffff" }}>
    <div style={{ padding: "4rem", border: "8px double #1e3a8a" }}>
      <h1 style={{ fontSize: "2.25rem", color: "#1e3a8a", textAlign: "center" }}>
        Certificate of Completion
      </h1>
      <div style={{ margin: "3rem 0", textAlign: "center" }}>
        <p>This is to certify that</p>
        <h2 style={{ fontSize: "1.875rem", color: "#1e3a8a", margin: "1rem 0" }}>
          {user?.displayName || user?.email}
        </h2>
        <p>has successfully completed</p>
        <h3 style={{ fontSize: "1.5rem", color: "#1e3a8a", margin: "1rem 0" }}>
          {course?.title}
        </h3>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4rem" }}>
        <div>
          <div style={{ color: "#666666" }}>Date Issued</div>
          <div>{format(completionDate, "MMMM dd, yyyy")}</div>
        </div>
        <div>
          <div style={{ color: "#666666" }}>Certificate ID</div>
          <div>{`${course?.id}-${user?.uid?.slice(0, 8)}`}</div>
        </div>
      </div>
    </div>
  </div>
))

const CodeEditor = ({ initialCode, language, onSave }) => {
  const [code, setCode] = useState(initialCode || "// Write your code here")
  const [isEditing, setIsEditing] = useState(false)

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
              navigator.clipboard.writeText(code)
              toast.success("Code copied to clipboard")
            }}
            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>
          {isEditing ? (
            <button
              onClick={() => {
                onSave(code)
                setIsEditing(false)
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
            lineNumbers: "on",
            renderLineHighlight: "all",
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}

// Quiz Component
const QuizComponent = ({ courseId, courseName, onComplete }) => {
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth)

  useEffect(() => {
    // Function to generate quiz questions
    const generateQuiz = async () => {
      try {
        setLoading(true)

        // This would be your API call to generate questions with AI
        // For now, we'll use placeholder questions
        const response = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        })

        // If you don't have the API ready, use these sample questions
        const sampleQuestions = [
          {
            id: 1,
            question: "What is the main purpose of this course?",
            options: ["Entertainment only", "Learning new skills", "Social networking", "Gaming"],
            correctAnswer: 1,
          },
          {
            id: 2,
            question: "Which programming concept was covered in the course?",
            options: ["Database design", "Machine learning", "Object-oriented programming", "Network security"],
            correctAnswer: 2,
          },
          {
            id: 3,
            question: "What is a key benefit of the technique taught in section 2?",
            options: ["Reduces code complexity", "Increases loading speed", "Improves security", "All of the above"],
            correctAnswer: 3,
          },
          {
            id: 4,
            question: "Which tool was recommended for productivity?",
            options: ["VS Code", "Eclipse", "Notepad", "Word"],
            correctAnswer: 0,
          },
          {
            id: 5,
            question: "What was the main challenge discussed in the final section?",
            options: ["Code optimization", "User interface design", "Deployment strategies", "Testing methods"],
            correctAnswer: 2,
          },
        ]

        setQuestions(sampleQuestions)
        setLoading(false)
      } catch (error) {
        console.error("Error generating quiz:", error)
        toast.error("Failed to generate quiz questions")
        setLoading(false)
      }
    }

    generateQuiz()
  }, [courseId])

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex,
    })
  }

  const calculateScore = async () => {
    let correct = 0

    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })

    const percentage = (correct / questions.length) * 100
    setScore(percentage)

    // If score is 70% or higher, award badge
    if (percentage >= 70 && user) {
      try {
        const badgeData = {
          courseId,
          courseName,
          earnedAt: new Date(),
          score: percentage,
          badgeType: percentage >= 90 ? "gold" : percentage >= 80 ? "silver" : "bronze",
        }

        // Update user document with badge and score
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          badges: arrayUnion(badgeData),
          completedCourses: arrayUnion({
            id: courseId,
            completedAt: new Date(),
            score: percentage,
          }),
        })

        toast.success(`Congratulations! You've earned a ${badgeData.badgeType} badge!`)

        // Notify parent component
        if (onComplete) {
          onComplete(percentage, badgeData.badgeType)
        }
      } catch (error) {
        console.error("Error saving badge:", error)
        toast.error("Failed to save your achievement")
      }
    } else if (user) {
      toast.info("You need to score at least 70% to earn a badge. Try again!")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <ThreeDots color="#003656" height={50} width={50} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Completion Quiz</h2>

      {score !== null ? (
        <div className="text-center py-8">
          <div className={`text-5xl font-bold mb-4 ${score >= 70 ? "text-green-600" : "text-red-600"}`}>
            {Math.round(score)}%
          </div>
          <p className="text-xl mb-6">
            You answered{" "}
            {
              Object.keys(userAnswers).filter(
                (qId) => userAnswers[qId] === questions.find((q) => q.id.toString() === qId.toString())?.correctAnswer,
              ).length
            }{" "}
            out of {questions.length} questions correctly.
          </p>

          {score >= 70 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4">
                <img
                  src={`/badges/${score >= 90 ? "gold" : score >= 80 ? "silver" : "bronze"}-badge.png`}
                  alt="Achievement Badge"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
              <p className="text-green-700">
                You've earned a {score >= 90 ? "Gold" : score >= 80 ? "Silver" : "Bronze"} badge for this course!
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
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      userAnswers[question.id] === optionIndex ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleAnswerSelect(question.id, optionIndex)}
                  >
                    <label className="flex items-center cursor-pointer w-full">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={userAnswers[question.id] === optionIndex}
                        onChange={() => {}}
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
            className={`w-full py-3 rounded-lg font-medium ${
              Object.keys(userAnswers).length === questions.length
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            } transition-colors`}
          >
            Submit Answers
          </button>

          {Object.keys(userAnswers).length < questions.length && (
            <p className="text-center text-amber-600 text-sm">Please answer all questions to submit</p>
          )}
        </div>
      )}
    </div>
  )
}

// Add Enrollment CTA Component
const EnrollmentCTA = ({ isLoggedIn, onEnroll }) => {
  const navigate = useNavigate()
  const [isEnrolling, setIsEnrolling] = useState(false)

  const handleEnrollment = async () => {
    setIsEnrolling(true)
    try {
      await onEnroll()
      toast.success("Successfully enrolled! 🎉")
    } catch (error) {
      toast.error("Enrollment failed. Please try again.")
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <div className="relative my-10">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-white" />

      {/* Content Lock Card */}
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 transform hover:-translate-y-1 transition-all">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {isLoggedIn ? "🎓 Unlock Full Course Access" : "👋 Join to Start Learning"}
          </h3>

          <p className="text-gray-600 mb-8">
            {isLoggedIn
              ? "Get instant access to all course materials, interactive exercises, and earn a certificate upon completion."
              : "Create your account to unlock the complete course content and join our learning community."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <button
                onClick={handleEnrollment}
                disabled={isEnrolling}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    Enroll Now
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row w-full gap-4">
                <button
                  onClick={() => navigate("/signin")}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 
                           rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
            {["Full Course Access", "Interactive Exercises", "Progress Tracking", "Completion Certificate"].map(
              (feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Update ProgressCard component
const ProgressCard = ({ progress, isCompleted }) => {
  const [showQuiz, setShowQuiz] = useState(false)

  if (!progress) return null

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">Course Progress</h3>
        <span className={`font-medium ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
          {isCompleted ? "Completed" : `${progress.percentage}%`}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${isCompleted ? "bg-green-600" : "bg-blue-600"}`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="text-sm text-gray-600">
        {isCompleted ? (
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Course completed
          </span>
        ) : (
          `${progress.completedSections} of ${progress.totalSections} sections completed`
        )}
      </div>

      {progress.completed && !isCompleted && (
        <button
          onClick={() => setShowQuiz(true)}
          className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Take Final Quiz
        </button>
      )}
    </div>
  )
}

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const [course, setCourse] = useState(null)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTocVisible, setTocVisible] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [courseProgress, setCourseProgress] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [earnedBadge, setEarnedBadge] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const certificateRef = useRef()
  const [progress, setProgress] = useState({
    completedSections: 0,
    totalSections: 0,
    percentage: 0,
  })
  const [generatingCertificate, setGeneratingCertificate] = useState(false)
  const [hasCompletedCourse, setHasCompletedCourse] = useState(false)
  const [hasCertificate, setHasCertificate] = useState(false)

  const checkCompletion = async () => {
    if (!user || !courseId) return

    try {
      // Check if certificate exists
      const certificateDoc = await getDoc(doc(db, "certificates", `${user.uid}_${courseId}`))

      if (certificateDoc.exists()) {
        setHasCertificate(true)
        return
      }

      // Check course progress
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const progress = userDoc.data().courseProgress?.[courseId]
        if (progress?.completed) {
          setHasCompletedCourse(true)
        }
      }
    } catch (error) {
      console.error("Error checking completion:", error)
    }
  }

  useEffect(() => {
    checkCompletion()
  }, [user, courseId])

  const generateCertificate = async () => {
    if (!user || !course) return

    setGeneratingCertificate(true)

    try {
      // Create a completely isolated container
      const tempDiv = document.createElement("div")
      tempDiv.style.position = "absolute"
      tempDiv.style.left = "-9999px"
      tempDiv.style.top = "-9999px"
      tempDiv.style.width = "1000px"
      tempDiv.style.height = "700px"
      tempDiv.style.backgroundColor = "#ffffff"
      tempDiv.style.overflow = "hidden"
      tempDiv.style.zIndex = "-1000"

      // Append to body but make sure it's not affected by global styles
      document.body.appendChild(tempDiv)

      // Create a new root for React
      const root = ReactDOM.createRoot(tempDiv)

      // Render the certificate
      root.render(<Certificate ref={certificateRef} user={user} course={course} completionDate={new Date()} />)

      // Wait longer to ensure complete rendering
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Use html2canvas with explicit settings to avoid color parsing issues
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: false,
        ignoreElements: (element) => {
          // Ignore any elements with Tailwind classes that might cause issues
          return (
            element.classList &&
            Array.from(element.classList).some(
              (cls) =>
                cls.includes("bg-gradient") || cls.includes("from-") || cls.includes("to-") || cls.includes("via-"),
            )
          )
        },
      })

      // Create PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("l", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${course.title}-Certificate.pdf`)

      // Clean up
      document.body.removeChild(tempDiv)

      // Save certificate info to Firebase
      await setDoc(doc(db, "certificates", `${user.uid}_${courseId}`), {
        userId: user.uid,
        courseId,
        courseTitle: course.title,
        issuedDate: new Date(),
        certificateId: `${courseId}-${user.uid.slice(0, 8)}`,
        score: earnedBadge?.score || 100,
        badgeType: earnedBadge?.badgeType || "gold",
      })

      setHasCertificate(true)
      toast.success("Certificate generated successfully! 🎉")
    } catch (error) {
      console.error("Certificate generation error:", error)
      toast.error("Failed to generate certificate. Please try again.")
    } finally {
      setGeneratingCertificate(false)
    }
  }

  const checkProgressAndCertification = async () => {
    if (!user || !courseId) return

    try {
      // Check certificate
      const certificateDoc = await getDoc(doc(db, "certificates", `${user.uid}_${courseId}`))
      if (certificateDoc.exists()) {
        setHasCertificate(true)
        setEarnedBadge({
          courseId,
          courseName: course?.title,
          score: certificateDoc.data().score,
          badgeType: certificateDoc.data().badgeType,
          earnedAt: certificateDoc.data().issuedDate,
        })
      }

      // Check progress
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const progress = userDoc.data().courseProgress?.[courseId]
        if (progress) {
          setCourseProgress(progress)
          setHasCompletedCourse(progress.completed)

          // Show quiz if course is completed but no certificate yet
          if (progress.completed && !certificateDoc.exists()) {
            setShowQuiz(true)
          }
        }
      }
    } catch (error) {
      console.error("Error checking progress:", error)
    }
  }

  const handleCodeSave = async (newCode) => {
    try {
      await updateDoc(doc(db, "courses", courseId), {
        code: newCode,
      })
      toast.success("Code saved successfully")
    } catch (error) {
      console.error("Error saving code:", error)
      toast.error("Failed to save code")
    }
  }

  const checkEnrollment = async (userId, courseId) => {
    const enrollmentRef = doc(db, "enrollments", `${userId}_${courseId}`)
    const enrollmentDoc = await getDoc(enrollmentRef)
    return enrollmentDoc.exists()
  }

  const handleEnroll = async () => {
    if (!user) return

    try {
      const enrollmentRef = doc(db, "enrollments", `${user.uid}_${courseId}`)
      await setDoc(enrollmentRef, {
        userId: user.uid,
        courseId,
        enrolledAt: new Date(),
      })
      setIsEnrolled(true)
    } catch (error) {
      console.error("Error enrolling:", error)
      throw error
    }
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const docRef = doc(db, "courses", courseId)
        const courseDoc = await getDoc(docRef)
        if (courseDoc.exists()) {
          const courseData = courseDoc.data()
          setCourse(courseData)
          setSections(Array.isArray(courseData.sections) ? courseData.sections : [])
        } else {
          setError("Course not found.")
        }
      } catch (error) {
        console.error("Error fetching course:", error)
        setError("Error fetching course data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetail()
  }, [courseId])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsEnrolled(false)
        return
      }

      try {
        const enrolled = await checkEnrollment(user.uid, courseId)
        setIsEnrolled(enrolled)

        if (enrolled) {
          await checkProgressAndCertification()
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [user, courseId, course])

  // Update user's progress as they view sections
  const updateUserProgress = async (sectionIndex) => {
    if (!user) return

    try {
      const userRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const progress = userData.courseProgress || {}
        const currentProgress = progress[courseId] || { lastSectionViewed: 0, completed: false }

        // Only update if viewing a later section
        if (sectionIndex > currentProgress.lastSectionViewed) {
          const updatedProgress = {
            ...progress,
            [courseId]: {
              ...currentProgress,
              lastSectionViewed: sectionIndex,
              completed: sectionIndex >= sections.length - 1,
            },
          }

          await updateDoc(userRef, {
            courseProgress: updatedProgress,
          })

          setCourseProgress({
            ...currentProgress,
            lastSectionViewed: sectionIndex,
            completed: sectionIndex >= sections.length - 1,
          })

          // Show quiz when user reaches the end
          if (sectionIndex >= sections.length - 1) {
            setShowQuiz(true)
          }
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  // Update progress tracking
  const updateProgress = async (sectionIndex) => {
    if (!user || !isEnrolled || hasCompletedCourse) return

    try {
      const totalSections = sections.length
      const newProgress = {
        lastSectionViewed: sectionIndex,
        completedSections: sectionIndex + 1,
        totalSections,
        percentage: Math.round(((sectionIndex + 1) / totalSections) * 100),
        completed: sectionIndex >= totalSections - 1,
      }

      await updateDoc(doc(db, "users", user.uid), {
        [`courseProgress.${courseId}`]: newProgress,
      })

      setCourseProgress(newProgress)

      if (newProgress.completed && !hasCompletedCourse) {
        setHasCompletedCourse(true)
        setShowQuiz(true)
      }
    } catch (error) {
      console.error("Error updating progress:", error)
      toast.error("Failed to update progress")
    }
  }

  // Modify getVisibleSections logic
  const getVisibleSections = () => {
    if (!sections.length) return []

    if (!user) {
      // Unregistered users see 10%
      const visibleCount = Math.max(1, Math.ceil(sections.length * 0.1))
      return sections.slice(0, visibleCount)
    }

    if (!isEnrolled) {
      // Registered but not enrolled users see 10%
      const visibleCount = Math.max(1, Math.ceil(sections.length * 0.1))
      return sections.slice(0, visibleCount)
    }

    return sections // Enrolled users see all content
  }

  // Handle quiz completion
  const handleQuizComplete = async (score, badgeType) => {
    try {
      setGeneratingCertificate(true)
      setEarnedBadge({
        courseId,
        courseName: course.title,
        score,
        badgeType,
        earnedAt: new Date(),
      })

      if (score >= 70) {
        // Create temporary container
        const tempDiv = document.createElement("div")
        tempDiv.style.position = "absolute"
        tempDiv.style.left = "-9999px"
        tempDiv.style.backgroundColor = "#ffffff"
        document.body.appendChild(tempDiv)

        // Render certificate in temp container
        const root = ReactDOM.createRoot(tempDiv)
        root.render(<Certificate ref={certificateRef} user={user} course={course} completionDate={new Date()} />)

        // Wait for render
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate PDF
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        })

        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("l", "mm", "a4")
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save(`${course.title}-Certificate.pdf`)

        // Store in Firebase
        await setDoc(doc(db, "certificates", `${user.uid}_${courseId}`), {
          userId: user.uid,
          courseId,
          courseTitle: course.title,
          issuedDate: new Date(),
          certificateId: `${courseId}-${user.uid.slice(0, 8)}`,
          score,
        })

        // Cleanup
        document.body.removeChild(tempDiv)
        toast.success("Certificate generated successfully! 🎉")
      }
    } catch (error) {
      console.error("Certificate generation failed:", error)
      toast.error("Failed to generate certificate. Please try again.")
    } finally {
      setGeneratingCertificate(false)
    }
  }

  useEffect(() => {
    // Observer for section scrolling
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            if (sectionId.startsWith("section-")) {
              const sectionIndex = Number.parseInt(sectionId.split("-")[1])
              setActiveSection(sectionIndex)
              updateUserProgress(sectionIndex)
              updateProgress(sectionIndex)
            }
          }
        })
      },
      { threshold: 0.5 },
    )

    // Observe all section elements
    document.querySelectorAll('[id^="section-"]').forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [sections, user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#003656" height={80} width={80} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg border border-red-100 max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 9 0 11-18 0 9 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Course</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const visibleSections = getVisibleSections()

  return (
    <div className="bg-gray-50">
      <MainHero title={course.title} description={course.description} image={course.icon} />

      <div className="container mx-auto px-4 py-8">
        {earnedBadge && (
          <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 flex items-center">
            <div className="w-16 h-16 mr-6">
              <img
                src={
                  badgeImages[earnedBadge.badgeType] || `https://via.placeholder.com/100?text=${earnedBadge.badgeType}`
                }
                alt={`${earnedBadge.badgeType} Badge`}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800">Achievement Unlocked!</h3>
              <p className="text-amber-700">
                You've earned a {earnedBadge.badgeType.charAt(0).toUpperCase() + earnedBadge.badgeType.slice(1)} badge
                for this course with a score of {Math.round(earnedBadge.score)}%.
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">Course Content</h2>

                {visibleSections.length > 0 ? (
                  <div className="space-y-8">
                    {visibleSections.map((section, index) => (
                      <div key={index} id={`section-${index}`} className="scroll-mt-20 transition-all">
                        {section.type === "subHeading" && (
                          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                            <ChevronRight className="inline-block mr-2 h-5 w-5 text-blue-600" />
                            {section.value}
                          </h3>
                        )}

                        {section.type === "content" && (
                          <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: section.value }}
                          />
                        )}

                        {section.type === "code" && (
                          <div className="my-6">
                            <pre className="bg-gray-900 text-gray-50 p-4 rounded-md overflow-x-auto">
                              <code className="text-sm font-mono">{section.value}</code>
                            </pre>
                          </div>
                        )}

                        {section.type === "unorderedList" && (
                          <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700">
                            {Array.isArray(section.value)
                              ? section.value.map((item, itemIndex) => (
                                  <li key={itemIndex} className="pl-2">
                                    {item}
                                  </li>
                                ))
                              : null}
                          </ul>
                        )}

                        {section.type === "orderedList" && (
                          <ol className="list-decimal list-outside pl-5 space-y-2 text-gray-700">
                            {Array.isArray(section.value)
                              ? section.value.map((item, itemIndex) => (
                                  <li key={itemIndex} className="pl-2">
                                    {item}
                                  </li>
                                ))
                              : null}
                          </ol>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m-6-6h6m-6 0H6"
                      />
                    </svg>
                    <p>No content available for this course.</p>
                  </div>
                )}

                {(!user || !isEnrolled) && sections.length > visibleSections.length && (
                  <EnrollmentCTA isLoggedIn={!!user} onEnroll={handleEnroll} />
                )}
              </div>
            </div>

            {/* Interactive Code Editor - only for registered users */}
            {user && course.code && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b">Interactive Code Lab</h2>
                <p className="text-gray-600 mb-4">
                  Try out the concepts you've learned in this interactive coding environment. You can edit and save your
                  code as you practice.
                </p>
                <CodeEditor
                  initialCode={course.code}
                  language={course.codeLanguage || "javascript"}
                  onSave={handleCodeSave}
                />
              </div>
            )}

            {/* Quiz component - shows when user has completed the course */}
            {user && showQuiz && !earnedBadge && (
              <QuizComponent courseId={courseId} courseName={course.title} onComplete={handleQuizComplete} />
            )}

            {user && (hasCompletedCourse || hasCertificate) && (
              <div className="mt-4 bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Course Completed</h3>
                {!hasCertificate ? (
                  <button
                    onClick={generateCertificate}
                    disabled={generatingCertificate}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {generatingCertificate ? "Generating..." : "Download Certificate"}
                  </button>
                ) : (
                  <button
                    onClick={generateCertificate}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Download Certificate Again
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar with Table of Contents */}
          <div className="lg:w-1/4 order-1 lg:order-2">
            <div className="sticky top-1">
              <ProgressCard progress={courseProgress} isCompleted={hasCompletedCourse} />

              {earnedBadge && (
                <div className="mt-4 bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Achievements</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={badgeImages[earnedBadge.badgeType] || "/placeholder.svg"}
                      alt={`${earnedBadge.badgeType} Badge`}
                      className="w-16 h-16"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {earnedBadge.badgeType.toUpperCase()} Badge Earned!
                      </div>
                      <div className="text-sm text-gray-600">Score: {earnedBadge.score}%</div>
                      <button
                        onClick={generateCertificate}
                        disabled={generatingCertificate}
                        className={`mt-4 w-full py-2 rounded-lg ${
                          generatingCertificate ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        } text-white transition-colors`}
                      >
                        {generatingCertificate ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                          </div>
                        ) : (
                          "Download Certificate"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm p-6 hidden lg:block">
                <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
                {course && sections.length > 0 && (
                  <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-2">
                    {sections
                      .filter((section) => section.type === "subHeading")
                      .map((section, index) => {
                        // Find the actual index in the full sections array
                        const sectionIndex = sections.findIndex((s, i) => s === section)

                        // Check if this section is accessible to the user
                        const isAccessible = user || sectionIndex < visibleSections.length

                        return (
                          <a
                            href={isAccessible ? `#section-${sectionIndex}` : "#"}
                            key={index}
                            className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors ${
                              !isAccessible
                                ? "text-gray-400 cursor-not-allowed"
                                : activeSection === sectionIndex
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {!isAccessible && <Lock className="w-3 h-3 mr-2 text-gray-400" />}
                            {section.value}
                          </a>
                        )
                      })}
                  </div>
                )}

                {/* Course progress for registered users */}
                {user && courseProgress && sections.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-bold text-gray-900 mb-2">Your Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (courseProgress.lastSectionViewed / (sections.length - 1)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {courseProgress.completed
                        ? "Course completed"
                        : `${Math.round((courseProgress.lastSectionViewed / (sections.length - 1)) * 100)}% complete`}
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
                        src={
                          badgeImages[earnedBadge.badgeType] ||
                          `https://via.placeholder.com/100?text=${earnedBadge.badgeType || "/placeholder.svg"}`
                        }
                        alt={`${earnedBadge.badgeType} Badge`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-center text-gray-600">
                      {earnedBadge.badgeType.charAt(0).toUpperCase() + earnedBadge.badgeType.slice(1)} Badge
                    </p>
                    <p className="text-center font-bold text-blue-600">{Math.round(earnedBadge.score)}% Score</p>
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
        aria-label={isTocVisible ? "Close table of contents" : "Open table of contents"}
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
              .filter((section) => section.type === "subHeading")
              .map((section, index) => {
                // Find the actual index in the full sections array
                const sectionIndex = sections.findIndex((s, i) => s === section)

                // Check if this section is accessible to the user
                const isAccessible = user || sectionIndex < visibleSections.length

                return (
                  <a
                    href={isAccessible ? `#section-${sectionIndex}` : "#"}
                    key={index}
                    className={`flex items-center py-3 px-4 border-b border-gray-100 ${
                      !isAccessible ? "text-gray-400 cursor-not-allowed" : "text-gray-800"
                    }`}
                    onClick={() => isAccessible && setTocVisible(false)}
                  >
                    {!isAccessible && <Lock className="w-4 h-4 mr-2 text-gray-400" />}
                    {section.value}
                  </a>
                )
              })}

            {!user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 mb-3">Register to unlock the complete course and earn a certificate</p>
                <button
                  onClick={() => {
                    navigate("/signup")
                    setTocVisible(false)
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

      {/* Certificate preview (hidden until earned) */}
      <div style={{ display: "none" }}>
        <Certificate ref={certificateRef} user={user} course={course} completionDate={new Date()} />
      </div>
    </div>
  )
}

export default CourseDetail
