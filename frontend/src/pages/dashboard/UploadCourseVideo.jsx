import React, { useState } from "react";
import Modal from "react-modal";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../database/Firebase";
import { useAuth } from "../../database/AuthContext";

const UploadCourseVideoModal = ({ isOpen, onClose, currentUser }) => {
    const [courseTitle, setCourseTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
  
    const handleVideoChange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        alert("Please select a video file.");
        return;
      }
  
      if (!file.type.includes("video")) {
        alert("Only video files are allowed.");
        return;
      }
  
      setVideoFile(file);
    };
  
    const handleUpload = async () => {
      if (!courseTitle.trim() || !description.trim() || !videoFile) {
        alert("All fields are required, including a valid video file.");
        return;
      }
  
      if (!currentUser || !currentUser.uid) {
        alert("You are not logged in.");
        return;
      }
  
      setUploading(true);
  
      try {
        const filePath = `course-videos/${Date.now()}_${videoFile.name}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(uploadProgress.toFixed(2));
          },
          (error) => {
            console.error("Upload error:", error);
            alert("Failed to upload video.");
            setUploading(false);
          },
          async () => {
            const videoURL = await getDownloadURL(uploadTask.snapshot.ref);
  
            await addDoc(collection(db, "courses"), {
              title: courseTitle,
              description,
              videoURL,
              createdBy: currentUser.uid,
              createdAt: new Date(),
            });
  
            alert("Course uploaded successfully!");
            setUploading(false);
            setCourseTitle("");
            setDescription("");
            setVideoFile(null);
            setProgress(0);
            onClose();
          }
        );
      } catch (error) {
        console.error("Error during upload:", error);
        alert("An unexpected error occurred.");
        setUploading(false);
      }
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white mt-40 p-8 rounded-lg max-w-3xl mx-auto shadow-lg max-h-[70vh] overflow-y-scroll"
        contentLabel="Upload Course Video"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Upload New Course Video</h2>
  
        <div className="mb-4">
          <label className="block font-medium mb-1">Course Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title"
          />
        </div>
  
        <div className="mb-4">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course description"
          ></textarea>
        </div>
  
        <div className="mb-4">
          <label className="block font-medium mb-1">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full"
          />
        </div>
  
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
  
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {uploading ? "Uploading..." : "Submit Course"}
          </button>
        </div>
      </Modal>
    );
  };
  
export default UploadCourseVideoModal;