import React, { useState, useEffect } from 'react';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../database/Firebase';
import { useAuth } from '../../database/AuthContext';
import { toast } from 'react-toastify';
import {
  CloudUpload,
  Cancel,
  CheckCircle,
  Close
} from '@mui/icons-material';

const AssignmentSubmit = ({ isOpen, onClose, assignmentId }) => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !uploading) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, uploading]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !uploading) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!uploading) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFile(null);
    setComments('');
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to submit');
      return;
    }

    try {
      setUploading(true);

      const storageRef = ref(storage, `submissions/${assignmentId}/${currentUser.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const fileUrl = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      const submissionRef = await addDoc(collection(db, 'submissions'), {
        assignmentId,
        userId: currentUser.uid,
        fileUrl,
        fileName: file.name,
        comments,
        submittedAt: new Date(),
        status: 'submitted'
      });

      await updateDoc(doc(db, 'userAssignments', assignmentId), {
        status: 'submitted',
        submissionId: submissionRef.id,
        submittedAt: new Date()
      });

      toast.success('Assignment submitted successfully!');
      handleClose();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <div 
            className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Submit Assignment</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={uploading}
              >
                <Close className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-48
                    border-2 border-dashed rounded-lg cursor-pointer
                    transition-all duration-300
                    ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}
                  `}
                >
                  {file ? (
                    <div className="text-center p-4">
                      <CheckCircle className="text-green-500 text-4xl mb-2" />
                      <p className="text-sm text-gray-600 break-all">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <CloudUpload className="text-gray-400 text-4xl mb-2" />
                      <p className="text-gray-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Add any comments about your submission..."
                  disabled={uploading}
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  disabled={uploading}
                >
                  <Cancel className="w-5 h-5" />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={uploading || !file}
                  className={`
                    px-6 py-2.5 rounded-lg bg-blue-600 text-white
                    hover:bg-blue-700 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center space-x-2
                  `}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-5 h-5" />
                      <span>Submit Assignment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentSubmit;