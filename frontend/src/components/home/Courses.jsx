"use client"

import { useState, useEffect, useRef } from "react"
import { db } from "../../database/Firebase"
import { collection, getDocs } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import {
  Clock,
  Star,
  Bookmark,
  GraduationCap,
  Zap,
  CheckCircle,
  Users,
  Award,
  PlayCircle,
  BarChart2,
  BadgeCheck,
  Heart,
  Eye,
  ArrowRight,
  Search,
  Filter,
  X,
  ChevronDown,
  Sliders,
  TrendingUp,
  Clock3,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const CourseCard = ({ course }) => {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 10)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  useEffect(() => {
    if (course.enrolled) {
      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 5, course.completion || 35))
      }, 300)
      return () => clearInterval(timer)
    }
  }, [course.enrolled, course.completion])

  const handleBookmark = (e) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const handleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    setShowPreview(true)
  }

  return (
    <motion.div
      ref={cardRef}
      onClick={() => navigate(`/courses/${course.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowPreview(false)
      }}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative justify-between my-auto h-[475px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100 cursor-pointer group"
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Premium Ribbon */}
      {/* {course.premium && (
        <div className="absolute -right-8 top-5 w-32 bg-gradient-to-r from-blue-700 to-blue-600 text-white text-xs font-bold py-1.5 px-4 text-center transform rotate-45 shadow-md z-10 flex items-center justify-center">
          <Zap className="h-3 w-3 mr-1 fill-current" />
          <span>PREMIUM</span>
        </div>
      )} */}

      {/* Course Image with Interactive Overlay */}
      <div className="relative h-48 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10"></div>

        <img
          src={
            course.icon
          }
          alt={course.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
          loading="lazy"
        />

        {/* Image hover actions */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 ${showPreview ? "hidden" : ""}`}
        >
          {/* <button
            onClick={handleQuickView}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 hover:bg-white transition-all hover:scale-105"
          >
            <Eye className="h-4 w-4" />
            Quick Preview
          </button> */}
        </div>

        {/* Price Tag */}
        {/* <div className="absolute bottom-4 left-4 z-10">
          <div
            className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center shadow-sm ${
              course.discount > 0
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : course.price === "0.00"
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white"
                  : "bg-white text-gray-900"
            }`}
          >
            {course.discount > 0 && (
              <span className="text-xs text-white/80 line-through mr-2">${course.originalPrice}</span>
            )}
            <span>{course.price === "0.00" ? "FREE" : `$${course.price}`}</span>
            {course.discount > 0 && (
              <span className="ml-2 bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-md">-{course.discount}%</span>
            )}
          </div>
        </div> */}

        {/* Action Buttons */}
        {/* <div className="absolute top-4 right-4 flex gap-2 z-20">
          
          <motion.button
            onClick={handleBookmark}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isBookmarked
                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                : "bg-white/90 text-gray-500 hover:bg-white hover:text-blue-500"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </motion.button>

          
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
              isLiked
                ? "bg-red-100 text-red-500 hover:bg-red-200"
                : "bg-white/90 text-gray-500 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>
        </div> */}
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Category and Likes */}
        {/* <div className="flex justify-between items-center mb-3">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium tracking-wide text-blue-700 bg-blue-50 rounded-full uppercase">
            {course.category || "Development"}
          </span>
          <span className="inline-flex items-center text-xs text-gray-500">
            <Heart className={`h-3.5 w-3.5 mr-1 ${isLiked ? "text-red-500 fill-red-500" : ""}`} />
            {likeCount}
          </span>
        </div> */}

        {/* Course Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

        {/* Progress Bar (for enrolled courses) */}
        {course.enrolled && (
          <div className="mb-4">
            {/* <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Your progress</span>
              <span>{Math.round(progress)}% complete</span>
            </div> */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
        )}

        {/* Rating and Students */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex mr-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.floor(course.rating || 4.8) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-700 ml-1">{course.rating}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>{course.enrolledStudents || course.students}</span>
          </div>
        </div>

        {/* Course Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="inline-flex items-center text-xs px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full border border-gray-200"
            title={`${course.lessonCount || 12} lessons`}
          >
            <Clock className="h-3 w-3 mr-1.5" />
            {course.duration || "8h 15m"}
          </span>
          <span
            className="text-xs px-2.5 py-1 bg-gray-50 text-gray-700 rounded-full border border-gray-200"
            title={`${course.level} level content`}
          >
            {course.level}
          </span>
          {/* {course.certificate && (
            <span
              className="inline-flex items-center text-xs px-2.5 py-1 bg-blue-50 text-[#ffaa00] rounded-full border border-blue-200"
              title="Verified certificate upon completion"
            >
              <BadgeCheck className="h-3 w-3 mr-1.5" />
              Certificate
            </span>
          )} */}
        </div>

        {/* Instructor and CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white shadow-sm">
              <img
                src={course.instructorAvatar || `https://i.pravatar.cc/150?u=${course.instructorId || "instructor"}`}
                alt="Instructor"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {course.verified && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#ffaa00] rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="h-2 w-2 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 truncate max-w-[100px]">{course.instructor}</p>
          </div>
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/courses/${course.id}`)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${
              course.enrolled ? "bg-green-50 text-green-600 hover:bg-green-100" : "text-[#ffaa00] hover:bg-blue-50"
            }`}
          >
            {course.enrolled ? "Continue" : "View"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Quick Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="absolute inset-0 bg-black/90 z-30 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-5 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-lg">Course Preview</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowPreview(false)
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    course.image ||
                    `https://source.unsplash.com/random/600x400/?${course.category || "tech"},${Math.random()}`
                  }
                  alt="Course preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <PlayCircle className="h-12 w-12 text-white" />
                  </motion.div>
                </div>
              </div>
              <h5 className="font-medium text-gray-900 mb-2">"{course.title}" Preview</h5>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <motion.button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  View Full Course
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("popular")
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedLevels, setSelectedLevels] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [visibleCourses, setVisibleCourses] = useState(8)
  const navigate = useNavigate()

  const categories = ["Development", "Design", "Business", "Marketing", "Photography", "Music"]
  const levels = ["Beginner", "Intermediate", "Advanced"]

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"))
        let fetchedCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          premium: Math.random() > 0.8,
          verified: Math.random() > 0.3,
          enrolled: Math.random() > 0.7,
          completion: Math.floor(Math.random() * 100),
          discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : 0,
          originalPrice: (Math.floor(Math.random() * 100) + 60).toFixed(2),
          price: (Math.floor(Math.random() * 60) + 30).toFixed(2),
          rating: (4 + Math.random()).toFixed(1),
          students: Math.floor(Math.random() * 5000) + 500,
          enrolledStudents: Math.floor(Math.random() * 2000) + 100,
          lessonCount: Math.floor(Math.random() * 30) + 10,
          duration: `${Math.floor(Math.random() * 10) + 1}h ${Math.floor(Math.random() * 60)}m`,
          level: levels[Math.floor(Math.random() * 3)],
          certificate: Math.random() > 0.5,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)),
        }))

        // Apply search filter
        if (searchQuery) {
          fetchedCourses = fetchedCourses.filter(
            (course) =>
              course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        // Apply sorting
        fetchedCourses = fetchedCourses.sort((a, b) => {
          if (sortBy === "popular") return b.students - a.students
          if (sortBy === "rating") return b.rating - a.rating
          if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
          if (sortBy === "price-low") return Number.parseFloat(a.price) - Number.parseFloat(b.price)
          if (sortBy === "price-high") return Number.parseFloat(b.price) - Number.parseFloat(a.price)
          return 0
        })

        // Apply basic filtering
        // if (filter !== "all") {
        //   fetchedCourses = fetchedCourses.filter((course) =>
        //     filter === "premium"
        //       ? course.premium
        //       : filter === "free"
        //         ? course.price === "0.00"
        //         : filter === "certificate"
        //           ? course.certificate
        //           : course.category?.toLowerCase() === filter.toLowerCase(),
        //   )
        // }

        // Apply advanced filtering
        if (selectedLevels.length > 0) {
          fetchedCourses = fetchedCourses.filter((course) => selectedLevels.includes(course.level))
        }

        if (selectedCategories.length > 0) {
          fetchedCourses = fetchedCourses.filter((course) => selectedCategories.includes(course.category))
        }

        // Apply price range filter
        fetchedCourses = fetchedCourses.filter((course) => {
          const price = Number.parseFloat(course.price)
          return price >= priceRange[0] && price <= priceRange[1]
        })

        setCourses(fetchedCourses)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching courses: ", error)
        setLoading(false)
      }
    }
    fetchCourses()
  }, [sortBy, filter, searchQuery, selectedLevels, selectedCategories, priceRange])

  const handleSearch = (e) => {
    e.preventDefault()
    // The search is already handled by the useEffect dependency
  }

  const toggleLevel = (level) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const resetFilters = () => {
    setFilter("all")
    setSortBy("popular")
    setSearchQuery("")
    setSelectedLevels([])
    setSelectedCategories([])
    setPriceRange([0, 200])
  }

  const loadMoreCourses = () => {
    setVisibleCourses((prev) => prev + 8)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-[420px] animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        className="text-left mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <GraduationCap size={64} className=" text-[#ffaa00] mr-4" />
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            <span className="text-transparent bg-clip-text bg-[#ffaa00]">
              Expand Your
            </span>{" "}
            Knowledge
          </h1>
        </div>
        <p className="text-gray-600 leading-relaxed max-w-4xl">
          Professional courses designed to help you achieve your career goals with hands-on projects and expert
          instruction.
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full px-5 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Courses
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </motion.button>
        </form>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6 mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Sliders className="h-4 w-4 mr-2" />
                    Price Range
                  </h3>
                  <div className="px-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Level
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        y={level}
                        onClick={() => toggleLevel(level)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedLevels.includes(level)
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
              
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => setFilter("all")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All Courses
            </motion.button>
            <motion.button
              onClick={() => setFilter("premium")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${filter === "premium" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <Zap className="h-3.5 w-3.5" />
              Premium
            </motion.button>
            <motion.button
              onClick={() => setFilter("free")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "free" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Free
            </motion.button>
            <motion.button
              onClick={() => setFilter("certificate")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${filter === "certificate" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Certificate
            </motion.button>
          </div>

          <div className="flex items-center">
            <label htmlFor="sort" className="text-sm text-gray-600 mr-2 whitespace-nowrap flex items-center">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 border-0 rounded-full text-sm px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div> */}
      </motion.div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.slice(0, visibleCourses).map((course, index) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCourses < courses.length && (
            <div className="text-left mt-12">
              <motion.button
                onClick={loadMoreCourses}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto"
              >
                Load More Courses
                <ChevronDown className="h-4 w-4" />
              </motion.button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-md">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategories.length > 0 || selectedLevels.length > 0
                ? "Try adjusting your search or filter to find what you're looking for."
                : "We couldn't find any courses matching your criteria."}
            </p>
            <motion.button
              onClick={resetFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset filters
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* View All Button */}
      {courses.length > 0 && visibleCourses >= courses.length && (
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
         
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.div
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <PlayCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Available Courses</p>
            <h3 className="text-2xl font-bold text-gray-900">{courses.length}+</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full mr-4">
            <Clock3 className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Hours of Content</p>
            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CourseList