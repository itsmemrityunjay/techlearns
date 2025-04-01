import React, { useState, useEffect } from "react";
import { db } from "../../database/Firebase"; // Firebase config
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaCertificate, FaRegClock, FaUserAlt } from "react-icons/fa";
import { MdOutlineArrowForward } from "react-icons/md";

import React, { useState, useEffect } from "react";
import { db } from "../../database/Firebase"; // Firebase config
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaCertificate, FaRegClock, FaUserAlt } from "react-icons/fa";
import { MdOutlineArrowForward } from "react-icons/md";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const navigate = useNavigate();

  // Redirect to the course detail page when the card is clicked
  const handleCardClick = () => {
    navigate(`/courses/${course.icon}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer rounded-lg shadow-lg transition-transform hover:scale-105 duration-200 bg-white group"
    >
      {/* Image Section */}
      <div
        className="h-48 bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage:` url(${course.icon})` }}
      >
        <div className="h-full w-full hover:border-black rounded-t-lg transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 truncate">{course.title}</h3>
          <img
            src={course.icon}
            alt={course.title}
            className="w-12 h-12 rounded-full border"
          />
        </div>
        <p className="text-gray-500 flex items-center mb-3">
          <FaRegClock className="mr-2 text-blue-500" />
          {course.duration || "Self-paced"}
        </p>
        <p className="text-gray-700 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center">
            <FaUserAlt className="mr-2" />
            {course.instructor || "Instructor Name"}
          </span>
          <button className="flex items-center px-4 py-2 bg-[--secondary-color] text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group hover:bg-[--primary-color]">
  <span className="group-hover:underline">Learn More</span>
  <MdOutlineArrowForward className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
</button>

        </div>
      </div>
    </div>
  );
};

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const fetchedCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Get the latest courses (limit can be adjusted)
        const latestCourses = fetchedCourses.slice(-4);
        setCourses(latestCourses);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="text mb-12">
        <h1 className="text-4xl font-bold text-gray-800 uppercase">Our Courses</h1>
        <p className="text-lg text-gray-600 mt-4">
          Learn new skills with expert-taught courses and gain a certificate to boost your career.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseList;