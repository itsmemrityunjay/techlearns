// MentorsAssign.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../database/Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../database/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MentorsAssign = () => {
    const navigate = useNavigate();
  
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    expertise: '',
    experience: '',
    linkedIn: '',
    github: '',
    about: '',
    topics: '',
    profilePic: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5242880) { // 5MB limit
      setFormData(prev => ({ ...prev, profilePic: file }));
    } else {
      toast.error('Profile picture must be less than 5MB');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let profilePicUrl = '';
      
      if (formData.profilePic) {
        const storageRef = ref(storage, `mentor-profiles/${Date.now()}_${formData.profilePic.name}`);
        const uploadTask = uploadBytesResumable(storageRef, formData.profilePic);
        
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            reject,
            async () => {
              profilePicUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      await addDoc(collection(db, 'mentor-applications'), {
        ...formData,
        profilePic: profilePicUrl,
        userId: currentUser.uid,
        status: 'pending',
        submittedAt: new Date()
      });

      toast.success('Application submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        expertise: '',
        experience: '',
        linkedIn: '',
        github: '',
        about: '',
        topics: '',
        profilePic: null
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Become a Mentor
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Share your knowledge and experience with our community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg p-8">
          <div className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area of Expertise
              </label>
              <input
                type="text"
                value={formData.expertise}
                onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                required
                placeholder="e.g., Full Stack Development, Machine Learning"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                required
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                About Yourself
              </label>
              <textarea
                value={formData.about}
                onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Topics You Can Teach (comma separated)
              </label>
              <input
                type="text"
                value={formData.topics}
                onChange={(e) => setFormData(prev => ({ ...prev, topics: e.target.value }))}
                required
                placeholder="e.g., React, Node.js, Data Structures"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MentorsAssign;