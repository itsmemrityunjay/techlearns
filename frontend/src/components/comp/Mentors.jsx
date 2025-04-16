"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Briefcase,
  BookOpen,
  Code,
  User,
  Calendar,
  MapPin,
  Mail,
  Globe,
  Linkedin,
  Github,
  Twitter,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import Image from "../../assets/aryan.jpg"

// Sample data - replace with your actual data source
const mentorsData = [
  {
    id: 1,
    name: "John Doe",
    role: "Senior Developer",
    image: "/placeholder.svg?height=400&width=400",
    expertise: ["React", "Node.js", "Python"],
    bio: "10+ years of experience in web development",
    about:
      "Passionate about teaching and mentoring junior developers. I specialize in building scalable web applications and helping others grow in their development journey. My approach focuses on practical, hands-on learning with real-world examples.",
    topics: ["Web Development", "System Design", "Data Structures", "Career Growth"],
    skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "AWS", "Docker"],
    location: "San Francisco, CA",
    availability: "Evenings & Weekends",
    languages: ["English", "Spanish"],
    rating: 4.9,
    reviewCount: 127,
    email: "john.doe@example.com",
    website: "johndoe.dev",
    social: {
      linkedin: "johndoe",
      github: "johndoe",
      twitter: "johndoe",
    },
    experience: [
      {
        company: "Tech Corp",
        role: "Senior Developer",
        duration: "2019 - Present",
        description:
          "Leading development team and mentoring juniors. Implemented microservices architecture that improved system reliability by 35%.",
      },
      {
        company: "StartUp Inc",
        role: "Full Stack Developer",
        duration: "2016 - 2019",
        description:
          "Developed full stack applications using React, Node.js, and MongoDB. Reduced page load time by 40% through optimization techniques.",
      },
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "M.S. Computer Science",
        year: "2014 - 2016",
      },
      {
        institution: "Tech Institute",
        degree: "B.S. Software Engineering",
        year: "2010 - 2014",
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "UX/UI Designer",
    image: "/placeholder.svg?height=400&width=400",
    expertise: ["UI Design", "User Research", "Figma"],
    bio: "Helping companies create beautiful, user-friendly interfaces",
    about:
      "I'm passionate about creating intuitive and accessible user experiences. With 8 years in the field, I've helped startups and enterprise companies alike transform their digital products through user-centered design.",
    topics: ["UI/UX Design", "Design Systems", "User Research", "Accessibility"],
    skills: ["Figma", "Adobe XD", "Sketch", "HTML/CSS", "Prototyping", "User Testing"],
    location: "New York, NY",
    availability: "Weekdays",
    languages: ["English", "French"],
    rating: 4.8,
    reviewCount: 93,
    email: "sarah.j@example.com",
    website: "sarahjdesigns.com",
    social: {
      linkedin: "sarahjohnson",
      github: "sarahj",
      twitter: "sarahjdesigns",
    },
    experience: [
      {
        company: "Design Studio",
        role: "Senior UX Designer",
        duration: "2018 - Present",
        description:
          "Lead designer for enterprise clients. Created design systems that improved team efficiency by 50%.",
      },
      {
        company: "Creative Agency",
        role: "UI Designer",
        duration: "2015 - 2018",
        description:
          "Designed interfaces for mobile and web applications. Increased user engagement by 30% through redesign initiatives.",
      },
    ],
    education: [
      {
        institution: "Design Academy",
        degree: "M.A. Interaction Design",
        year: "2013 - 2015",
      },
      {
        institution: "Art University",
        degree: "B.F.A. Graphic Design",
        year: "2009 - 2013",
      },
    ],
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Data Scientist",
    image: "/placeholder.svg?height=400&width=400",
    expertise: ["Machine Learning", "Python", "Data Analysis"],
    bio: "Turning data into actionable insights and business value",
    about:
      "I specialize in applying machine learning and statistical methods to solve complex business problems. My background in both computer science and statistics allows me to bridge the gap between technical implementation and business strategy.",
    topics: ["Machine Learning", "Data Visualization", "Statistical Analysis", "AI Ethics"],
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "R", "Tableau", "Big Data"],
    location: "Seattle, WA",
    availability: "Flexible",
    languages: ["English", "Mandarin"],
    rating: 4.7,
    reviewCount: 85,
    email: "michael.c@example.com",
    website: "michaelchen.io",
    social: {
      linkedin: "michaelchen",
      github: "mchen",
      twitter: "michaelchendata",
    },
    experience: [
      {
        company: "Tech Giant",
        role: "Senior Data Scientist",
        duration: "2017 - Present",
        description:
          "Developed ML models that improved recommendation accuracy by 25%. Lead a team of 5 data scientists on various projects.",
      },
      {
        company: "Analytics Firm",
        role: "Data Analyst",
        duration: "2014 - 2017",
        description:
          "Performed data analysis and created dashboards for Fortune 500 clients. Automated reporting processes saving 20 hours per week.",
      },
    ],
    education: [
      {
        institution: "Tech University",
        degree: "Ph.D. Computer Science",
        year: "2011 - 2014",
      },
      {
        institution: "State University",
        degree: "B.S. Statistics",
        year: "2007 - 2011",
      },
    ],
  },
]

/**
 * @typedef {Object} MentorExperience
 * @property {string} company - Company name
 * @property {string} role - Job role
 * @property {string} duration - Employment duration
 * @property {string} description - Job description
 */

/**
 * @typedef {Object} MentorEducation
 * @property {string} institution - Educational institution
 * @property {string} degree - Degree earned
 * @property {string} year - Years attended
 */

/**
 * @typedef {Object} MentorSocial
 * @property {string} linkedin - LinkedIn username
 * @property {string} github - GitHub username
 * @property {string} twitter - Twitter username
 */

/**
 * @typedef {Object} Mentor
 * @property {number} id - Unique identifier
 * @property {string} name - Full name
 * @property {string} role - Professional role
 * @property {string} image - Image URL
 * @property {string[]} expertise - Areas of expertise
 * @property {string} bio - Short biography
 * @property {string} about - Detailed about text
 * @property {string[]} topics - Mentorship topics
 * @property {string[]} skills - Professional skills
 * @property {string} location - Geographic location
 * @property {string} availability - Availability schedule
 * @property {string[]} languages - Languages spoken
 * @property {number} rating - Rating score
 * @property {number} reviewCount - Number of reviews
 * @property {string} email - Email address
 * @property {string} website - Website URL
 * @property {MentorSocial} social - Social media profiles
 * @property {MentorExperience[]} experience - Work experience
 * @property {MentorEducation[]} education - Educational background
 */

