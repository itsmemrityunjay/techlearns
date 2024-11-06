import React, { useEffect, useState } from 'react';
import { Dashboard, Leaderboard, ShoppingCart, Settings, AccountCircle } from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'chart.js/auto';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../database/Firebase';
import ModalMain from './Modal';
import { useAuth } from '../../database/AuthContext';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIssOpen, setModalIssOpen] = useState(false);
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



    const openUserManagementModal = () => {
        fetchUsers();
        setModalIssOpen(true);
    };
    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })); // Ensure uid is set
        setUsers(usersData);
    };

    const toggleUserRole = async (user) => {
        if (!user || !user.uid) {
            console.error("User data or user ID is missing.");
            return;
        }

        const newRole = user.role === "user" ? "sub-admin" : "user";

        try {
            await updateDoc(doc(db, 'users', user.uid), { role: newRole });
            fetchUsers(); // Re-fetch the updated user list
            console.log(`${user.email} is now a ${newRole}`);
            toast.success(`${user.email} is now a ${newRole}`);
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role.");
        }
    };



    const userManagementModal = (
        <Modal
            isOpen={modalIssOpen}
            onRequestClose={() => setModalIssOpen(false)}
            className="bg-white rounded-lg shadow-2xl p-6 max-w-3xl mx-auto"
        >
            <h2 className="text-3xl font-bold mb-6 text-center">User Management</h2>
            <ul className="space-y-4">
                {users
                    .filter(user => user.role === "user" || user.role === "sub-admin")
                    .map(user => (
                        <li
                            key={user.uid}
                            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                        >
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold text-gray-700">{user.email}</span>
                                <span className="text-sm text-gray-500">{user.role === "user" ? "User" : "Sub-Admin"}</span>
                            </div>

                            <button
                                className={`px-4 py-2 rounded-md font-medium text-white transition-colors ${user.role === "user"
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-red-500 hover:bg-red-600"
                                    }`}
                                onClick={() => toggleUserRole(user)}
                            >
                                {user.role === "user" ? "Promote to Sub-Admin" : "Demote to User"}
                            </button>
                        </li>
                    ))}
            </ul>
        </Modal>
    );



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


    // Chart data state
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await Promise.all([fetchUsers(), fetchCompetitions(), fetchCourses(), fetchDiscussions()]);
        updateChartData();
    };

    // const fetchUsers = async () => {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //     setUsers(usersData);
    // };


    const fetchCompetitions = async () => {
        const querySnapshot = await getDocs(collection(db, "competitions"));
        setCompetitions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchCourses = async () => {
        const querySnapshot = await getDocs(collection(db, "courses"));
        setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchDiscussions = async () => {
        const querySnapshot = await getDocs(collection(db, "discussions"));
        setDiscussions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const addSubAdmin = async (uid) => {
        // Logic to add sub-admin (this could involve updating a field in your database)
        await updateDoc(doc(db, 'users', uid), { role: 'sub-admin' }); // Assuming you have user roles in Firestore
        toast.success('User granted sub-admin access');
        setModalIsOpen(false);
    };

    // Update chart data based on Firebase data
    const updateChartData = () => {
        setChartData({
            labels: ["Users", "Competitions", "Courses", "Discussions"],
            datasets: [
                {
                    label: "Total Counts",
                    data: [users.length, competitions.length, courses.length, discussions.length],
                    backgroundColor: ["#ef4444", "#10b981", "#3b82f6", "#f59e0b"],
                }
            ]
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
        navigate(`/courses-edit/${courseId}`);
    };

    const handleMoveToPending = async (compId) => {
        const compRef = doc(db, "competitions", compId);
        await updateDoc(compRef, { status: "pending" });
        fetchCompetitions();
    }


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
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="flex-1 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
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

                <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div onClick={() => handleCardClick({ type: "user", data: users })} className="bg-gradient-to-r py-16 from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg p-6 text-white cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">User Management</h2>
                        <p>Manage users, promote to sub-admin, block/unblock accounts</p>
                    </div>
                    <div onClick={() => handleCardClick({ type: "competition", data: competitions })} className="bg-gradient-to-r py-16 from-green-500 to-blue-500 rounded-lg shadow-lg p-6 text-white cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">Competition Management</h2>
                        <p>Approve or reject competitions, view details</p>
                    </div>
                    <div onClick={() => handleCardClick({ type: "course", data: courses })} className="bg-gradient-to-r py-16 from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">Course Management</h2>
                        <p>View, edit, or delete course entries</p>
                    </div>
                    <div onClick={() => setModalIsOpen(true)} className="bg-gradient-to-r py-16 from-lime-500 to-amber-500 rounded-lg shadow-lg p-6 text-white cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">Add New Course</h2>
                        <p>Create New course entries</p>
                    </div>
                    <div onClick={handleOpenApprovalModal} className="bg-gradient-to-r py-16 from-blue-500 to-yellow-500 rounded-lg shadow-lg p-6 text-white cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">Approve Competitions</h2>
                        <p>Approve or Reject New Competition.</p>
                    </div>
                    <div onClick={() => { navigate("/edit-profile") }} className="bg-gradient-to-r py-16 from-orange-500 to-lime-500 rounded-lg shadow-lg p-6 text-white cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">Manage Your Profile</h2>
                        <p>View and Edit your Profile.</p>
                    </div>
                    <div onClick={openUserManagementModal} className="bg-gradient-to-r py-16 from-orange-500 to-lime-500 rounded-lg shadow-lg p-6 text-white cursor-pointer">
                        <h2 className="text-xl font-semibold mb-2">Manage Sub Admin</h2>
                        <p>View and Edit Sub-Admin Profile.</p>
                    </div>

                </section>
                {addCourseModal}
                {approveCompetitionsModal}
                {userManagementModal}

                {/* Chart Component */}
                <div className="col-span-1 md:col-span-2 p-4 bg-white shadow-md rounded-lg h-60">
                    <h3 className="font-semibold mb-2">Dashboard Insights</h3>
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
