"use client"

import { useEffect, useState } from "react"
import { AccountCircle } from "@mui/icons-material"
import { Line } from "react-chartjs-2"
import { PieChart } from "@mui/x-charts/PieChart"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Modal from "react-modal"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import "chart.js/auto"
import GroupIcon from "@mui/icons-material/Group"
import { collection, onSnapshot, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { db, storage } from "../../database/Firebase"
import ModalMain from "./Modal"
import { useAuth } from "../../database/AuthContext"
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"
import SchoolIcon from "@mui/icons-material/School"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PersonIcon from "@mui/icons-material/Person"
import UploadCourseVideoModal from "./UploadCourseVideo"
import CreateAssignmentModal from "./CreateAssignmentModal"
import AssignmentSubmissionsOverview from "./AssignmentSubmissionsOverview"
import { useParams } from "react-router-dom"
import { X, LucideCheckCircle, XCircle, User, Calendar, ExternalLink } from "lucide-react"

function AdminDashboard() {
  const { courseId } = useParams() // Get the course ID from route

  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("")
  const [users, setUsers] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [courses, setCourses] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [courseTitle, setCourseTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sections, setSections] = useState([])
  const [iconFile, setIconFile] = useState(null)
  const [iconURL, setIconURL] = useState("")

  // Mentor applications state
  const [mentorApplicationsModalOpen, setMentorApplicationsModalOpen] = useState(false)
  const [pendingMentorApplications, setPendingMentorApplications] = useState(0)
  const [applications, setApplications] = useState([])
  const [isLoadingApplications, setIsLoadingApplications] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  // const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    course: "",
    address: "",
    profileImageFile: null,
    profileImageURL: "",
  })

  useEffect(() => {
    const fetchCompetitions = async () => {
      const querySnapshot = await getDocs(collection(db, "competitions"))
      const competitionsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setCompetitions(competitionsData)
    }

    fetchCompetitions()
  }, [])

  // Fetch pending mentor applications count
  useEffect(() => {
    const fetchPendingMentorApplications = async () => {
      try {
        const q = collection(db, "mentor-applications")
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const pendingCount = querySnapshot.docs.filter((doc) => doc.data().status === "pending").length
          setPendingMentorApplications(pendingCount)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error("Error fetching pending mentor applications:", error)
      }
    }

    fetchPendingMentorApplications()
  }, [])

  // Fetch mentor applications when modal is opened
  useEffect(() => {
    if (mentorApplicationsModalOpen) {
      fetchMentorApplications()
    }
  }, [mentorApplicationsModalOpen, activeTab])

  // Function to fetch mentor applications
  const fetchMentorApplications = async () => {
    try {
      setIsLoadingApplications(true)

      // Instead of using a complex query that requires an index
      // First get all mentor applications
      const mentorAppsRef = collection(db, "mentor-applications")
      const querySnapshot = await getDocs(mentorAppsRef)

      // Then filter them in memory based on status
      const applicationsData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data()
          // Ensure expertise is always an array
          let expertise = data.expertise || []
          if (!Array.isArray(expertise)) {
            expertise = typeof expertise === "string" ? [expertise] : []
          }

          return {
            id: doc.id,
            ...data,
            expertise: expertise, // Use our sanitized expertise array
            createdAt: data.createdAt?.toDate?.() || new Date(),
            // Ensure these fields exist to prevent UI errors
            name: data.name || "Unknown",
            email: data.email || "No email provided",
            experience: data.experience || "No experience provided",
            bio: data.bio || "No bio provided",
          }
        })
        .filter((app) => app.status === activeTab)
        // Sort manually by createdAt
        .sort((a, b) => b.createdAt - a.createdAt)

      console.log("Fetched applications:", applicationsData)
      setApplications(applicationsData)
    } catch (error) {
      console.error("Error fetching mentor applications:", error)
    } finally {
      setIsLoadingApplications(false)
    }
  }

  // Add this function to handle mentor creation
  const createMentorDocument = async (application) => {
    try {
      // First check if mentor already exists
      const mentorQuery = query(
        collection(db, "mentors"),
        where("email", "==", application.email)
      );
      const mentorDocs = await getDocs(mentorQuery);

      if (!mentorDocs.empty) {
        throw new Error("Mentor already exists");
      }

      // Create mentor document with all required fields
      await addDoc(collection(db, "mentors"), {
        name: application.name,
        email: application.email,
        bio: application.bio || "",
        expertise: application.expertise || [],
        experience: application.experience || "",
        profileImage: application.profileImageURL || "",
        socialLinks: {
          linkedin: application.linkedin || "",
          github: application.github || "",
          twitter: application.twitter || ""
        },
        education: application.education || "",
        location: application.location || "",
        status: "active",
        mentorId: application.id, // unique identifier
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAvailable: true,
        rating: 0,
        totalReviews: 0,
        specialization: application.specialization || [],
        languages: application.languages || [],
        achievements: application.achievements || []
      });

      // Update user role
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", application.email)
      );
      const userDocs = await getDocs(userQuery);

      if (!userDocs.empty) {
        const userDoc = userDocs.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          role: "mentor",
          isMentor: true
        });
      }

      // Update application status
      await updateDoc(doc(db, "mentor-applications", application.id), {
        status: "approved",
        updatedAt: serverTimestamp()
      });

    } catch (error) {
      console.error("Error in createMentorDocument:", error);
      throw error;
    }
  };

  // Modify the handleApproveApplication function
  const handleApproveApplication = async (id) => {
    try {
      const applicationRef = doc(db, "mentor-applications", id);
      const applicationSnap = await getDoc(applicationRef);

      if (applicationSnap.exists()) {
        const applicationData = {
          ...applicationSnap.data(),
          id: applicationSnap.id
        };

        await createMentorDocument(applicationData);

        setApplications(prev =>
          prev.map(app =>
            app.id === id ? { ...app, status: "approved" } : app
          )
        );

        alert("Mentor approved successfully!");
      }
    } catch (error) {
      console.error("Error approving mentor:", error);
      alert(`Failed to approve mentor: ${error.message}`);
    }
  };

  // Function to reject mentor application
  const handleRejectApplication = async (id) => {
    try {
      await updateDoc(doc(db, "mentor-applications", id), {
        status: "rejected",
        updatedAt: new Date(),
      })

      // Remove from current list
      setApplications((prev) => prev.filter((app) => app.id !== id))

      // Show success message
      alert("Application rejected successfully!")
    } catch (error) {
      console.error("Error rejecting application:", error)
      alert("Failed to reject application. Please try again.")
    }
  }

  // Function to delete mentor application
  const handleDeleteApplication = async (id) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "mentor-applications", id))

        // Remove from current list
        setApplications((prev) => prev.filter((app) => app.id !== id))

        // Close details modal if open
        if (detailsModalOpen && selectedApplication?.id === id) {
          setDetailsModalOpen(false)
        }

        // Show success message
        alert("Application deleted successfully!")
      } catch (error) {
        console.error("Error deleting application:", error)
        alert("Failed to delete application. Please try again.")
      }
    }
  }

  // Function to open application details modal
  const openApplicationDetailsModal = (application) => {
    setSelectedApplication(application)
    setDetailsModalOpen(true)
  }

  // Function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to handle profile image upload
  const handleProfileImageUpload = async () => {
    if (!profileData.profileImageFile) {
      alert("Please select an image.")
      return
    }
    const storageRef = ref(storage, `profile-images/${profileData.profileImageFile.name}`)
    const uploadTask = uploadBytesResumable(storageRef, profileData.profileImageFile)

    uploadTask.on(
      "state_changed",
      (snapshot) => { },
      (error) => {
        console.error("Error uploading profile image:", error)
        alert("Failed to upload profile image.")
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        setProfileData((prev) => ({ ...prev, profileImageURL: downloadURL }))
        alert("Profile image successfully uploaded!")
      },
    )
  }

  const handleProfileDataChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const currentUser = useAuth().currentUser

  const handleSaveProfile = async () => {
    if (!profileData.profileImageURL) {
      alert("Please upload a profile image before saving.")
      return
    }

    if (!currentUser?.uid) {
      alert("User is not logged in.")
      return
    }

    // Save or update the user profile data in Firebase
    try {
      const userDocRef = doc(db, "users", currentUser.uid) // Use uid to identify the user document
      await updateDoc(userDocRef, profileData)
      alert("Profile successfully updated!")
      // setEditProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile.")
    }
  }

  useEffect(() => {
    const fetchCompetitions = async () => {
      const querySnapshot = await getDocs(collection(db, "competitions"))
      const competitionsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setCompetitions(competitionsData)
    }

    fetchCompetitions()
  }, [])

  const approveCompetition = async (id) => {
    const competitionRef = doc(db, "competitions", id)
    await updateDoc(competitionRef, { status: "approved" })
    setCompetitions((prev) => prev.map((comp) => (comp.id === id ? { ...comp, status: "approved" } : comp)))
    alert("Competition approved")
  }

  const rejectCompetition = async (id) => {
    const competitionRef = doc(db, "competitions", id)
    await deleteDoc(competitionRef)
    setCompetitions((prev) => prev.filter((comp) => comp.id !== id))
    alert("Competition rejected")
  }

  const handleOpenApprovalModal = () => {
    setApprovalModalOpen(true)
  }

  const handleCloseApprovalModal = () => {
    setApprovalModalOpen(false)
  }

  const handleAddSubheading = () => {
    setSections([...sections, { type: "subHeading", value: "" }])
  }

  const handleAddContent = () => {
    setSections([...sections, { type: "content", value: "" }])
  }

  const handleAddImage = () => {
    setSections([...sections, { type: "image", value: "" }])
  }

  const handleAddCode = () => {
    setSections([...sections, { type: "code", value: "" }])
  }

  const handleSectionChange = (index, value) => {
    const updatedSections = [...sections]
    updatedSections[index].value = value
    setSections(updatedSections)
  }

  const handleRemoveSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index)
    setSections(updatedSections)
  }

  const handleIconUpload = async (file) => {
    const storageRef = ref(storage, `course-icons/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => { },
      (error) => {
        console.error("Error uploading icon: ", error)
        alert("Failed to upload icon")
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        setIconURL(downloadURL)
        alert("Icon successfully uploaded!")
      },
    )
  }

  const handleSubmitCourse = async () => {
    if (!iconURL) {
      alert("Please upload an icon before submitting the course.")
      return
    }

    try {
      await addDoc(collection(db, "courses"), {
        title: courseTitle,
        description,
        sections,
        icon: iconURL,
      })
      alert("Course successfully added!")
    } catch (error) {
      console.error("Error adding course: ", error)
      alert("Failed to add course")
    }

    setModalIsOpen(false)
  }

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"))
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  const fetchCompetitions = async () => {
    const querySnapshot = await getDocs(collection(db, "competitions"))
    setCompetitions(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"))
    setCourses(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  const fetchDiscussions = async () => {
    const querySnapshot = await getDocs(collection(db, "topics"))
    setDiscussions(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  // Real-time listener for users collection
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setUsers(usersData)
      updateChartData(usersData, competitions, courses, discussions)
    })

    return () => unsubscribeUsers()
  }, [competitions, courses, discussions])

  // Real-time listener for competitions collection
  useEffect(() => {
    const unsubscribeCompetitions = onSnapshot(collection(db, "competitions"), (snapshot) => {
      const competitionsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setCompetitions(competitionsData)
      updateChartData(users, competitionsData, courses, discussions)
    })

    return () => unsubscribeCompetitions()
  }, [users, courses, discussions])

  // Real-time listener for courses collection
  useEffect(() => {
    const unsubscribeCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setCourses(coursesData)
      updateChartData(users, competitions, coursesData, discussions)
    })

    return () => unsubscribeCourses()
  }, [users, competitions, discussions])

  // Real-time listener for discussions collection
  useEffect(() => {
    const unsubscribeDiscussions = onSnapshot(collection(db, "topics"), (snapshot) => {
      const discussionsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setDiscussions(discussionsData)
      updateChartData(users, competitions, courses, discussionsData)
    })

    return () => unsubscribeDiscussions()
  }, [users, competitions, courses])

  // Function to update chart data
  const updateChartData = (usersData, competitionsData, coursesData, discussionsData) => {
    setChartData({
      labels: ["Users", "Competitions", "Courses", "Discussions"],
      datasets: [
        {
          label: "Total Counts",
          data: [usersData.length, competitionsData.length, coursesData.length, discussionsData.length],
          backgroundColor: ["#ef4444", "#10b981", "#3b82f6", "#f59e0b"],
        },
      ],
    })
  }

  const navigate = useNavigate()
  const handleCardClick = (item) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  const handleDeleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId))
    fetchUsers()
    updateChartData()
  }

  const handleBlockUser = async (userId) => {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { role: "blocked" })
    fetchUsers()
  }

  const handleDeleteComp = async (compId) => {
    await deleteDoc(doc(db, "competitions", compId))
    fetchCompetitions()
    // updateChartData();
  }

  const handleDeleteCourse = async (courseId) => {
    await deleteDoc(doc(db, "courses", courseId))
    fetchCourses()
    updateChartData()
  }

  const handleEditCourse = (courseId) => {
    navigate(`/courses/${courseId}`)
  }

  const handleMoveToPending = async (compId) => {
    const compRef = doc(db, "competitions", compId)
    await updateDoc(compRef, { status: "pending" })
    fetchCompetitions()
  }

  const [isLive, setIsLive] = useState(false)
  // const { currentUser } = useAuth();

  const startLiveStream = async () => {
    const roomName = "AdminLiveStreamRoom"
    try {
      await setDoc(doc(db, "livestream", "current"), {
        isLive: true,
        roomName,
        startedAt: new Date(),
      })
      setIsLive(true)
      alert("Live stream started!")
    } catch (error) {
      console.error("Error starting livestream:", error)
    }
  }

  const stopLiveStream = async () => {
    try {
      await setDoc(doc(db, "livestream", "current"), {
        isLive: false,
        roomName: "",
      })
      setIsLive(false)
      alert("Live stream stopped!")
    } catch (error) {
      console.error("Error stopping livestream:", error)
    }
  }

  useEffect(() => {
    if (isLive) {
      const domain = "meet.jit.si"
      const options = {
        roomName: "AdminLiveStreamRoom",
        width: "100%",
        height: 600,
        parentNode: document.getElementById("admin-jitsi-container"),
        userInfo: {
          displayName: currentUser?.email || "Admin",
        },
      }
      const api = new window.JitsiMeetExternalAPI(domain, options)

      return () => api.dispose()
    }
  }, [isLive])

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "notifications"))
        const notificationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setNotifications(notificationsData)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), { read: true })
      setNotifications((prev) => prev.map((note) => (note.id === notificationId ? { ...note, read: true } : note)))
    } catch (error) {
      console.error("Error marking notification as read", error)
    }
  }

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  // const currentUser = useAuth().currentUser;

  const addCourseModal = (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      className="bg-white mt-40 p-8 rounded-lg max-w-3xl mx-auto shadow-lg max-h-[70vh] overflow-y-scroll"
      contentLabel="Add Course"
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Add New Course</h2>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Course Icon</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIconFile(e.target.files[0])}
          className="border rounded p-2 w-full"
        />
        <button className="secondary-bg text-white px-4 py-2 rounded mt-2" onClick={() => handleIconUpload(iconFile)}>
          Upload Icon
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Course Title</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Description</label>
        <textarea
          className="border rounded p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {sections.map((section, index) => (
        <div key={index} className="mb-6">
          {section.type === "subHeading" && (
            <div>
              <label className="block mb-2 font-bold">Sub-Heading {index + 1}</label>
              <input
                type="text"
                className="border rounded p-2 w-full"
                value={section.value}
                onChange={(e) => handleSectionChange(index, e.target.value)}
              />
            </div>
          )}
          {section.type === "content" && (
            <div>
              <label className="block mb-2 font-bold">Content</label>
              <ReactQuill
                theme="snow"
                value={section.value}
                onChange={(value) => handleSectionChange(index, value)}
                placeholder="Enter content here..."
              />
            </div>
          )}
          {section.type === "image" && (
            <div>
              <label className="block mb-2 font-bold">Image URL</label>
              <input
                type="text"
                className="border rounded p-2 w-full"
                value={section.value}
                onChange={(e) => handleSectionChange(index, e.target.value)}
              />
            </div>
          )}
          {section.type === "code" && (
            <div>
              <label className="block mb-2 font-bold">Code Implementation</label>
              <textarea
                className="border rounded p-2 w-full font-mono"
                value={section.value}
                onChange={(e) => handleSectionChange(index, e.target.value)}
                placeholder="Enter code here..."
              />
            </div>
          )}
          <button className="bg-red-500 text-white px-4 py-2 rounded mt-2" onClick={() => handleRemoveSection(index)}>
            <DeleteOutlineIcon />
          </button>
        </div>
      ))}
      <div className="flex space-x-4 mb-4">
        <button className="secondary-bg text-white px-4 py-2 rounded" onClick={handleAddSubheading}>
          Add Subheading
        </button>
        <button className="secondary-bg text-white px-4 py-2 rounded" onClick={handleAddContent}>
          Add Content
        </button>
        <button className="secondary-bg text-white px-4 py-2 rounded" onClick={handleAddImage}>
          Add Image
        </button>
        <button className="secondary-bg text-white px-4 py-2 rounded" onClick={handleAddCode}>
          Add Code
        </button>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmitCourse}>
        Submit Course
      </button>
    </Modal>
  )

  const approveCompetitionsModal = (
    <Modal
      isOpen={approvalModalOpen}
      onRequestClose={handleCloseApprovalModal}
      className="bg-white mt-40 p-8 rounded-lg max-w-3xl mx-auto shadow-lg max-h-[70vh] overflow-y-scroll"
      contentLabel="Approve Competitions"
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Approve Competitions</h2>
      {competitions.filter((comp) => comp.status === "pending").length === 0 ? (
        <p>No competitions awaiting approval.</p>
      ) : (
        competitions
          .filter((comp) => comp.status === "pending")
          .map((comp) => (
            <div key={comp.id} className="mb-6 ">
              <h3 className="text-lg font-semibold">{comp.title}</h3>
              <p>{comp.subtitle}</p>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => approveCompetition(comp.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button onClick={() => rejectCompetition(comp.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                  Reject
                </button>
              </div>
            </div>
          ))
      )}
    </Modal>
  )

  // Mentor Applications Modal
  const renderMentorApplicationsModal = () => {
    if (!mentorApplicationsModalOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mentor Applications</h2>
            <button
              onClick={() => setMentorApplicationsModalOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="border-b">
            <div className="flex">
              <button
                className={`px-4 py-2 font-medium ${activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === "approved" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("approved")}
              >
                Approved
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === "rejected" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("rejected")}
              >
                Rejected
              </button>
            </div>
          </div>

          <div className="overflow-y-auto p-4">
            {isLoadingApplications ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No {activeTab} applications found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className={`border rounded-lg p-4 ${activeTab === "approved"
                        ? "border-green-200 bg-green-50"
                        : activeTab === "rejected"
                          ? "border-red-200 bg-red-50"
                          : "border-gray-200"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{application.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 gap-1">
                          <User className="h-4 w-4" />
                          <span>{application.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>Applied on {formatDate(application.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openApplicationDetailsModal(application)}
                          className="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm"
                        >
                          <ExternalLink className="h-4 w-4 inline mr-1" />
                          View Details
                        </button>
                        {activeTab === "pending" && (
                          <>
                            <button
                              onClick={() => handleRejectApplication(application.id)}
                              className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-sm"
                            >
                              <XCircle className="h-4 w-4 inline mr-1" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleApproveApplication(application.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                            >
                              <LucideCheckCircle className="h-4 w-4 inline mr-1" />
                              Approve
                            </button>
                          </>
                        )}

                        {(activeTab === "approved" || activeTab === "rejected") && (
                          <button
                            onClick={() => handleDeleteApplication(application.id)}
                            className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-sm"
                          >
                            <XCircle className="h-4 w-4 inline mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(application.expertise) ? (
                          application.expertise.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {typeof application.expertise === "string" ? application.expertise : "No expertise listed"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Application Details Modal
  const renderApplicationDetailsModal = () => {
    if (!detailsModalOpen || !selectedApplication) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Application Details</h2>
            <button
              onClick={() => setDetailsModalOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedApplication.profileImageURL || "/placeholder.svg"}
                    alt={`${selectedApplication.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xl">{selectedApplication.name}</h3>
                    <p className="text-gray-500">{selectedApplication.email}</p>
                    <p className="text-gray-500">{selectedApplication.phone}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Availability</h4>
                    <p className="capitalize">{selectedApplication.availability}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Resume</h4>
                    <a
                      href={selectedApplication.resumeURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Resume
                    </a>
                  </div>

                  <div>
                    <h4 className="font-semibold">Application Date</h4>
                    <p>{formatDate(selectedApplication.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 space-y-6">
                <div>
                  <h4 className="font-semibold text-lg">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(selectedApplication.expertise) ? (
                      selectedApplication.expertise.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {typeof selectedApplication.expertise === "string"
                          ? selectedApplication.expertise
                          : "No expertise listed"}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">Professional Experience</h4>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-line">{selectedApplication.experience}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">Bio</h4>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-line">{selectedApplication.bio}</p>
                  </div>
                </div>

                {activeTab === "pending" && (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleRejectApplication(selectedApplication.id)
                        setDetailsModalOpen(false)
                      }}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <XCircle className="h-5 w-5 inline mr-1" />
                      Reject Application
                    </button>
                    <button
                      onClick={() => {
                        handleApproveApplication(selectedApplication.id)
                        setDetailsModalOpen(false)
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      <LucideCheckCircle className="h-5 w-5 inline mr-1" />
                      Approve Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 md:p-6 space-y-6">
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          <div className="flex items-center space-x-6">
            <span className="text-gray-500">Eng (US)</span>
            <AccountCircle fontSize="large" />
            <span>Admin</span>
          </div>
        </div>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* User Management Card */}
          <div
            onClick={() => handleCardClick({ type: "user", data: users })}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
          >
            <div className="bg-blue-100 text-blue-500 rounded-full h-14 w-14 flex items-center justify-center">
              <GroupIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">User Management</h2>
              <p className="text-sm text-gray-500">Manage users, roles, and access</p>
            </div>
          </div>

          {/* Competition Management Card */}
          <div
            onClick={() => handleCardClick({ type: "competition", data: competitions })}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
          >
            <div className="bg-purple-100 text-purple-500 rounded-full h-14 w-14 flex items-center justify-center">
              <SportsEsportsIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Competition Management</h2>
              <p className="text-sm text-gray-500">Approve or reject competitions, view details</p>
            </div>
          </div>

          {/* Course Management Card */}
          <div
            onClick={() => handleCardClick({ type: "course", data: courses })}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
          >
            <div className="bg-green-100 text-green-500 rounded-full h-14 w-14 flex items-center justify-center">
              <SchoolIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Course Management</h2>
              <p className="text-sm text-gray-500">View, edit, or delete course entries</p>
            </div>
          </div>

          {/* Add New Course Card */}
          <div
            onClick={() => setModalIsOpen(true)}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
          >
            <div className="bg-yellow-100 text-yellow-500 rounded-full h-14 w-14 flex items-center justify-center">
              <AddCircleOutlineIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Add New Course</h2>
              <p className="text-sm text-gray-500">Create new course entries</p>
            </div>
          </div>

          {/* Approve Competitions Card */}
          <div
            onClick={handleOpenApprovalModal}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
          >
            <div className="bg-red-100 text-red-500 rounded-full h-14 w-14 flex items-center justify-center">
              <CheckCircleIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Approve Competitions</h2>
              <p className="text-sm text-gray-500">Approve or reject new competitions</p>
            </div>
          </div>

          {/* Manage Your Profile Card */}
          <div
            onClick={() => navigate("/edit-profile")}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
          >
            <div className="bg-teal-100 text-teal-500 rounded-full h-14 w-14 flex items-center justify-center">
              <PersonIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Manage Your Profile</h2>
              <p className="text-sm text-gray-500">View and edit your profile</p>
            </div>
          </div>

          {/* Mentor Applications Card */}
          <div
            onClick={() => setMentorApplicationsModalOpen(true)}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer relative"
          >
            <div className="bg-blue-100 text-blue-500 rounded-full h-14 w-14 flex items-center justify-center">
              <PersonIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Mentor Applications</h2>
              <p className="text-sm text-gray-500">Review and approve mentor applications</p>
            </div>
            {pendingMentorApplications > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {pendingMentorApplications}
              </div>
            )}
          </div>

          <div
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
          >
            <div className="bg-red-100 text-red-500 rounded-full h-14 w-14 flex items-center justify-center">
              <CheckCircleIcon fontSize="medium" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Upload Video Course</h2>
              <p className="text-sm text-gray-500">Upload new video course</p>
            </div>
          </div>
          {!isLive ? (
            <div
              onClick={startLiveStream}
              className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
            >
              <div className="bg-red-100 text-red-500 rounded-full h-14 w-14 flex items-center justify-center">
                <CheckCircleIcon fontSize="medium" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-700">Start Live Class</h2>
                <p className="text-sm text-gray-500">Start Live Streaming</p>
              </div>
            </div>
          ) : (
            <div
              onClick={stopLiveStream}
              className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
            >
              <div className="text-red-100 bg-red-500 rounded-full h-14 w-14 flex items-center justify-center">
                <CheckCircleIcon fontSize="medium" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-700">Stop Live Class</h2>
                <p className="text-sm text-gray-500">Stop Live Streaming</p>
              </div>
            </div>
          )}

          <div className="text-black px-4 py-2 rounded">
            {/* Icon */}
            <div
              className="bg-red-100 text-red-500 rounded-full h-14 w-14 flex items-center justify-center"
              onClick={() => {
                if (!selectedCourseId) {
                  alert("Select a course first!")
                  return
                }
                setIsAssignmentModalOpen(true)
              }}
            >
              <CheckCircleIcon fontSize="medium" />
            </div>

            {/* Course Selection */}
            <div className="mb-4">
              <label className="block font-bold mb-2">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="border rounded p-2 w-full"
              >
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Modal (Placed outside for better structure) */}
            <CreateAssignmentModal
              isOpen={isAssignmentModalOpen}
              onClose={() => setIsAssignmentModalOpen(false)}
              courseId={selectedCourseId}
            />

            {/* Assignment Overview */}
            {selectedAssignmentId && <AssignmentSubmissionsOverview assignmentId={selectedAssignmentId} />}
          </div>
        </section>

        {addCourseModal}
        {approveCompetitionsModal}
        {/* Render Mentor Applications Modal */}
        {renderMentorApplicationsModal()}
        {/* Render Application Details Modal */}
        {renderApplicationDetailsModal()}

        <div className="p-8">
          {!isLive ? (
            ""
          ) : (
            <button onClick={stopLiveStream} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Stop Live Stream
            </button>
          )}

          {/* Jitsi container for admin live stream */}
          {isLive && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Hosting Live Class</h3>
              <div id="admin-jitsi-container" className="w-full h-[600px] bg-black rounded-lg"></div>
            </div>
          )}

          {/* Upload Course Modal */}
          {isUploadModalOpen && (
            <UploadCourseVideoModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-between items-stretch w-full">
          {/* Line Chart Section */}
          <div className="p-4  shadow-md rounded-lg bg-[#D9F1FF] h-[400px] md:h-[400px] w-full">
            <h3 className="font-semibold mb-4 text-lg">Dashboard Insights</h3>
            <div className="relative h-[300px]">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
          {/* Pie Chart Section */}
          <div className="p-4 bg-white shadow-md rounded-lg  h-[400px] md:h-[400px] w-full flex md:justify-between justify-center items-center">
            <PieChart
              series={[
                {
                  data: [
                    { id: "Users", value: users.length, color: "#ef4444", label: `Users = ${users.length}` },
                    {
                      id: "Competitions",
                      value: competitions.length,
                      color: "#10b981",
                      label: `Competitions = ${competitions.length}`,
                    },
                    { id: "Courses", value: courses.length, color: "#3b82f6", label: `Courses = ${courses.length}` },
                    {
                      id: "Discussions",
                      value: discussions.length,
                      color: "#f59e0b",
                      label: `Discussions = ${discussions.length}`,
                    },
                  ],
                },
              ]}
              width={350}
              height={350}
            />
          </div>
        </div>
      </div>
      {modalOpen && (
        <ModalMain
          onClose={closeModal}
          item={selectedItem}
          handleDeleteUser={handleDeleteUser}
          handleMoveToPending={handleMoveToPending}
          handleDeleteComp={handleDeleteComp}
          handleDeleteCourse={handleDeleteCourse}
          handleBlockUser={handleBlockUser}
          handleEditCourse={handleEditCourse}
        />
      )}
    </div>
  )
}

export default AdminDashboard
