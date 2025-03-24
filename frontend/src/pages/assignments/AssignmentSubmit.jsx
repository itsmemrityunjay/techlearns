import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../database/Firebase';
import { useAuth } from '../../database/AuthContext';
import Modal from 'react-modal';

const AssignmentSubmit = ({ assignment, onClose }) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [comments, setComments] = useState('');

  if (!assignment || !assignment.id) {
    return (
    //   <Modal isOpen={true} onRequestClose={onClose} className="bg-white mt-40 p-8 rounded-lg max-w-2xl mx-auto shadow-lg">
        <div className="text-center p-6">
          <p className="text-red-600">Error: Assignment not found.</p>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
    //   </Modal>
    );
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return alert('Please select a file.');
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file!');
      return;
    }

    if (!currentUser || !currentUser.uid) {
      alert('User is not logged in!');
      return;
    }

    setUploading(true);

    try {
      const path = `assignments/${assignment.id}/${currentUser.uid}/${file.name}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
        },
        (error) => {
          console.error('Upload failed:', error);
          setUploading(false);
        },
        async () => {
          const fileURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, 'assignments', assignment.id, 'submissions'), {
            studentId: currentUser.uid,
            studentEmail: currentUser.email,
            fileURL,
            comments,
            submittedAt: new Date(),
          });

          alert('✅ Assignment submitted successfully!');
          setUploading(false);
          onClose();
        }
      );
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="bg-white mt-40 p-8 rounded-lg max-w-2xl mx-auto shadow-lg"
      contentLabel="Submit Assignment"
    >
      <h2 className="text-2xl font-bold text-green-600 mb-6">Submit Assignment</h2>

      <p className="mb-2">
        <strong>Assignment:</strong> {assignment.title || 'Untitled'}
      </p>
      <p className="mb-4">
        <strong>Due:</strong>{' '}
        {assignment.dueDate && assignment.dueDate.toDate
          ? assignment.dueDate.toDate().toLocaleDateString()
          : 'No Due Date'}
      </p>

      <div className="mb-4">
        <label className="block mb-2 font-bold">Upload File</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-bold">Comments (optional)</label>
        <textarea
          className="w-full p-3 border rounded"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add any comments..."
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Submitting...' : 'Submit Assignment'}
        </button>
      </div>
    </Modal>
  );
};

export default AssignmentSubmit;
