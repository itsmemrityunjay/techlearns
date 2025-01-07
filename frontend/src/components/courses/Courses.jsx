import React, { useState, useEffect } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CgViewGrid, CgViewList } from "react-icons/cg";
import { db } from "../../database/Firebase"; // Import your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { DiAtom } from "react-icons/di";
import {
  FaChevronDown,
  FaUsers,
  FaBlog,
  FaBook,
  FaLightbulb,
  FaNetworkWired,
  FaCertificate,
  FaChartLine,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCloud } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Typewriter } from "react-simple-typewriter";
// CourseCard Component

const CourseCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-start p-4 dark:bg-gray-800 dark:text-white text-dark rounded-md mb-4 cursor-pointer hover:shadow-lg transition-shadow"
  >
    <div className="text-3xl mr-4">
      <img src={icon} alt="icon" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  </div>
);

const Courses = () => {
  const allCourse = [];

  const [firebaseCourses, setFirebaseCourses] = useState([]);
  const [view, setView] = useState("list");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const fetchedCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFirebaseCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };

    fetchCourses();
  }, []);

  const allCourses = [...firebaseCourses];
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // Smooth scrolling effect
    }
  };

  const instructors = [
    {
      name: "Dr. Angela Yu",
      title: "Developer and Lead Instructor",
      skills: "Python, Data Science",
      rating: 4.7,
      students: "2,984,715",
      courses: 7,
      img: "https://img-c.udemycdn.com/user/200_H/31334738_a13c_3.jpg", // Replace with actual image URL
    },
    {
      name: "Academind by Maximilian Schwarzmüller",
      title: "React JS, React Hooks",
      skills: "React JS, React Hooks",
      rating: 4.6,
      students: "3,150,276",
      courses: 48,
      img: "https://img-c.udemycdn.com/user/200_H/9685726_67e7_4.jpg", // Replace with actual image URL
    },
    {
      name: "Jose Portilla",
      title: "Python, Data Science",
      skills: "Python, Data Science",
      rating: 4.6,
      students: "4,096,878",
      courses: 87,
      img: "https://img-c.udemycdn.com/user/200_H/4466306_6fd8_3.jpg", // Replace with actual image URL
    },
    {
      name: "Jonas Schmedtmann",
      title: "JavaScript, React JS",
      skills: "JavaScript, React JS",
      rating: 4.7,
      students: "2,073,486",
      courses: 7,
      img: "https://img-c.udemycdn.com/user/200_H/7799204_2091_5.jpg", // Replace with actual image URL
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? instructors.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === instructors.length - 1 ? 0 : prevIndex + 1
    );
  };

  const navigates = useNavigate(); // Hook for navigation

  const handleButtonClick = () => {
    navigate("/discussion"); // Redirect to discussion page on button click
  };

  return (
    <div className="container mx-auto py-4">
      <div className="relative inline-block text-left ">
        <div className="bg-yellow py-12 px-6 md:px-20 text-center">
          {/* Heading */}
          <p className="text-grey-600 text-lg md:text-xl mb-8">
            Trusted by over{" "}
            <span className="font-bold">Industrial companies</span> and millions
            of learners around the world
          </p>
          <hr className="my-4" />

          {/* Logos Section */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <img
              src="https://www.sviet.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLogo.8bdb37ea.webp&w=640&q=75"
              alt="SVIET"
              className="h-7 w-45 object-contain" // Adjust height and width as needed
            />
            <img
              src="https://ais.ac.in/Assets/Images/ais_logo1-1%201%20copy.png"
              alt="Samsung"
              className="h-12 w-48 object-contain"
            />
            <img
              src="https://www.shivalik.org/assets/newcss/images/logo.png"
              alt="Cisco"
              className="h-7 w-45 object-contain"
            />
            <img
              src="https://www.caeliusconsulting.com/image/logo.svg"
              alt="Vimeo"
              className="h-7 w-45 object-contain"
            />
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-white via-teal-50 to-teal-40 py-12">
          {/* Left Icon */}
          <div className="absolute top-16 left-6 text-teal-400">
            <FontAwesomeIcon icon={faPaperPlane} size="3x" />
          </div>

          {/* Right Icon */}
          <div className="absolute top-16 right-6 text-teal-400">
            <FontAwesomeIcon icon={faCloud} size="3x" />
          </div>

          {/* Content */}
          <div className="text-center">
            {/* Badge */}
            <div className="inline-block px-6 py-2 mb-6 bg-teal-200 text-teal-800 font-bold text-sm rounded-full uppercase tracking-wide shadow-md">
              Why Choose Us
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-snug">
              Dive into online courses on <br /> diverse subjects
            </h1>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6cd xl  mx-auto mt-12">
            {/* Card Template */}
            {[
              {
                bg: "bg-orange-100",
                text: "text-orange-500",
                title: "Progress Tracking and Certifications",
                description:
                  "Track your progress with features like completion percentage, module achievements, and certificates.",
              },
              {
                bg: "bg-blue-100",
                text: "text-blue-500",
                title: "Accessibility and Convenience",
                description:
                  "Flexible learning, anytime and anywhere, making education accessible to everyone.",
              },
              {
                bg: "bg-yellow-100",
                text: "text-yellow-500",
                title: "Diverse Course Selection",
                description:
                  "A wide range of courses to choose from, helping you explore and acquire new skills.",
              },
              {
                bg: "bg-green-100",
                text: "text-green-500",
                title: "Interactive Learning Experience",
                description:
                  "Enhance your learning with quizzes, exercises, and discussion forums.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-3xl p-4 flex items-start transform transition hover:scale-105 hover:shadow-2xl"
              >
                <div className={`${feature.bg} p-5 rounded-xl`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-10 w-10 ${feature.text}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Dropdown Trigger */}
      </div>

      <div className="h-auto dark:bg-gray-900">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <section id="recommendations" className="mb-10"></section>
            <h1 className="text-3xl font-bold dark:text-white mr-2">Courses</h1>
            <DiAtom className="text-4xl text-black" /> {/* Atom icon */}
          </div>
          <div className="flex items-center space-x-4">
            {" "}
            {/* Added space between icons */}
            <div className="relative group">
              <CgViewList
                className="text-2xl text-black hover:text-black hover:shadow-lg hover:shadow-yellow-500 transition duration-900 cursor-pointer"
                onClick={() => setView("list")} // Switch to list view
              />

              {/* Tooltip on hover */}
              <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                View List
              </div>
            </div>
            <div className="relative group">
              <CgViewGrid
                className="text-2xl text-black hover:text-black hover:shadow-lg hover:shadow-yellow-500 transition duration-900 cursor-pointer"
                onClick={() => setView("grid")} // Switch to grid view
              />

              {/* Tooltip on hover */}
              <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                View Grid
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-400 mb-6">
          We pare down complex topics to their key practical components, so you
          gain usable skills in a few hours (instead of weeks or months). The
          courses are provided at no cost to you, and you can now earn
          certificates.
        </p>

        <div
          className={view === "grid" ? "grid grid-cols-3 gap-6" : "space-y-6"}
        >
          {allCourses.map((course) => (
            <CourseCard
              key={course.id || course.title}
              title={course.title}
              description={course.description}
              icon={course.icon || "📘"}
              onClick={() => navigate(`/courses/${course.id || course.title}`)}
              className="relative p-6 bg-yellow border-2 border-gray-300 rounded-lg shadow-md transform transition-all duration-300 
                 hover:shadow-2xl hover:-translate-y-2 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200"
            />
          ))}
        </div>
        <div className="text-black min-h-[500px]  flex items-center justify-center px-2 md:px-20">
          <div className="w-full max-w-7xl">
            {/* Heading Section */}
            <div className="border-b border-gray-300 pb-4">
              <nav className="flex space-x-8 text-sm font-semibold">
                <button
                  className="px-6 py-2 text-yellow-600 border-b-2 border-yellow-500 hover:border-yellow-600"
                  onClick={() => scrollToSection("about")}
                >
                  About
                </button>
                <button
                  className="px-6 py-2 text-gray-500 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-600"
                  onClick={() => scrollToSection("modules")}
                >
                  Modules
                </button>
                <button
                  className="px-6 py-2 text-gray-500 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-600"
                  onClick={() => scrollToSection("recommendations")}
                >
                  Recommendations
                </button>
                <button
                  className="px-6 py-2 text-gray-500 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-600"
                  onClick={() => scrollToSection("testimonials")}
                >
                  Testimonials
                </button>
                <button
                  className="px-6 py-2 text-gray-500 hover:text-yellow-600 border-b-2 border-transparent hover:border-yellow-600"
                  onClick={() => scrollToSection("reviews")}
                >
                  Reviews
                </button>
              </nav>
            </div>

            {/* Spacing and Heading */}
            <div className="mt-10 text-center">
              <h1 className="text-xl md:text-3xl font-extrabold text-gray-800">
                Creative Learning Made Easy
              </h1>
            </div>

            {/* Enhanced List Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {[
                "Thousands of creative classes. Beginner to pro.",
                "Taught by creative pros and industry icons.",
                "Learning Paths to help you achieve your goals.",
                "Certificates to celebrate your accomplishments.",
                "Access to exclusive content for all skill levels.",
                "Step-by-step tutorials for hands-on learning.",
              ].map((text, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-green-500 text-2xl mr-4">✔</span>
                  <span className="text-sm md:text-base text-gray-700">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {[
                { value: "25K+", label: "CLASSES" },
                { value: "600K+", label: "MEMBERS" },
                { value: "8K+", label: "TEACHERS" },
                { value: "4.8 ★★★★☆", label: "COURSES RATING" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-yellow-300 rounded-full py-2 px-1 text-center"
                >
                  <h2 className="text-lg md:text-1xl font-bold text-gray-800">
                    {stat.value}
                  </h2>
                  <p className="text-xs md:text-sm mt-2 text-gray-700">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8"></div>
        <div className="flex items-center"></div>
        <div className="h-auto dark:bg-gray-900" />
      </div>
      <section id="modules" className="mb-10"></section>

      <section id="recommendations" className="mb-10"></section>

      <div className="p-8 bg-gradient-to-r from-#fcf9f591-50 via-gray-50 to-yellow-100 min-h-screen flex flex-col items-center">
        <section id="testimonials" className="mb-10"></section>
        <h1 className="text-4xl font-extrabold mb-12 text-gray-800 tracking-wide text-left">
          Learning Focused on Your Goals
        </h1>

        <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-10">
          {/* Left Side (Goals Section) */}
          <div className="flex flex-col gap-6">
            {/* Card 1 */}
            <div className="p-6 border-2 border-yellow-500 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-yellow-50 to-purple-50 transition-all duration-300 hover:scale-105">
              <h2 className="text-2xl font-bold text-yellow-600 mb-2">
                Hands-on Training
              </h2>
              <p className="text-gray-700">
                Upskill effectively with AI-powered coding exercises, practice
                tests, and quizzes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 border-2 border-purple-500 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-purple-50 to-purple-100 transition-all duration-300 hover:scale-105">
              <h2 className="text-2xl font-bold text-purple-600 mb-2">
                Certification Prep
              </h2>
              <p className="text-gray-700">
                Prep for industry-recognized certifications by solving
                real-world challenges and earning badges along the way.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 border-2 border-blue-400 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-blue-50 to-blue-100 transition-all duration-300 hover:scale-105">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                Certification Prep
              </h2>
              <p className="text-gray-700">
                Prep for industry-recognized certifications by solving
                real-world challenges and earning badges along the way.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 border-2 border-green-400 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-green-50 to-green-100 transition-all duration-300 hover:scale-105 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Insights and Analytics
                </h2>
                <p className="text-gray-700">
                  Fast-track goals with advanced insights plus a dedicated
                  customer success team to help drive effective learning.
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full ml-4">
                Enterprise Plan
              </span>
            </div>
          </div>

          {/* Right Side (Score Section) */}
          <div className="p-8 border-2 border-gray-300 rounded-lg shadow-2xl bg-white flex-grow max-w-md hover:shadow-purple-300 hover:border-purple-400 transition-all duration-300 hover:scale-105">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-wide">
              Containerization
            </h2>
            <p className="text-gray-600 mb-4 text-lg">30 Questions</p>

            <div className="mb-6">
              <p className="text-5xl font-extrabold text-yellow-500">
                Your Score: 159
              </p>
              <div className="mt-4 border-t border-gray-200">
                <table className="w-full text-sm mt-2">
                  <tbody>
                    <tr className="text-yellow-500 font-semibold">
                      <td>Superior</td>
                      <td className="text-right">150-200</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td>Established</td>
                      <td className="text-right">100-149</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td>Developing</td>
                      <td className="text-right">50-99</td>
                    </tr>
                    <tr className="text-gray-700">
                      <td>Limited</td>
                      <td className="text-right">0-49</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6 text-gray-700 text-center bg-purple-100 p-6 rounded-lg shadow-sm">
              <p>
                Your performance was better than{" "}
                <span className="font-extrabold text-yellow-500">88%</span> of
                Tech learners who have completed this assessment.
              </p>
            </div>

            <div className="mb-6">
              <a
                href="#"
                className="text-yellow-500 underline hover:text-yellow-600 transition"
              >
                What do these numbers mean?
              </a>
            </div>

            <div className="text-gray-700">
              <h3 className="font-bold text-xl">Your Answers</h3>
              <p className="text-gray-600">
                Review your answers. Learn from these explanations of correct
                and incorrect response options.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-8 w-full">
        {/* Popular Topics */}
        <div className="mb-8">
          <section id="reviews" className="mb-10"></section>
          <h2 className="text-2xl font-bold mb-4">Popular topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              "Python",
              "Data Science",
              "JavaScript",
              "Java",
              "Unity",
              "Web Development",
              "React JS",
              "Unreal Engine",
              "Machine Learning",
              "C# (programming language)",
            ].map((topic, index) => (
              <button
                key={index}
                className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-yellow-300 hover:shadow-lg transition duration-300 ease-in-out w-full h-12 flex items-center justify-center"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Instructors */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Instructors</h2>
          <p className="text-gray-600 mb-6">
            These real-world experts are highly rated by learners like you.
          </p>

          {/* Slider */}
          <div className="relative w-full overflow-hidden">
            {/* Slider Track */}
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {instructors.map((instructor, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 flex flex-col items-center bg-white p-4"
                >
                  <img
                    src={instructor.img}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-full mb-4"
                  />
                  <h3 className="font-bold text-lg text-center">
                    {instructor.name}
                  </h3>
                  <p className="text-gray-600 text-sm text-center mb-2">
                    {instructor.title}
                  </p>
                  <p className="text-sm text-center mb-4">
                    {instructor.skills}
                  </p>
                  <p className="text-gray-800 text-sm">
                    <span className="font-bold">{instructor.rating}</span> ⭐
                    Instructor Rating
                  </p>
                  <p className="text-gray-600 text-sm">
                    {instructor.students} students
                  </p>
                  <p className="text-gray-600 text-sm">
                    {instructor.courses} courses
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-3 rounded-full shadow transition duration-300 ease-in-out"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-3 rounded-full shadow transition duration-300 ease-in-out"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <div className="py-16 px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between max-w-screen-2xl mx-auto">
        {/* Left Text Section */}
        <div className="lg:w-1/2 text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Top trends for the <br /> future of work
          </h1>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Our 2025 Global Learning & Skills
            <br /> Trends Report is out now! Find out
            <br />
            how to build the skills to keep pace
            <br /> with change.
          </p>
          <button
            className="bg-yellow-300 text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-500 transition duration-300 shadow-md"
            onClick={handleButtonClick} // Handle button click
          >
            Let's discuss →
          </button>
        </div>

        {/* Right Image Section */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-3xl">
            {/* Main Image */}
            <img
              src="https://cms-images.udemycdn.com/content/c4gpjcmcsk/png/UB_Case_Studies_Booz_Allen_image.png?position=c&quality=80&x.app=portals"
              alt="2025 Global Learning & Skills Trends Report"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {/* Overlayed Image */}
          </div>
        </div>
      </div>
      {/* <div className="bg-white py-16 px-8 lg:px-24 flex flex-col lg:flex-row items-center justify-between">
      
        <div className="max-w-lg">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Master New Skills <br /> with{" "}
            <span className="text-yellow-500">
              <Typewriter
                words={["Techlearns"]}
                loop={false}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={50}
              />
            </span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Are you tired of pulling all-nighters and still struggling to keep
            up with your coursework?
          </p>
        
          <div className="flex items-center gap-4 mb-8">
            <button className="bg-black text-white py-2 px-8 rounded-full flex items-center font-semibold shadow-md hover:bg-gray-900">
              <span className="mr-2">Get Started</span>
              <span className="bg-white p-3 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowRight} className="text-black" />
              </span>
            </button>
            <div className="flex items-center text-gray-700 ml-auto">
              <img
                src="https://img.freepik.com/premium-photo/color-user-icon-white-background_961147-8.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
                alt="User avatars"
                className="w-10 h-10 rounded-full border-2 border-white -ml-3"
              />
              <img
                src="https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303097.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
                alt="User avatars"
                className="w-10 h-10 rounded-full border-2 border-white -ml-3"
              />
              <span className="ml-4 text-sm font-medium">
                42k+ Using this app
              </span>
            </div>
          </div>

      
          <div className="flex justify-center lg:justify-start gap-8 mt-10 py-5">
            <img
              src="https://www.theuniques.in/static/media/theuniquesCommunity.de2335f2609ada2712b0.png"
              alt="TIME logo"
              className="h-8"
            />
            <img
              src="https://www.sviet.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FLogo.8bdb37ea.webp&w=640&q=75"
              alt="Forbes logo"
              className="h-7"
            />
            <img
              src="https://techlearns.in/Logo.png"
              alt="TechCrunch logo"
              className="h-8"
            />
          </div>
        </div>
     
        <div className="mt-12 lg:mt-0 lg:ml-16">
          <img
            src="https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6830.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
            alt="Illustration"
            className="w-full max-w-md lg:max-w-lg"
          />
        </div>
      </div> */}
     <div className="p-8 bg-white">
      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Section */}
        <div className="space-y-8">
          {/* Peace of Mind Card */}
           <div className="flex items-center gap-8">
           <div className="flex items-center bg-yellow-400 p-4 rounded-2xl shadow-md max-w-sm">
  <div className="flex-shrink-0">
    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-sm">
      <img
        src="https://img.freepik.com/free-vector/young-man-with-glasses-avatar_1308-175763.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
        alt="Mental Health Icon"
        className="w-8 h-8"
      />
    </div>
  </div>

  <div className="ml-4">
    <h3 className="text-lg font-semibold text-gray-800">Mental Health</h3>
    <p className="text-sm text-gray-600">
      Take care of your mental well-being effectively.
    </p>
  </div>
</div>

          <div className="flex flex-col items-end">
  <img
            src="https://img.freepik.com/premium-photo/smiling-girl-looking-laptop-while-studying-library_1048944-22474512.jpg?t=st=1736127108~exp=1736127708~hmac=1d5a2b5171116ed9a59acc4273c4c86dca74cc4cb03146433cd72d66c906ee87"
            alt="Meditation Class"
      className="w-full max-w-xs h-auto rounded-[90px] shadow-lg object-cover"
          />
  </div>


         </div>
     
          {/* Mental Health Card */}
          <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
  <img
            src="https://img.freepik.com/premium-photo/smiling-girl-looking-laptop-while-studying-library_1048944-22474512.jpg?t=st=1736127108~exp=1736127708~hmac=1d5a2b5171116ed9a59acc4273c4c86dca74cc4cb03146433cd72d66c906ee87"
            alt="Meditation Class"
            className="w-full max-w-xs h-auto rounded-[90px] shadow-lg object-cover"
          />
  </div>
  <div className="flex items-center bg-yellow-400 p-4 rounded-2xl shadow-md max-w-sm">
  <div className="flex-shrink-0">
    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-sm">
      <img
        src="https://img.freepik.com/free-vector/young-man-with-glasses-avatar_1308-175763.jpg?ga=GA1.1.15581536.1727159730&semt=ais_hybrid"
        alt="Mental Health Icon"
        className="w-8 h-8"
      />
    </div>
  </div>

  <div className="ml-4">
    <h3 className="text-lg font-semibold text-gray-800">Mental Health</h3>
    <p className="text-sm text-gray-600">
      Take care of your mental well-being effectively.
    </p>
  </div>
</div>

        </div>
        </div>
        

        {/* Right Section */}
        
        <div className="flex flex-col items-start justify-start pt-24">
        <h2 className="text-2xl font-bold text-yellow-500 tracking-[0.3em]">
  Techlearns
</h2>

  <div className="mt-6 text-left">
    <h2 className="text-4xl font-bold text-gray-800">
      Every Story Has Its Purpose
    </h2>
    <p className="text-lg text-gray-600 mt-4">
      Wondering how many times a day you're in a mindful state? Check your score. The higher the score, the greater your ability to be mindful.
    </p>
  </div>
</div>


      </div>
    </div>
    </div>
  );
};

export default Courses;
