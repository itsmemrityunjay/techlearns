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
import {
  Search,
  FilterList,
  List,
  StarBorder,
  Flag,
  Science,
  People,
  Celebration,
  SmartToy,
  BarChart,
} from "@mui/icons-material";
import CourseBanner from "../comp/divider";
// CourseCard Component

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination,Navigation, Autoplay  } from "swiper/modules"; // Import the Pagination module
import "swiper/css/navigation";
import { Navigations } from 'swiper/modules'; // Correct import for Navigation module


const CourseCard = ({ title, description, icon, onClick }) => (
<div
  onClick={onClick}
  className="relative flex items-start p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
>
  {/* Decorative Border */}
  <div
    className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-yellow-500 to-yellow-800 opacity-0 pointer-events-none"
  ></div>

  {/* Icon Section */}
  <div className="flex-shrink-0 bg-yellow-400 dark:bg-yellow-600 text-yellow-600 dark:text-white p-5 rounded-full shadow-md mr-5">
    <img src={icon} alt="icon" height={48} width={48} className="w-12 h-12" />
  </div>

  {/* Content Section */}
  <div className="flex flex-col justify-center">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
  </div>

  {/* Action Area (Optional, can be removed if not needed) */}
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-yellow-500 text-white rounded-full opacity-0">
    <span className="text-sm font-semibold">Learn More</span>
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
      name: "Academind by Maximilian Schwarzmüller",
      title: "React JS, React Hooks",
      skills: "React JS, React Hooks",
      rating: 4.6,
      students: "3,150,276",
      courses: "48  courses",
      img: "https://img-c.udemycdn.com/user/200_H/9685726_67e7_4.jpg", // Replace with actual image URL
    },
    {
      name: "Academind by Maximilian Schwarzmüller",
      title: "React JS, React Hooks",
      skills: "React JS, React Hooks",
      rating: 4.6,
      students: "3,150,276",
      courses: "48  courses",
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
     
        <div className="relative w-full max-w-8xl rounded-3xl overflow-hidden py-16 px-4 sm:px-8 lg:px-16">
      {/* Icons */}
      <div className="absolute top-12 left-8 text-yellow-400">
        <FontAwesomeIcon icon={faPaperPlane} size="4x" className="animate-bounce" />
      </div>
      <div className="absolute top-12 right-8 text-yellow-400">
        <FontAwesomeIcon icon={faCloud} size="4x" className="animate-bounce" />
      </div>

      {/* Content */}
      <div className="text-center">
      <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg uppercase tracking-wide px-6 py-2 rounded-full shadow-lg mb-6">
  Why Choose Us
</span>

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Dive into Online Courses on{' '}
          <br className="hidden md:block" />
          Diverse Subjects
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore a wide range of topics with engaging, interactive lessons designed
          to help you learn at your own pace.
        </p>
      </div>

      {/* Feature Cards */}
   {/* Feature Cards */}
   <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          icon: '💻',
          title: 'Progress Tracking & Certifications',
          description:
            'Track your progress with features like completion percentage, module achievements, and certificates.',
          gradient: 'bg-gradient-to-r from-orange-500 to-orange-300',
        },
        {
          icon: '🌐',
          title: 'Accessibility & Convenience',
          description:
            'Flexible learning anytime, anywhere, making education accessible to everyone.',
          gradient: 'bg-gradient-to-r from-blue-500 to-blue-300',
        },
        {
          icon: '📚',
          title: 'Diverse Course Selection',
          description:
            'A wide range of courses to choose from, helping you explore and acquire new skills.',
          gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-300',
        },
        {
          icon: '📊',
          title: 'Interactive Learning Experience',
          description:
            'Enhance your learning with quizzes, exercises, and discussion forums.',
          gradient: 'bg-gradient-to-r from-green-500 to-green-300',
        },
      ].map((feature, index) => (
        <div 
          key={index}
          className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105 border-2 border-yellow"
        >
          <div
            className={`${feature.gradient} p-5 rounded-full text-4xl text-white flex items-center justify-center shadow-lg`}
          >
            {feature.icon}
          </div>
          <h4 className="text-xl font-semibold text-gray-800 mt-6">
            {feature.title}
          </h4>
          <p className="text-base text-gray-600 mt-2 leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>

    </div>

        {/* Dropdown Trigger */}
      </div>

      <div className="h-auto dark:bg-gray-900 mt-12">
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
  className={`grid gap-6 ${
    view === "flex" ? "grid-cols-1" : "grid-cols-3"
  }`}
>
  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || "📘"}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}

      className="relative p-6 bg-white border-2 rounded-xl shadow-md 
                 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 group"
    >
      {/* Gradient Border */}
      <div
        className="absolute inset-0 rounded-xl border-2 
                   border-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col items-start">
        <div
          className="text-3xl mb-4 p-4 bg-purple-100 text-purple-600 
                     rounded-full shadow-md transition-all duration-300 group-hover:scale-110"
        >
          {course.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 group-hover:text-gray-800">
          {course.description}
        </p>
      </div>
    </CourseCard>
  ))}
</div>

        <div className="p-20">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-10">
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
        <Typewriter
          words={['Every Story Has Its Purpose']}
          loop={10} // Number of loops (you can set it to Infinity for continuous typing)
          cursor
          cursorStyle="_" // You can customize the cursor style
          typeSpeed={100} // Speed at which characters are typed (in ms)
          deleteSpeed={50} // Speed at which characters are deleted
          delaySpeed={1500} // Delay before starting to type
        />
      </h2>

              <p className="text-lg text-gray-600 mt-4">
                Wondering how many times a day you're in a mindful state? Check your score. The higher the score, the greater your ability to be mindful.
              </p>
            </div>
          </div>


        </div>
      </div>


      
        
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-6">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center tracking-wide">
      Learning Focused on Your Goals
    </h1>

    <div className="flex flex-col lg:flex-row gap-12">
      {/* Left Section: Goals */}
      <div className="flex flex-col gap-6 flex-grow">
        {/* Card 1 */}
        <div className="p-6 border-2 border-yellow-500 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-yellow-50 to-yellow-100 transition-all duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">
            Hands-on Training
          </h2>
          <p className="text-gray-700">
            Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 border-2 border-purple-500 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-purple-50 to-purple-100 transition-all duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-purple-600 mb-2">
            Certification Prep
          </h2>
          <p className="text-gray-700">
            Prep for industry-recognized certifications by solving real-world challenges and earning badges along the way.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 border-2 border-blue-500 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-blue-50 to-blue-100 transition-all duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">
            Insights and Analytics
          </h2>
          <p className="text-gray-700">
            Fast-track goals with advanced insights plus a dedicated customer success team to help drive effective learning.
          </p>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full mt-4 inline-block">
            Enterprise Plan
          </span>
        </div>

        {/* Card 4 */}
        <div className="p-6 border-2 border-green-500 rounded-lg shadow-lg bg-white hover:bg-gradient-to-r from-green-50 to-green-100 transition-all duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Customizable Content
          </h2>
          <p className="text-gray-700">
            Create tailored learning paths for team and organization goals and even host your own content and resources.
          </p>
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full mt-4 inline-block">
            Enterprise Plan
          </span>
        </div>
      </div>

      {/* Right Section: Score */}
      <div className="p-8 border-2 border-gray-200 rounded-lg shadow-2xl bg-white flex-grow max-w-lg hover:shadow-purple-300 hover:border-purple-400 transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-wide">
          Containerization
        </h2>
        <p className="text-gray-600 mb-4 text-lg">30 Questions</p>

        <div className="mb-6">
          <p className="text-5xl font-extrabold text-yellow-500">Your Score: 159</p>
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
            <span className="font-extrabold text-yellow-500">88%</span> of learners who have completed this assessment.
          </p>
        </div>

        <div className="mb-6">
          <a href="#details" className="text-yellow-500 underline hover:text-yellow-600 transition">
            What do these numbers mean?
          </a>
        </div>

        <div className="text-gray-700">
          <h3 className="font-bold text-xl">Your Answers</h3>
          <p className="text-gray-600">
            Review your answers. Learn from these explanations of correct and incorrect response options.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
      <div className="container mx-auto py-16">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Learners Are Viewing
      </h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet",
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800} // Smooth transition speed in ms
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        {instructors.map((course, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white border border-yellow-400 shadow-md hover:shadow-lg rounded-lg overflow-hidden transform transition-all duration-300">
              {/* Course Image */}
              <div className="relative">
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-53 object-cover"
                />
                {/* Bestseller Badge */}
                {course.isBestseller && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Bestseller
                  </span>
                )}
              </div>
              {/* Course Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{course.name}</p>
                <p className="text-gray-500 text-sm">
                  <strong>Skills:</strong> {course.skills}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Students:</strong> {course.students}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Courses:</strong> {course.courses}
                </p>
                {/* Rating */}
                <div className="flex items-center mt-4">
                  <span className="text-yellow-500 text-lg font-bold mr-2">
                    {course.rating}
                  </span>
                  <div className="flex">
                    {Array.from({ length: Math.round(course.rating) }).map(
                      (_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.571 8.332 1.209-6.035 5.857 1.425 8.318L12 18.897l-7.39 3.645 1.425-8.318L0 9.367l8.332-1.209z" />
                        </svg>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Swiper Navigation */}
        <div className="swiper-button-prev text-yellow-500 hover:text-yellow-700"></div>
        <div className="swiper-button-next text-yellow-500 hover:text-yellow-700"></div>
      </Swiper>

      {/* Custom CSS for Pagination */}
      <style jsx>{`
        .custom-bullet {
          background: #facc15; /* Yellow color */
          opacity: 1;
        }
        .custom-bullet-active {
          background: #fbbf24; /* Darker yellow */
        }
        .swiper-button-next,
        .swiper-button-prev {
          font-size: 1.5rem;
        }
      `}</style>
    </div>

<CourseBanner></CourseBanner>

      <div className="py-16 bg-gradient-to-r from-yellow-50 via-white to-yellow-100 sm:px-12 lg:px-0 flex flex-col lg:flex-row items-center justify-between max-w-screen-2xl mx-auto">
  {/* Left Text Section */}
  <div className="lg:w-1/2 text-left">
    {/* Heading */}
    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ffa800] to-yellow-600">
        Top Trends
      </span>
      for the Future of Work
    </h1>

    {/* Paragraph */}
    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
      Our <span className="font-semibold text-gray-900">2025 Global Learning & Skills Trends Report</span> is out now! Find out how to build the right skills to stay ahead of rapid change in the workplace.
    </p>

    {/* Call-to-Action Button */}
    <button
      className="bg-[#ffa800] text-white font-semibold py-3 px-8 rounded-lg hover:bg-yellow-600 hover:scale-105 transition duration-300 shadow-lg"
      onClick={handleButtonClick}
    >
      Let's Discuss →
    </button>
  </div>

  {/* Right Image Section */}
  <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
    <div className="relative w-full max-w-3xl">
      {/* Main Image */}
      <img
        src="https://cms-images.udemycdn.com/content/c4gpjcmcsk/png/UB_Case_Studies_Booz_Allen_image.png?position=c&quality=80&x.app=portals"
        alt="2025 Global Learning & Skills Trends Report"
        className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
      />

      {/* Overlay Effect */}
      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg opacity-0 hover:opacity-100 transition duration-300"></div>
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
     
    
   
    </div>
  );
};

export default Courses;