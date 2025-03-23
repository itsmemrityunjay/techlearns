import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import { db, storage } from '../../database/Firebase';

const CreateAssignmentModal = ({ isOpen, onClose, courseId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); // ✅ Add state for selected users

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return alert('Please select a file.');
    setAssignmentFile(file);
  };

  const handleCreateAssignment = async () => {
    if (!title || !description || !dueDate || !assignmentFile) {
      alert('All fields and a file are required.');
      return;
    }

    if (!courseId) {
      alert('❌ Course ID is missing. Cannot create assignment!');
      console.log('DEBUG: courseId ->', courseId);
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `assignments_files/${Date.now()}_${assignmentFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, assignmentFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
        },
        (error) => {
          console.error('File upload failed:', error);
          alert('Failed to upload the assignment file.');
          setUploading(false);
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

          const newAssignment = {
            title,
            description,
            dueDate: new Date(dueDate),
            courseId,
            fileURL,
            assignedUsers: selectedUsers.length > 0 ? selectedUsers : [], // ✅ Ensure array exists
            createdAt: new Date(),
          };
          

          console.log('✅ Assignment data being saved:', newAssignment);

          await addDoc(collection(db, 'assignments'), newAssignment);

          alert('✅ Assignment created successfully!');
          // Reset state after success
          setTitle('');
          setDescription('');
          setDueDate('');
          setAssignmentFile(null);
          setUploading(false);
          onClose(); // Close modal
        }
      );
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment.');
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white mt-40 p-8 rounded-lg max-w-2xl mx-auto shadow-lg max-h-[70vh] overflow-y-scroll"
      contentLabel="Create Assignment"
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Create Assignment</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter assignment title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded"
          placeholder="Enter assignment description"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Upload Assignment File</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCreateAssignment}
          disabled={uploading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Uploading...' : 'Create Assignment'}
        </button>
      </div>
    </Modal>
  );
};

export default CreateAssignmentModal;
