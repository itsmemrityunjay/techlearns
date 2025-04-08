// UploadCourseVideoModal.jsx
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../database/Firebase';
import { toast } from 'react-toastify';
import { CloudUpload, Close, CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const UploadCourseVideoModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('video/')) {
      setVideo(file);
    } else {
      toast.error('Please select a valid video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('image/')) {
      setThumbnail(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !video || !thumbnail) {
      toast.error('All fields are required');
      return;
    }

    try {
      setUploading(true);

      // Upload thumbnail
      const thumbnailRef = ref(storage, `thumbnails/${Date.now()}_${thumbnail.name}`);
      await uploadBytesResumable(thumbnailRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(thumbnailRef);

      // Upload video
      const videoRef = ref(storage, `videos/${Date.now()}_${video.name}`);
      const uploadTask = uploadBytesResumable(videoRef, video);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          throw error;
        }
      );

      const videoUrl = await getDownloadURL(videoRef);

      // Save to Firestore
      await addDoc(collection(db, 'courses'), {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        createdAt: new Date(),
        status: 'active'
      });

      toast.success('Course video uploaded successfully!');
      onClose();
    } catch (error) {
      console.error('Error uploading course:', error);
      toast.error('Failed to upload course');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Upload Course Video</h2>
              <button
                onClick={onClose}
                disabled={uploading}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Close />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  disabled={uploading}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Video
                  </label>
                  <input
                    type="file"
                    onChange={handleVideoChange}
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
                  >
                    {video ? (
                      <div className="text-center">
                        <CheckCircle className="text-green-500 text-3xl mb-2" />
                        <p className="text-sm text-gray-600">{video.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CloudUpload className="text-gray-400 text-3xl mb-2" />
                        <p className="text-sm text-gray-500">Click to upload video</p>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail
                  </label>
                  <input
                    type="file"
                    onChange={handleThumbnailChange}
                    accept="image/*"
                    className="hidden"
                    id="thumbnail-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
                  >
                    {thumbnail ? (
                      <div className="text-center">
                        <CheckCircle className="text-green-500 text-3xl mb-2" />
                        <p className="text-sm text-gray-600">{thumbnail.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CloudUpload className="text-gray-400 text-3xl mb-2" />
                        <p className="text-sm text-gray-500">Click to upload thumbnail</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !title || !description || !video || !thumbnail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Course'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadCourseVideoModal;