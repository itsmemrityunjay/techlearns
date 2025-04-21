"use client"

import { useState } from "react"
import { db, storage } from "../../database/Firebase"
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import heroimg from "../../components/comp/mainhero.jpg"
import { useAuth } from "../../database/AuthContext"
import form1 from "../comp/form1.jpg"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

const Competitions = () => {
  const [showModal, setShowModal] = useState(false)
  const [iconFile, setIconFile] = useState(null)
  const [iconURL, setIconURL] = useState("")
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    icon: "", // Will be set to iconURL after upload
    type: "",
    title: "",
    subtitle: "",
    privacy: "public", // Default to public
    visibility: "everyone", // Default to everyone
    whoCanJoin: "everyone", // Default to everyone
    terms: "",
    eligibility: "",
    prizePool: "",
    enableNotebook: false,
    evaluationCriteria: "",
    fileSubmission: false,
    file: null,
    startDate: "", // New field for start date
    startTime: "", // New field for start time
    endDate: "", // New field for end date
    endTime: "", // New field for end time
    author: currentUser ? currentUser.email : "",
  })

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // navigate
  const navigate = useNavigate()

  // IMPORTANT: Replace this function with one that opens the modal
  const handleHostClick = (e) => {
    e.preventDefault() // Prevent default navigation
    setShowModal(true) // Open the modal directly
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle icon upload
  const handleIconUpload = async (file) => {
    if (!file) {
      toast.error("Please select an icon file to upload.")
      return
    }

    try {
      const storageRef = ref(storage, `competition-icons/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can implement progress updates here if desired
        },
        (error) => {
          console.error("Error uploading icon:", error)
          toast.error("Failed to upload icon.")
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          setIconURL(downloadURL)
          setFormData((prevData) => ({
            ...prevData,
            icon: downloadURL,
          }))
          toast.success("Icon successfully uploaded!")
        },
      )
    } catch (error) {
      console.error("Error in handleIconUpload:", error)
      toast.error("Failed to upload icon.")
    }
  }

  // Handle file change for submissions
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] })
  }

  // Handle competition submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")
    setIsSubmitting(true) // Set to true when starting submission

    try {
      let fileURL = ""
      // If file submission is enabled and a file is selected, upload the file
      if (formData.fileSubmission && formData.file) {
        const file = formData.file
        const fileStorageRef = ref(storage, `competition-files/${file.name}`)
        const uploadTask = uploadBytesResumable(fileStorageRef, file)

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // You can implement progress updates here if desired
            },
            (error) => {
              console.error("Error uploading file:", error)
              reject(error)
            },
            async () => {
              fileURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve()
            },
          )
        })

        // Update formData with the fileURL
        setFormData((prevData) => ({
          ...prevData,
          file: fileURL,
        }))
      }

      // Add competition to Firestore
      await addDoc(collection(db, "competitions"), {
        ...formData,
        status: "pending", // Set as pending for admin approval
        createdAt: new Date(),
      })

      setSuccessMessage("Competition submitted for approval.")
      setShowModal(false) // Close modal after submission
      setFormData({
        // Reset form data
        icon: "",
        type: "",
        title: "",
        subtitle: "",
        privacy: "public",
        visibility: "everyone",
        whoCanJoin: "everyone",
        terms: "",
        eligibility: "",
        prizePool: "",
        enableNotebook: false,
        evaluationCriteria: "",
        fileSubmission: false,
        file: null,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      })
      setIconURL("")
    } catch (error) {
      console.error("Error submitting competition:", error)
      setErrorMessage("Error submitting competition: " + error.message)
    } finally {
      setIsSubmitting(false) // Reset submission state whether successful or not
    }
  }

  return (
    <div className="container mx-auto py-8 ">
      <div
        className="w-full mt-5 flex flex-col md:flex-row items-start justify-between rounded-xl  md:bg-transparent min-h-[450px]"
      >
        {/* Left Section */}
        <div className="flex-1 mb-6 md:mb-0 mt-8 md:mt-14 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold text-gray-800 mb-4">Competitions</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg leading-relaxed">
            Grow your data science skills by competing in our exciting <br className="hidden md:inline" /> competitions.
            Find help in the{" "}
            <a className="text-black-600 underline" href="/docs/competitions" target="_blank" rel="noopener noreferrer">
              documentation
            </a>{" "}
            or learn about <br className="hidden md:inline" />
            <a className="text-black-600 underline" href="/c/about/community" target="_blank" rel="noopener noreferrer">
              Community Competitions
            </a>
            .
          </p>

          <div className="flex space-x-4">
            <button
              className="bg-[--secondary-color] hover:bg-[--primary-color] text-white font-semibold py-2 px-6 rounded-3xl transition duration-200 text-sm sm:text-base"
              onClick={handleHostClick}
            >
              Host a Competition
            </button>



          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="w-full md:w-[45%] mt-6 md:mt-0 flex justify-center items-center">
          <img
            src="https://d8it4huxumps7.cloudfront.net/uploads/images/676e555db74f7_compete.png?d=1000x600"
            alt="Compete Visual"
            className="w-full h-auto"
          />
        </div>
      </div>


      {/* Modal for hosting competition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 overflow-y-auto p-4">
          <div className="bg-white dark:bg-gray-850 p-6 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-auto relative ">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-xl font-medium text-gray-800 dark:text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                  <path d="M10 8a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                Host a Competition
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Form Section */}
              <div className="w-full md:w-3/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">Basic Information</h3>

                    <div className="space-y-4">
                      {/* Title & Type Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title*</label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                            placeholder="Enter competition title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Competition Type*</label>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="featured">Featured</option>
                            <option value="Getting Started">Getting Started</option>
                            <option value="Research">Research</option>
                            <option value="data-science">Data Science</option>
                            <option value="ai">AI</option>
                            <option value="machine-learning">Machine Learning</option>
                            <option value="simulation">Simulation</option>
                            <option value="analyatics">Analytics</option>
                          </select>
                        </div>
                      </div>

                      {/* Subtitle */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                        <input
                          type="text"
                          name="subtitle"
                          value={formData.subtitle}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Brief description for your competition"
                        />
                      </div>

                      {/* Competition Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Competition Image</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIconFile(e.target.files[0])}
                            className="hidden"
                            id="competitionImage"
                          />
                          <label
                            htmlFor="competitionImage"
                            className="cursor-pointer px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            Choose File
                          </label>
                          {iconFile && <span className="text-xs text-gray-500">{iconFile.name}</span>}
                          <button
                            type="button"
                            disabled={!iconFile}
                            className={`ml-2 px-3 py-1.5 rounded-md text-sm ${!iconFile ?
                              'bg-gray-100 text-gray-400 cursor-not-allowed' :
                              'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                            onClick={() => handleIconUpload(iconFile)}
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Privacy</label>
                        <select
                          name="privacy"
                          value={formData.privacy}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Who Can Join</label>
                        <select
                          name="whoCanJoin"
                          value={formData.whoCanJoin}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="everyone">Everyone</option>
                          <option value="invitation-only">Invitation Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enableNotebook"
                          name="enableNotebook"
                          checked={formData.enableNotebook}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="enableNotebook" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Enable notebook feature
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="fileSubmission"
                          name="fileSubmission"
                          checked={formData.fileSubmission}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="fileSubmission" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Allow file submissions
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Competition Details */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">Competition Details</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eligibility Criteria</label>
                        <textarea
                          name="eligibility"
                          value={formData.eligibility}
                          onChange={handleChange}
                          rows={2}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Describe who is eligible to participate"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prize Pool</label>
                        <input
                          type="text"
                          name="prizePool"
                          value={formData.prizePool}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="E.g., $1000 first place, $500 second place"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Evaluation Criteria</label>
                        <textarea
                          name="evaluationCriteria"
                          value={formData.evaluationCriteria}
                          onChange={handleChange}
                          rows={2}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Describe how submissions will be evaluated"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">Schedule</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date*</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time*</label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date*</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time*</label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-indigo-600 border border-transparent rounded-md shadow-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
                    >
                      <span>{isSubmitting ? 'Submitting...' : 'Create Competition'}</span>
                      {isSubmitting && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Section */}
              <div className="w-full md:w-2/5">
                <div className="sticky top-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium mb-3">Preview</h3>

                  <div className="rounded-md overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700 aspect-video flex items-center justify-center">
                    {iconURL ? (
                      <img src={iconURL} alt="Competition Preview" className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={form1 || "/placeholder.svg"}
                        alt="Competition Visual"
                        className="w-full h-auto rounded-md"
                      />
                    )}
                  </div>

                  {formData.title && (
                    <div className="mb-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">{formData.title}</h4>
                      {formData.subtitle && <p className="text-sm text-gray-600 dark:text-gray-300">{formData.subtitle}</p>}
                    </div>
                  )}

                  <div className="space-y-2">
                    {formData.type && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded text-xs">{formData.type}</span>
                      </div>
                    )}

                    {(formData.startDate || formData.endDate) && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {formData.startDate && formData.startDate}{formData.startTime && ` ${formData.startTime}`}
                          {formData.endDate && ` to ${formData.endDate}`}{formData.endTime && ` ${formData.endTime}`}
                        </span>
                      </div>
                    )}

                    {formData.prizePool && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Prize:</span>
                        <span className="text-gray-600 dark:text-gray-300">{formData.prizePool}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {formData.enableNotebook && (
                        <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs">Notebook Enabled</span>
                      )}
                      {formData.fileSubmission && (
                        <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs">File Submissions</span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${formData.privacy === 'private'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        }`}>
                        {formData.privacy === 'private' ? 'Private' : 'Public'}
                      </span>
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                        {formData.whoCanJoin === 'invitation-only' ? 'Invitation Only' : 'Open to Everyone'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Success or Error Messages Outside Modal if Needed */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">{errorMessage}</div>
      )}

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  )
}

export default Competitions



