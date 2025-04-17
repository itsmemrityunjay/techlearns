"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Briefcase,
  BookOpen,
  User,
  Calendar,
  MapPin,
  Mail,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Star,
  Upload,
  AlertCircle,
} from "lucide-react"
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"
import { db, storage } from "../../database/Firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

// Mentor Application Form Component
const MentorApplicationForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: [],
    experience: "",
    bio: "",
    availability: "",
    profileImage: null,
    resume: null,
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const expertiseOptions = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Data Science",
    "Machine Learning",
    "Cloud Computing",
    "DevOps",
    "Blockchain",
    "Game Development",
    "Cybersecurity",
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleExpertiseChange = (expertise) => {
    setFormData((prev) => {
      const updatedExpertise = prev.expertise.includes(expertise)
        ? prev.expertise.filter((item) => item !== expertise)
        : [...prev.expertise, expertise]

      return { ...prev, expertise: updatedExpertise }
    })

    if (errors.expertise) {
      setErrors({ ...errors, expertise: "" })
    }
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, [fieldName]: file })
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (formData.expertise.length === 0) newErrors.expertise = "Select at least one area of expertise"
    if (!formData.experience.trim()) newErrors.experience = "Experience details are required"
    if (!formData.bio.trim()) newErrors.bio = "Bio is required"
    if (!formData.availability) newErrors.availability = "Availability information is required"
    if (!formData.profileImage) newErrors.profileImage = "Profile image is required"
    if (!formData.resume) newErrors.resume = "Resume is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // In a real application, you would upload the files to storage
      // and send the form data to your backend
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Simulate API call if no onSubmit provided
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      // Success state
      setSubmitSuccess(true)

      // Reset form after success
      setTimeout(() => {
        onClose()
        // Optionally redirect or show a success message
      }, 2000)
    } catch (error) {
      setSubmitError("Failed to submit application. Please try again.")
      console.error("Application submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mentor Application</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p>{submitError}</p>
              </div>
            </div>
          )}

          {submitSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
              <h3 className="font-semibold">Application Submitted!</h3>
              <p>Your application has been submitted successfully. We'll review it and get back to you soon.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting || submitSuccess}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting || submitSuccess}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting || submitSuccess}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="availability" className="block font-medium">
                Availability <span className="text-red-500">*</span>
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleSelectChange}
                className="w-full p-2 border rounded-md"
                disabled={isSubmitting || submitSuccess}
              >
                <option value="">Select your availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="evenings">Evenings</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.availability && <p className="text-sm text-red-500">{errors.availability}</p>}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="block font-medium">
              Areas of Expertise <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {expertiseOptions.map((expertise) => (
                <div key={expertise} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`expertise-${expertise}`}
                    checked={formData.expertise.includes(expertise)}
                    onChange={() => handleExpertiseChange(expertise)}
                    disabled={isSubmitting || submitSuccess}
                    className="rounded"
                  />
                  <label htmlFor={`expertise-${expertise}`} className="text-sm font-medium">
                    {expertise}
                  </label>
                </div>
              ))}
            </div>
            {errors.expertise && <p className="text-sm text-red-500">{errors.expertise}</p>}
          </div>

          <div className="space-y-2 mb-6">
            <label htmlFor="experience" className="block font-medium">
              Professional Experience <span className="text-red-500">*</span>
            </label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Describe your professional experience, including years of experience and relevant roles"
              className="w-full p-2 border rounded-md min-h-[100px]"
              disabled={isSubmitting || submitSuccess}
            />
            {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
          </div>

          <div className="space-y-2 mb-6">
            <label htmlFor="bio" className="block font-medium">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write a short bio that will be displayed on your mentor profile"
              className="w-full p-2 border rounded-md min-h-[100px]"
              disabled={isSubmitting || submitSuccess}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label htmlFor="profileImage" className="block font-medium">
                Profile Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profileImage")}
                  className="hidden"
                  disabled={isSubmitting || submitSuccess}
                />
                <div className="border rounded-md p-2 w-full flex items-center justify-between">
                  <span className="text-sm text-gray-500 truncate">
                    {formData.profileImage ? formData.profileImage.name : "No file selected"}
                  </span>
                  <label htmlFor="profileImage" className="cursor-pointer">
                    <button
                      type="button"
                      className="px-3 py-1 border rounded-md hover:bg-gray-50"
                      onClick={() => document.getElementById("profileImage").click()}
                    >
                      <Upload className="h-4 w-4 inline mr-1" />
                      Browse
                    </button>
                  </label>
                </div>
              </div>
              {errors.profileImage && <p className="text-sm text-red-500">{errors.profileImage}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="resume" className="block font-medium">
                Resume/CV <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "resume")}
                  className="hidden"
                  disabled={isSubmitting || submitSuccess}
                />
                <div className="border rounded-md p-2 w-full flex items-center justify-between">
                  <span className="text-sm text-gray-500 truncate">
                    {formData.resume ? formData.resume.name : "No file selected"}
                  </span>
                  <label htmlFor="resume" className="cursor-pointer">
                    <button
                      type="button"
                      className="px-3 py-1 border rounded-md hover:bg-gray-50"
                      onClick={() => document.getElementById("resume").click()}
                    >
                      <Upload className="h-4 w-4 inline mr-1" />
                      Browse
                    </button>
                  </label>
                </div>
              </div>
              {errors.resume && <p className="text-sm text-red-500">{errors.resume}</p>}
            </div>
          </div>

          <div className="flex items-start space-x-2 mb-6">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              disabled={isSubmitting || submitSuccess}
              className="mt-1"
            />
            <div>
              <label htmlFor="agreeToTerms" className="text-sm font-medium">
                I agree to the terms and conditions <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500">
                By submitting this application, you agree to our mentor guidelines and code of conduct.
              </p>
              {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
            </div>
          </div>

          <div className="flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={isSubmitting || submitSuccess}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: "var(--secondary-color)" }}
              disabled={isSubmitting || submitSuccess}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

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
  const [mentors, setMentors] = useState([])
  const [allMentors, setAllMentors] = useState([]) // Store all mentors for filtering
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("about")
  const [toastMessage, setToastMessage] = useState(null)
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMobile = useMobile()
  const modalRef = useRef(null)

  // Fetch mentors from Firestore
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const mentorsRef = collection(db, "mentors")

        // Set up real-time listener
        const unsubscribe = onSnapshot(
          mentorsRef,
          (querySnapshot) => {
            const mentorsData = querySnapshot.docs.map((doc) => {
              const data = doc.data()
              return {
                id: doc.id,
                name: data.name || "Unknown",
                role: data.specialization?.[0] || "Mentor",
                image: data.profileImage || "/placeholder.svg?height=400&width=400",
                expertise: data.expertise || [],
                bio: data.bio || "No bio available",
                about: data.bio || "No bio available",
                topics: data.specialization || [],
                skills: data.expertise || [],
                location: data.location || "Remote",
                availability: data.isAvailable ? "Available" : "Unavailable",
                languages: data.languages || ["English"],
                rating: data.rating || 0,
                reviewCount: data.totalReviews || 0,
                email: data.email || "",
                website: "",
                social: {
                  linkedin: data.socialLinks?.linkedin || "",
                  github: data.socialLinks?.github || "",
                  twitter: data.socialLinks?.twitter || "",
                },
                experience: [],
                education: [],
              }
            })

            console.log("Fetched mentors:", mentorsData)
            setAllMentors(mentorsData)
            setMentors(mentorsData)
            setIsLoading(false)
          },
          (err) => {
            console.error("Error fetching mentors:", err)
            setError("Failed to load mentors. Please try again later.")
            setIsLoading(false)
          },
        )

        return () => unsubscribe()
      } catch (error) {
        console.error("Error setting up mentors listener:", error)
        setError("Failed to load mentors. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchMentors()
  }, [])

  // Filter mentors based on expertise and search query
  useEffect(() => {
    if (allMentors.length === 0) return

    let filtered = [...allMentors]

    if (filter !== "all") {
      filtered = filtered.filter((mentor) => mentor.expertise.some((exp) => exp.toLowerCase() === filter.toLowerCase()))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (mentor) =>
          mentor.name?.toLowerCase().includes(query) ||
          mentor.role?.toLowerCase().includes(query) ||
          mentor.expertise?.some((exp) => exp.toLowerCase().includes(query)) ||
          mentor.topics?.some((topic) => topic.toLowerCase().includes(query)),
      )
    }

    setMentors(filtered)
  }, [filter, searchQuery, allMentors])

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

  // Handle mentor application submission
  const handleApplicationSubmit = async (formData) => {
    try {
      // Upload profile image
      const profileImageRef = ref(storage, `mentor-applications/${formData.email}/profile-${Date.now()}`)
      const profileUploadTask = uploadBytesResumable(profileImageRef, formData.profileImage)

      // Wait for upload to complete
      await new Promise((resolve, reject) => {
        profileUploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => reject(error),
          () => resolve(),
        )
      })

      const profileImageURL = await getDownloadURL(profileUploadTask.snapshot.ref)

      // Upload resume
      const resumeRef = ref(storage, `mentor-applications/${formData.email}/resume-${Date.now()}`)
      const resumeUploadTask = uploadBytesResumable(resumeRef, formData.resume)

      // Wait for upload to complete
      await new Promise((resolve, reject) => {
        resumeUploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => reject(error),
          () => resolve(),
        )
      })

      const resumeURL = await getDownloadURL(resumeUploadTask.snapshot.ref)

      // Save application to Firestore
      await addDoc(collection(db, "mentor-applications"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        expertise: formData.expertise,
        experience: formData.experience,
        bio: formData.bio,
        availability: formData.availability,
        profileImageURL,
        resumeURL,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      // Show success message
      setToastMessage({
        type: "success",
        message: "Application submitted successfully!",
      })

      setTimeout(() => {
        setToastMessage(null)
      }, 3000)
    } catch (error) {
      console.error("Error submitting application:", error)
      throw error
    }
  }

  // Get unique expertise areas for filter
  const expertiseAreas = Array.from(new Set(allMentors.flatMap((mentor) => mentor.expertise || [])))

  // Show toast message
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Handle mentor selection
  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor)
    setActiveTab("about")
  }

  // Format rating display
  const formatRating = (rating) => {
    return rating.toFixed(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Message */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toastMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {toastMessage.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Our Mentors</h1>
          <p className="text-gray-600 max-w-2xl">
            Connect with experienced professionals who can guide you through your learning journey and help you achieve
            your goals.
          </p>
        </div>
        <button
          onClick={() => setIsApplicationFormOpen(true)}
          className="mt-4 md:mt-0 px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: "var(--secondary-color)" }}
        >
          Become a Mentor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search mentors by name, role, or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-md"
          />
        </div>
        <div className="w-full md:w-64">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full p-3 border rounded-md">
            <option value="all">All Expertise</option>
            {expertiseAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-8">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && mentors.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            {filter !== "all" || searchQuery
              ? "Try adjusting your search or filter criteria."
              : "There are currently no mentors available. Check back later or apply to become a mentor."}
          </p>
          {(filter !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setFilter("all")
                setSearchQuery("")
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Mentors Grid */}
      {!isLoading && !error && mentors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMentorSelect(mentor)}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={mentor.image || "/placeholder.svg?height=400&width=400"}
                      alt={mentor.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=400&width=400"
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.role}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(mentor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">
                        {formatRating(mentor.rating)} ({mentor.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      +{mentor.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mentor Detail Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Mentor Profile</h2>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={selectedMentor.image || "/placeholder.svg?height=400&width=400"}
                        alt={selectedMentor.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=400&width=400"
                        }}
                      />
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{selectedMentor.name}</h3>
                        <p className="text-gray-600">{selectedMentor.role}</p>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(selectedMentor.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                          {formatRating(selectedMentor.rating)} ({selectedMentor.reviewCount} reviews)
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{selectedMentor.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{selectedMentor.availability}</span>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Contact</h4>
                        {selectedMentor.email && (
                          <a
                            href={`mailto:${selectedMentor.email}`}
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{selectedMentor.email}</span>
                          </a>
                        )}
                        {selectedMentor.website && (
                          <a
                            href={selectedMentor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            <span>{selectedMentor.website}</span>
                          </a>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Social</h4>
                        <div className="flex gap-2">
                          {selectedMentor.social.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${selectedMentor.social.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                              aria-label="LinkedIn"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {selectedMentor.social.github && (
                            <a
                              href={`https://github.com/${selectedMentor.social.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                              aria-label="GitHub"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                          {selectedMentor.social.twitter && (
                            <a
                              href={`https://twitter.com/${selectedMentor.social.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                              aria-label="Twitter"
                            >
                              <Twitter className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <div className="border-b mb-6">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setActiveTab("about")}
                          className={`pb-2 px-1 ${
                            activeTab === "about" ? "border-b-2 border-gray-900 font-medium" : "text-gray-500"
                          }`}
                        >
                          About
                        </button>
                        <button
                          onClick={() => setActiveTab("experience")}
                          className={`pb-2 px-1 ${
                            activeTab === "experience" ? "border-b-2 border-gray-900 font-medium" : "text-gray-500"
                          }`}
                        >
                          Experience
                        </button>
                        <button
                          onClick={() => setActiveTab("education")}
                          className={`pb-2 px-1 ${
                            activeTab === "education" ? "border-b-2 border-gray-900 font-medium" : "text-gray-500"
                          }`}
                        >
                          Education
                        </button>
                      </div>
                    </div>

                    {activeTab === "about" && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">About</h3>
                        <p className="text-gray-600 mb-6">{selectedMentor.about}</p>

                        <h4 className="font-medium mb-3">Topics</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedMentor.topics.map((topic) => (
                            <span key={topic} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-medium mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedMentor.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-medium mb-3">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMentor.languages.map((language) => (
                            <span key={language} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "experience" && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Professional Experience</h3>
                        {selectedMentor.experience && selectedMentor.experience.length > 0 ? (
                          <div className="space-y-6">
                            {selectedMentor.experience.map((exp, index) => (
                              <div key={index} className="border-l-2 border-gray-200 pl-4">
                                <h4 className="font-medium">{exp.role}</h4>
                                <div className="flex items-center text-gray-600 mb-2">
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  <span>{exp.company}</span>
                                  <span className="mx-2">•</span>
                                  <span>{exp.duration}</span>
                                </div>
                                <p className="text-gray-600">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No experience information available.</p>
                        )}
                      </div>
                    )}

                    {activeTab === "education" && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Education</h3>
                        {selectedMentor.education && selectedMentor.education.length > 0 ? (
                          <div className="space-y-6">
                            {selectedMentor.education.map((edu, index) => (
                              <div key={index} className="border-l-2 border-gray-200 pl-4">
                                <h4 className="font-medium">{edu.degree}</h4>
                                <div className="flex items-center text-gray-600 mb-2">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  <span>{edu.institution}</span>
                                  <span className="mx-2">•</span>
                                  <span>{edu.year}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No education information available.</p>
                        )}
                      </div>
                    )}

                    <div className="mt-8 pt-6 border-t">
                      <button
                        className="w-full py-3 rounded-md text-white font-medium"
                        style={{ backgroundColor: "var(--secondary-color)" }}
                      >
                        Request Mentorship
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mentor Application Form */}
      {isApplicationFormOpen && (
        <MentorApplicationForm onClose={() => setIsApplicationFormOpen(false)} onSubmit={handleApplicationSubmit} />
      )}
    </div>
  )
}

export default Mentors