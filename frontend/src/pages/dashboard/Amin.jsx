import React, { useEffect, useState } from 'react';
import { Dashboard, Leaderboard, ShoppingCart, Settings, AccountCircle, Assignment } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { PieChart } from '@mui/x-charts/PieChart';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'chart.js/auto';
import GroupIcon from '@mui/icons-material/Group';
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../database/Firebase';
import ModalMain from './Modal';
import { useAuth } from '../../database/AuthContext';
// import GroupIcon from '@mui/icons-material/Group';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SchoolIcon from '@mui/icons-material/School';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import { doc, setDoc } from "firebase/firestore";
import UploadCourseVideoModal from './UploadCourseVideo';
import CreateAssignmentModal from './CreateAssignmentModal';
import AssignmentSubmissionsOverview from './AssignmentSubmissionsOverview';
import { useParams } from 'react-router-dom';


function AdminDashboard() {

    const { courseId } = useParams(); // Get the course ID from route
    
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
    const [users, setUsers] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sections, setSections] = useState([]);
    const [iconFile, setIconFile] = useState(null);
    const [iconURL, setIconURL] = useState('');



    const [approvalModalOpen, setApprovalModalOpen] = useState(false);
    // const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        age: '',
        course: '',
        address: '',
        profileImageFile: null,
        profileImageURL: '',
    });

    useEffect(() => {
        const fetchCompetitions = async () => {
            const querySnapshot = await getDocs(collection(db, 'competitions'));
            const competitionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCompetitions(competitionsData);
        };

        fetchCompetitions();
    }, []);

    // Function to handle profile image upload
    const handleProfileImageUpload = async () => {
        if (!profileData.profileImageFile) {
            alert("Please select an image.");
            return;
        }
        const storageRef = ref(storage, `profile-images/${profileData.profileImageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, profileData.profileImageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => { },
            (error) => {
                console.error('Error uploading profile image:', error);
                alert('Failed to upload profile image.');
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setProfileData(prev => ({ ...prev, profileImageURL: downloadURL }));
                alert('Profile image successfully uploaded!');
            }
        );
    };

    const handleProfileDataChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const currentUser = useAuth().currentUser;

    const handleSaveProfile = async () => {
        if (!profileData.profileImageURL) {
            alert("Please upload a profile image before saving.");
            return;
        }

        if (!currentUser?.uid) {
            alert("User is not logged in.");
            return;
        }

        // Save or update the user profile data in Firebase
        try {
            const userDocRef = doc(db, "users", currentUser.uid); // Use uid to identify the user document
            await updateDoc(userDocRef, profileData);
            alert("Profile successfully updated!");
            // setEditProfileModalOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };



    useEffect(() => {
        const fetchCompetitions = async () => {
            const querySnapshot = await getDocs(collection(db, 'competitions'));
            const competitionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCompetitions(competitionsData);
        };

        fetchCompetitions();
    }, []);

    const approveCompetition = async (id) => {
        const competitionRef = doc(db, 'competitions', id);
        await updateDoc(competitionRef, { status: 'approved' });
        setCompetitions(prev => prev.map(comp => comp.id === id ? { ...comp, status: 'approved' } : comp));
        alert('Competition approved');
    };

    const rejectCompetition = async (id) => {
        const competitionRef = doc(db, 'competitions', id);
        await deleteDoc(competitionRef);
        setCompetitions(prev => prev.filter(comp => comp.id !== id));
        alert('Competition rejected');
    };

    const handleOpenApprovalModal = () => {
        setApprovalModalOpen(true);
    };

    const handleCloseApprovalModal = () => {
        setApprovalModalOpen(false);
    };

    const handleAddSubheading = () => {
        setSections([...sections, { type: 'subHeading', value: '' }]);
    };

    const handleAddContent = () => {
        setSections([...sections, { type: 'content', value: '' }]);
    };

    const handleAddImage = () => {
        setSections([...sections, { type: 'image', value: '' }]);
    };

    const handleAddCode = () => {
        setSections([...sections, { type: 'code', value: '' }]);
    };

    const handleSectionChange = (index, value) => {
        const updatedSections = [...sections];
        updatedSections[index].value = value;
        setSections(updatedSections);
    };

    const handleRemoveSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const handleIconUpload = async (file) => {
        const storageRef = ref(storage, `course-icons/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => { },
            (error) => {
                console.error('Error uploading icon: ', error);
                alert('Failed to upload icon');
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setIconURL(downloadURL);
                alert('Icon successfully uploaded!');
            }
        );
    };

    const handleSubmitCourse = async () => {
        if (!iconURL) {
            alert('Please upload an icon before submitting the course.');
            return;
        }

        try {
            await addDoc(collection(db, 'courses'), {
                title: courseTitle,
                description,
                sections,
                icon: iconURL,
            });
            alert('Course successfully added!');

        } catch (error) {
            console.error('Error adding course: ', error);
            alert('Failed to add course');
        }

        setModalIsOpen(false);
    };

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCompetitions = async () => {
        const querySnapshot = await getDocs(collection(db, "competitions"));
        setCompetitions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCourses = async () => {
        const querySnapshot = await getDocs(collection(db, "courses"));
        setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchDiscussions = async () => {
        const querySnapshot = await getDocs(collection(db, "topics"));
        setDiscussions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    // Real-time listener for users collection
    useEffect(() => {
        const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
            updateChartData(usersData, competitions, courses, discussions);
        });

        return () => unsubscribeUsers();
    }, [competitions, courses, discussions]);

    // Real-time listener for competitions collection
    useEffect(() => {
        const unsubscribeCompetitions = onSnapshot(collection(db, 'competitions'), (snapshot) => {
            const competitionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCompetitions(competitionsData);
            updateChartData(users, competitionsData, courses, discussions);
        });

        return () => unsubscribeCompetitions();
    }, [users, courses, discussions]);

    // Real-time listener for courses collection
    useEffect(() => {
        const unsubscribeCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
            const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(coursesData);
            updateChartData(users, competitions, coursesData, discussions);
        });

        return () => unsubscribeCourses();
    }, [users, competitions, discussions]);

    // Real-time listener for discussions collection
    useEffect(() => {
        const unsubscribeDiscussions = onSnapshot(collection(db, 'topics'), (snapshot) => {
            const discussionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDiscussions(discussionsData);
            updateChartData(users, competitions, courses, discussionsData);
        });

        return () => unsubscribeDiscussions();
    }, [users, competitions, courses]);

    // Function to update chart data
    const updateChartData = (usersData, competitionsData, coursesData, discussionsData) => {
        setChartData({
            labels: ['Users', 'Competitions', 'Courses', 'Discussions'],
            datasets: [
                {
                    label: 'Total Counts',
                    data: [
                        usersData.length,
                        competitionsData.length,
                        coursesData.length,
                        discussionsData.length,
                    ],
                    backgroundColor: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'],
                },
            ],
        });
    };

    const navigate = useNavigate();
    const handleCardClick = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const handleDeleteUser = async (userId) => {
        await deleteDoc(doc(db, "users", userId));
        fetchUsers();
        updateChartData();
    };

    const handleBlockUser = async (userId) => {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: "blocked" });
        fetchUsers();
    };

    const handleDeleteComp = async (compId) => {
        await deleteDoc(doc(db, "competitions", compId));
        fetchCompetitions();
        updateChartData();
    };

    const handleDeleteCourse = async (courseId) => {
        await deleteDoc(doc(db, "courses", courseId));
        fetchCourses();
        updateChartData();
    };

    const handleEditCourse = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const handleMoveToPending = async (compId) => {
        const compRef = doc(db, "competitions", compId);
        await updateDoc(compRef, { status: "pending" });
        fetchCompetitions();
    }


    const [isLive, setIsLive] = useState(false);
    // const { currentUser } = useAuth();
  
    const startLiveStream = async () => {
        const roomName = "AdminLiveStreamRoom";
        try {
          await setDoc(doc(db, "livestream", "current"), {
            isLive: true,
            roomName,
            startedAt: new Date(),
          });
          setIsLive(true);
          alert("Live stream started!");
        } catch (error) {
          console.error("Error starting livestream:", error);
        }
      };
    
      const stopLiveStream = async () => {
        try {
          await setDoc(doc(db, "livestream", "current"), {
            isLive: false,
            roomName: "",
          });
          setIsLive(false);
          alert("Live stream stopped!");
        } catch (error) {
          console.error("Error stopping livestream:", error);
        }
      };
    
      useEffect(() => {
        if (isLive) {
          const domain = "meet.jit.si";
          const options = {
            roomName: "AdminLiveStreamRoom",
            width: "100%",
            height: 600,
            parentNode: document.getElementById("admin-jitsi-container"),
            userInfo: {
              displayName: currentUser?.email || "Admin",
            },
          };
          const api = new window.JitsiMeetExternalAPI(domain, options);
    
          return () => api.dispose();
        }
      }, [isLive]);






    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "notifications"));
          const notificationsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setNotifications(notificationsData);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
  
      fetchNotifications();
    }, []);
  
    const markAsRead = async (notificationId) => {
      try {
        await updateDoc(doc(db, "notifications", notificationId), { read: true });
        setNotifications((prev) =>
          prev.map((note) =>
            note.id === notificationId ? { ...note, read: true } : note
          )
        );
      } catch (error) {
        console.error("Error marking notification as read", error);
      }
    };
  



    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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
                <button
                    className="secondary-bg text-white px-4 py-2 rounded mt-2"
                    onClick={() => handleIconUpload(iconFile)}
                >
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
                    {section.type === 'subHeading' && (
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
                    {section.type === 'content' && (
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
                    {section.type === 'image' && (
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
                    {section.type === 'code' && (
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
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                        onClick={() => handleRemoveSection(index)}
                    >
                        <DeleteOutlineIcon />
                    </button>
                </div>
            ))}
            <div className="flex space-x-4 mb-4">
                <button
                    className="secondary-bg text-white px-4 py-2 rounded"
                    onClick={handleAddSubheading}
                >
                    Add Subheading
                </button>
                <button
                    className="secondary-bg text-white px-4 py-2 rounded"
                    onClick={handleAddContent}
                >
                    Add Content
                </button>
                <button
                    className="secondary-bg text-white px-4 py-2 rounded"
                    onClick={handleAddImage}
                >
                    Add Image
                </button>
                <button
                    className="secondary-bg text-white px-4 py-2 rounded"
                    onClick={handleAddCode}
                >
                    Add Code
                </button>
            </div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitCourse}
            >
                Submit Course
            </button>
        </Modal>
    );

    const approveCompetitionsModal = (
        <Modal
            isOpen={approvalModalOpen}
            onRequestClose={handleCloseApprovalModal}
            className="bg-white mt-40 p-8 rounded-lg max-w-3xl mx-auto shadow-lg max-h-[70vh] overflow-y-scroll"
            contentLabel="Approve Competitions"
        >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Approve Competitions</h2>
            {competitions.filter(comp => comp.status === 'pending').length === 0 ? (
                <p>No competitions awaiting approval.</p>
            ) : (
                competitions
                    .filter(comp => comp.status === 'pending')
                    .map(comp => (
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
                                <button
                                    onClick={() => rejectCompetition(comp.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
            )}
        </Modal>
    );




    


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
                    </div>):(
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
                    </div>)}
                </section>

                {addCourseModal}
                {approveCompetitionsModal}

                <div className="p-8">



                {!isLive ? (
        ""
      ) : (
        <button
          onClick={stopLiveStream}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
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
    
      {/* Upload Course Button */}
      {/* <button
        onClick={() => setIsUploadModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload New Course
      </button> */}

      {/* Upload Course Modal */}
      {isUploadModalOpen && (
        <UploadCourseVideoModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}


<div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Dashboard</h1>



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

      <button
  onClick={() => {
    if (!selectedCourseId) {
      alert('Select a course first!');
      return;
    }
    setIsAssignmentModalOpen(true);
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Create Assignment
</button>

<CreateAssignmentModal
  isOpen={isAssignmentModalOpen}
  onClose={() => setIsAssignmentModalOpen(false)}
  courseId={selectedCourseId} // ✅ Send the correct courseId here
/>


      {/* Show submission overview if an assignment has been selected */}
      {selectedAssignmentId && (
        <AssignmentSubmissionsOverview assignmentId={selectedAssignmentId} />
      )}
    </div>


    </div>


 


    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-12">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Admin Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((note) => (
          <div
            key={note.id}
            className={`border rounded p-4 mb-4 ${
              note.read ? "bg-gray-100" : "bg-blue-50"
            }`}
          >
            <h3 className="font-semibold">{note.title}</h3>
            <p className="text-sm text-gray-700">{note.message}</p>
            <p className="text-xs text-gray-400">{new Date(note.createdAt?.seconds * 1000).toLocaleString()}</p>

            {!note.read && (
              <button
                onClick={() => markAsRead(note.id)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>


                {/* <TeamProgressCard/> */}
                {/* <MyDailyActivitiesChart/> */}
                {/* Chart Component */}
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
                                        { id: "Competitions", value: competitions.length, color: "#10b981", label: `Competitions = ${competitions.length}` },
                                        { id: "Courses", value: courses.length, color: "#3b82f6", label: `Courses = ${courses.length}` },
                                        { id: "Discussions", value: discussions.length, color: "#f59e0b", label: `Discussions = ${discussions.length}` },
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
    );
}

export default AdminDashboard;
