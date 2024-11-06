import React, { useState, useEffect } from 'react';
import { db, storage } from '../../database/Firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import { Search, Notifications, AccountCircle } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

// Set modal app element
Modal.setAppElement('#root');

const Dashboard = () => {
    const [competitions, setCompetitions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sections, setSections] = useState([]);
    const [iconFile, setIconFile] = useState(null);
    const [iconURL, setIconURL] = useState('');

    useEffect(() => {
        const fetchCompetitions = async () => {
            const querySnapshot = await getDocs(collection(db, 'competitions'));
            const competitionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCompetitions(competitionsData);
        };

        fetchCompetitions();
    }, []);

    const fetchUsers = async () => {
        // const auth = getAuth();
        const userList = await getDocs(collection(db, 'users'));
        const usersData = userList.docs.map(doc => ({ id: doc.id, role: doc.role, ...doc.data() }));// Fetch all users
        setUsers(usersData);
    };

    const openUserManagementModal = () => {
        fetchUsers();
        setModalIsOpen(true);
    };

    const addSubAdmin = async (uid) => {
        // Logic to add sub-admin (this could involve updating a field in your database)
        await updateDoc(doc(db, 'users', uid), { role: 'sub-admin' }); // Assuming you have user roles in Firestore
        toast.success('User granted sub-admin access');
        setModalIsOpen(false);
    };

    const approveCompetition = async (id) => {
        await updateDoc(doc(db, 'competitions', id), { status: 'approved' });
        toast.success('Competition approved');
    };

    const rejectCompetition = async (id) => {
        await deleteDoc(doc(db, 'competitions', id));
        toast.error('Competition rejected');
    };

    const userManagementModal = (
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="bg-white rounded-lg shadow-2xl p-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">User Management</h2>
            <ul>
                {users.map(user => (
                    <li key={user.uid} className="flex justify-between items-center mb-2">
                        <span>{user.email}</span>
                        <span>{user.role}</span>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => addSubAdmin(user.id)}>Add Sub-Admin</button>
                    </li>
                ))}
            </ul>
        </Modal>
    );

    return (
        <div className="container mx-auto px-6">
            <header className="flex justify-between items-center py-4">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <div className="flex space-x-4">
                    <div className="relative">
                        <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-gray-100 outline-none" />
                        <Search className="absolute left-2 top-2 text-gray-500" />
                    </div>
                    <IconButton><Notifications className="text-gray-700" /></IconButton>
                    <IconButton><AccountCircle className="text-gray-700" /></IconButton>
                </div>
            </header>

            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg p-6 text-white cursor-pointer" onClick={openUserManagementModal}>
                    <h2 className="text-xl font-semibold mb-2">User Management</h2>
                    <p>Manage users, promote to sub-admin, block/unblock accounts</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
                    <h2 className="text-xl font-semibold mb-2">Competition Management</h2>
                    <p>Approve or reject competitions, view details</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                    <h2 className="text-xl font-semibold mb-2">Course Management</h2>
                    <p>View, edit, or delete course entries</p>
                </div>
            </section>

            {userManagementModal}

            <section className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {competitions.map((comp) => (
                    <div key={comp.id} className="bg-white p-4 rounded shadow-lg flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold">{comp.title}</h3>
                            <p>Status: {comp.status}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => approveCompetition(comp.id)}>Approve</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => rejectCompetition(comp.id)}>Reject</button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Dashboard;
