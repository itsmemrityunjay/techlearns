import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import { db, storage } from '../../database/Firebase';
import { toast } from 'react-toastify';

const CreateAssignmentModal = ({ isOpen, onClose, courseId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [courseUsers, setCourseUsers] = useState([]);

  // Fetch course users
  useEffect(() => {
    const fetchCourseUsers = async () => {
      if (!courseId) return;
      try {
        const usersQuery = query(
          collection(db, 'enrollments'),
          where('courseId', '==', courseId)
        );
        const querySnapshot = await getDocs(usersQuery);
        const users = querySnapshot.docs.map(doc => doc.data().userId);
        setCourseUsers(users);
      } catch (error) {
        console.error('Error fetching course users:', error);
      }
    };
    fetchCourseUsers();
  }, [courseId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error('Please select a file.');
    setAssignmentFile(file);
  };

  const handleCreateAssignment = async () => {
    if (!title || !description || !dueDate || !assignmentFile) {
      toast.error('All fields and a file are required.');
      return;
    }

    if (!courseId) {
      toast.error('Course ID is missing. Cannot create assignment!');
      return;
    }

    try {
      setUploading(true);

      // 1. Upload file to Storage
      const fileRef = ref(storage, `assignments/${courseId}/${Date.now()}_${assignmentFile.name}`);
      const uploadTask = uploadBytesResumable(fileRef, assignmentFile);
      
      const fileUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      // 2. Create assignment document
      const assignmentRef = await addDoc(collection(db, 'assignments'), {
        title,
        description,
        dueDate,
        courseId,
        fileUrl,
        createdAt: new Date(),
        assignedUsers: selectedUsers.length ? selectedUsers : courseUsers,
        status: 'active'
      });

      // 3. Create user assignments
      const assignedUsers = selectedUsers.length ? selectedUsers : courseUsers;
      
      const userAssignmentPromises = assignedUsers.map(userId => 
        addDoc(collection(db, 'userAssignments'), {
          userId,
          assignmentId: assignmentRef.id,
          courseId,
          status: 'pending',
          assignedDate: new Date(),
          dueDate: new Date(dueDate)
        })
      );

      await Promise.all(userAssignmentPromises);

      // 4. Create notifications
      const notificationPromises = assignedUsers.map(userId =>
        addDoc(collection(db, 'notifications'), {
          userId,
          type: 'assignment',
          title: 'New Assignment',
          message: `You have been assigned: ${title}`,
          read: false,
          createdAt: new Date()
        })
      );

      await Promise.all(notificationPromises);

      toast.success('Assignment created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to create assignment');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg p-6 max-w-2xl mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Create Assignment</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assignment File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 w-full"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAssignment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAssignmentModal;