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
    }
  }

  return (
    <div className="container mx-auto py-8 ">
     <div
  className="w-full mt-5 flex flex-col md:flex-row items-start justify-between max-w-8xl p-4 md:p-6 rounded-xl bg-[#cf9dd1] md:bg-transparent min-h-[450px]"
>
  {/* Left Section */}
  <div className="flex-1 mb-6 md:mb-0 mt-8 md:mt-14 px-4 md:ml-12 flex flex-col justify-center">
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
        Join Competition
      </button>

      <button
  className="border border-black hover:bg-[--primary-color] text-blue font-semibold py-2 px-6 rounded-3xl transition duration-200 text-sm sm:text-base"
  onClick={handleHostClick}
>
  + Host a Competition
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto p-4">
          <div className="bg-white p-4 md:p-8 rounded-[20px] shadow-lg w-full max-w-6xl relative overflow-y-auto max-h-[90vh]">
            <h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:ml-24 text-center md:text-left"
              style={{ fontFamily: "roboto" }}
            >
              Host a Competition
            </h2>

            <div className="flex flex-col md:flex-row">
              {/* Form Section */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 w-full md:w-1/2 md:ml-24 overflow-y-auto max-h-[70vh] pr-4"
              >
                {/* Competition Image */}
                <div className="mb-4">
                  <label className="block mb-2 font-bold text-gray-700">Competition Image</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setIconFile(e.target.files[0])}
                      className="hidden"
                      id="competitionImage"
                    />
                    <label
                      htmlFor="competitionImage"
                      className="cursor-pointer bg-[--secondary-color] text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
                    >
                      Choose File
                    </label>
                    <button
                      type="button"
                      className="bg-[--secondary-color] text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
                      onClick={() => handleIconUpload(iconFile)}
                    >
                      Upload Icon
                    </button>
                  </div>
                </div>

                {/* Competition Type */}
                <div>
                  <label className="block text-gray-700 font-semibold">Competition Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    required
                  >
                    <option value="">Select Competition Type</option>
                    <option value="featured">Featured</option>
                    <option value="Getting Started">Getting Started</option>
                    <option value="Research">Research</option>
                    <option value="data-science">Data Science</option>
                    <option value="ai">AI</option>
                    <option value="machine-learning">Machine Learning</option>
                    <option value="simulation">Simulation</option>
                    <option value="analyatics">Analyatics</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-semibold">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-gray-700 font-semibold">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                  />
                </div>

                {/* Privacy Access */}
                <div>
                  <label className="block text-gray-700 font-semibold">Privacy Access</label>
                  <select
                    name="privacy"
                    value={formData.privacy}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {/* Who Can Join */}
                <div>
                  <label className="block text-gray-700 font-semibold">Who Can Join</label>
                  <select
                    name="whoCanJoin"
                    value={formData.whoCanJoin}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="invitation-only">Invitation Only</option>
                  </select>
                </div>

                {/* Eligibility Criteria */}
                <div>
                  <label className="block text-gray-700 font-semibold">Eligibility Criteria</label>
                  <textarea
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    placeholder="Describe who is eligible to participate."
                  ></textarea>
                </div>

                {/* Prize Pool */}
                <div>
                  <label className="block text-gray-700 font-semibold">Prize Pool</label>
                  <input
                    type="text"
                    name="prizePool"
                    value={formData.prizePool}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    placeholder="Enter prize pool details."
                  />
                </div>

                {/* Enable Notebook */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableNotebook"
                    checked={formData.enableNotebook}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700 font-semibold">Enable notebook feature</label>
                </div>

                {/* Evaluation Criteria */}
                <div>
                  <label className="block text-gray-700 font-semibold">Evaluation Criteria</label>
                  <textarea
                    name="evaluationCriteria"
                    value={formData.evaluationCriteria}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    placeholder="Describe how submissions will be evaluated."
                  ></textarea>
                </div>

                {/* File Submission */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="fileSubmission"
                    checked={formData.fileSubmission}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700 font-semibold">Allow file submissions</label>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-gray-700 font-semibold">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    required
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-gray-700 font-semibold">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-gray-700 font-semibold">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    required
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-gray-700 font-semibold">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="p-3 border border-purple-400 rounded-xl w-full"
                    required
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full w-28"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[--secondary-color] hover:bg-[--primary-color] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl w-28"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* Image Section */}
              <div className="mt-6 md:mt-0 w-full md:w-1/2 flex justify-center md:justify-end overflow-y-auto">
                <img
                  className="w-11/12 rounded-lg object-contain"
                  src={form1 || "/placeholder.svg"}
                  alt="Competition Visual"
                />
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