const Mentors = () => {
  // Custom hook for detecting mobile view
  const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768) // Adjust breakpoint as needed
      }

      // Set initial value
      handleResize()

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    return isMobile
  }

  const [selectedMentor, setSelectedMentor] = useState(null)
  const [mentors, setMentors] = useState(mentorsData)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("about")
  const [toastMessage, setToastMessage] = useState(null)
  const isMobile = useMobile()
  const modalRef = useRef(null)

  // Filter mentors based on expertise and search query
  useEffect(() => {
    let filtered = mentorsData

    if (filter !== "all") {
      filtered = filtered.filter((mentor) => mentor.expertise.some((exp) => exp.toLowerCase() === filter.toLowerCase()))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(query) ||
          mentor.role.toLowerCase().includes(query) ||
          mentor.expertise.some((exp) => exp.toLowerCase().includes(query)) ||
          mentor.topics.some((topic) => topic.toLowerCase().includes(query)),
      )
    }

    setMentors(filtered)
  }, [filter, searchQuery])

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedMentor(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Custom toast function
  const showToast = (title, description) => {
    setToastMessage({ title, description })
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Handle booking a session
  const handleBookSession = (mentor) => {
    showToast("Session Requested", `Your request to book a session with ${mentor.name} has been sent.`);
  };
  

  // Handle contact mentor
  const handleContactMentor = (mentor) => {
    showToast("Message Sent", `Your message to ${mentor.name} has been sent.`)
  }

  const MentorCard = ({ mentor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div className="h-full flex flex-col overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 rounded-lg shadow-sm">
        <div className="relative w-full pt-[10%] overflow-hidden bg-gray-100">
          {/* <Image
            src={mentor.image || "/placeholder.svg?height=400&width=400"}
            alt={mentor.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
          /> */}
          <img src={Image} alt="Loading..." fill className="object-cover transition-transform duration-500 hover:scale-105"/>
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{mentor.rating}</span>
          </div>
        </div>

        <div className="flex-grow flex flex-col p-5">
          <div className="space-y-1 mb-3">
            <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
            <p className="text-sm font-medium"  style={{ color: 'var(--primary-color)' }}>{mentor.role}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{mentor.location}</span>
          </div>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{mentor.bio}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.expertise.slice(0, 3).map((exp, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                {exp}
              </span>
            ))}
            {mentor.expertise.length > 3 && (
              <span className="px-2 py-1 border border-gray-200 text-gray-600 text-xs rounded-full">
                +{mentor.expertise.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={() => setSelectedMentor(mentor)}
            className="w-full py-2 px-4  hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            style={{ backgroundColor: 'var(--secondary-color)' }}
          >
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  )

  const MentorModal = ({ mentor, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{mentor.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-4 border-white shadow-xl">
                {/* <Image
                  src={mentor.image || "/placeholder.svg?height=400&width=400"}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                /> */}
              </div>

              <div className="text-center md:text-left space-y-2 flex-grow">
                <div>
                  <h3 className="text-2xl font-bold">{mentor.name}</h3>
                  <p className=" font-medium" style={{ color: 'var(--secondary-color)' }}>{mentor.role}</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-1.5 my-2">
                  {mentor.expertise.map((exp, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-white text-xs rounded-full" style={{ backgroundColor: 'var(--secondary-color)' }}>
                      {exp}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-1 text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{mentor.rating}</span>
                  </div>
                  <span className="text-gray-500">({mentor.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleBookSession(mentor)}
                  className="py-2 px-4  hover:bg-blue-700 text-white font-medium rounded-md transition-colors"  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  Book a Session
                </button>
                <button
                  onClick={() => handleContactMentor(mentor)}
                  className="py-2 px-4 border border-gray-300 hover:bg-gray-50 font-medium rounded-md transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{mentor.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{mentor.availability}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{mentor.languages.join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="p-6">
            <div className="grid grid-cols-4 mb-6 border-b">
              {["about", "experience", "topics", "contact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 text-center font-medium transition-colors ${
                    activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About
                  </h4>
                  <p className="text-gray-600">{mentor.about}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 border border-gray-200 text-gray-700 text-sm rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Education</h4>
                  <div className="space-y-4">
                    {mentor.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-blue-400 pl-4">
                        <h5 className="font-semibold">{edu.degree}</h5>
                        <p className="text-blue-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </h4>
                  <div className="space-y-6">
                    {mentor.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-400 pl-4">
                        <h5 className="font-semibold">{exp.role}</h5>
                        <p className="text-blue-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                        <p className="text-gray-600 mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "topics" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Mentorship Topics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentor.topics.map((topic, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium">{topic}</h5>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <a href={`mailto:${mentor.email}`} className="text-blue-600 hover:underline">
                        {mentor.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-gray-500" />
                      <a
                        href={`https://${mentor.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {mentor.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Social Media</h4>
                  <div className="flex gap-3">
                    <a
                      href={`1https://linkedin.com/in/${mentor.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://github.com/${mentor.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/${mentor.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  // Carousel navigation for mobile
  const carouselRef = useRef(null)

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Meet Our Expert Mentors
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto"
        >
          Connect with industry professionals who are passionate about helping you grow
        </motion.p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter by expertise */}
        <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 md:pb-0" ref={carouselRef}>
          {isMobile && (
            <button
              className="flex-shrink-0 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <button
            className={`flex-shrink-0 px-4 py-2 rounded-md ${
              filter === "all" ? "bg--primary-color text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            style={{backgroundColor:`var(--primary-color)`}}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`flex-shrink-0 px-4 py-2 rounded-md ${
              filter === "React" ? "bg-[var(--secondary-color)] text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
           
            onClick={() => setFilter("React")}
          >
            React
          </button>
          <button
            className={`flex-shrink-0 px-4 py-2 rounded-md ${
              filter === "Python" ? "bg-[var(--secondary-color)] text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setFilter("Python")}
          >
            Python
          </button>
          <button
            className={`flex-shrink-0 px-4 py-2 rounded-md ${
              filter === "UI Design"
                ? "bg-[var(--secondary-color)] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setFilter("UI Design")}
          >
            UI Design
          </button>
          <button
            className={`flex-shrink-0 px-4 py-2 rounded-md ${
              filter === "Machine Learning"
                ? "bg-[var(--secondary-color)] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setFilter("Machine Learning")}
          >
            Machine Learning
          </button>

          {isMobile && (
            <button
              className="flex-shrink-0 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mentors Grid */}
      {mentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No mentors found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 bg-blue-50 rounded-2xl p-8 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to become a mentor?</h2>
        <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
          Share your expertise and help others grow while expanding your professional network
        </p>
        <button className="px-8 py-3  hover:bg-blue-700 text-white font-medium rounded-md transition-colors text-lg"  style={{ backgroundColor: 'var(--secondary-color)' }}>
          Apply to be a Mentor
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMentor && <MentorModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white border border-gray-200 shadow-lg rounded-lg p-4 max-w-md z-50"
          >
            <div className="flex flex-col">
              <h4 className="font-semibold text-gray-900">{toastMessage.title}</h4>
              <p className="text-gray-600">{toastMessage.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Mentors