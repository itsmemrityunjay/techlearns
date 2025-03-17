import React, { useState, useEffect } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CgViewGrid, CgViewList } from "react-icons/cg";
import { db } from "../../database/Firebase"; // Import your Firebase config
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { DiAtom } from "react-icons/di";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCloud } from "@fortawesome/free-solid-svg-icons";
// import { faArrowRight } from "@fortawesome/free-solid-svg-icons";  
import { Typewriter } from "react-simple-typewriter";

import CourseBanner from "../comp/divider";
// CourseCard Component

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import { Navigations } from 'swiper/modules';

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

      <div className="h-auto dark:bg-gray-900 mt-12 px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <section id="recommendations" className="mr-3"></section>
            <h1 className="text-3xl font-bold dark:text-white mr-2">Courses</h1>
            <DiAtom className="text-4xl text-black dark:text-white" />
          </div>
          <div className="flex items-center space-x-4">
            {/* List View */}
            <div className="relative group">
              <CgViewList
                className="text-2xl text-black dark:text-white hover:shadow-lg hover:shadow-yellow-500 transition duration-300 cursor-pointer"
                onClick={() => setView('flex')}
              />
              <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                View List
              </div>
            </div>
            {/* Grid View */}
            <div className="relative group">
              <CgViewGrid
                className="text-2xl text-black dark:text-white hover:shadow-lg hover:shadow-yellow-500 transition duration-300 cursor-pointer"
                onClick={() => setView('grid')}
              />
              <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                View Grid
              </div>
            </div>
          </div>
        </div>

        {/* Intro Paragraph */}
        <p className="text-gray-400 mb-6 max-w-4xl text-sm sm:text-base">
          We pare down complex topics to their key practical components, so you gain usable skills in a few hours. The courses are free, and you can earn certificates!
        </p>

        {/* Course Cards */}
        <div
          className={`grid gap-6 ${view === 'flex' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
        >
          {allCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              icon={course.icon}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="relative p-6 bg-white dark:bg-gray-800 border-2 rounded-xl shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 group cursor-pointer"
            />
          ))}
        </div>

        {/* Mental Health & Image Section */}
        <div className="px-4 py-10 sm:px-8 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-10">
              {/* Card 1 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center bg-yellow-400 p-4 rounded-2xl shadow-md w-full md:max-w-sm">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-sm">
                      <img
                        src="https://img.freepik.com/free-vector/young-man-with-glasses-avatar_1308-175763.jpg"
                        alt="Mental Health Icon"
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Mental Health</h3>
                    <p className="text-sm text-gray-600">Take care of your mental well-being effectively.</p>
                  </div>
                </div>
                <div className="flex w-full md:w-auto">
                  <img
                    src="https://img.freepik.com/premium-photo/smiling-girl-looking-laptop-while-studying-library_1048944-22474512.jpg"
                    alt="Meditation Class"
                    className="w-full max-w-xs rounded-[90px] shadow-lg object-cover"
                  />
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex w-full md:w-auto order-2 md:order-1">
                  <img
                    src="https://img.freepik.com/premium-photo/smiling-girl-looking-laptop-while-studying-library_1048944-22474512.jpg"
                    alt="Meditation Class"
                    className="w-full max-w-xs rounded-[90px] shadow-lg object-cover"
                  />
                </div>
                <div className="flex items-center bg-yellow-400 p-4 rounded-2xl shadow-md w-full md:max-w-sm order-1 md:order-2">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-sm">
                      <img
                        src="https://img.freepik.com/free-vector/young-man-with-glasses-avatar_1308-175763.jpg"
                        alt="Mental Health Icon"
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Mental Health</h3>
                    <p className="text-sm text-gray-600">Take care of your mental well-being effectively.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-start justify-start pt-10 md:pt-24">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-500 tracking-[0.3em]">
                Techlearns
              </h2>
              <div className="mt-4 sm:mt-6 text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                  <Typewriter
                    words={['Every Story Has Its Purpose']}
                    loop={10}
                    cursor
                    cursorStyle="_"
                    typeSpeed={100}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mt-4">
                  Wondering how many times a day you're in a mindful state? Check your score.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-6 sm:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center tracking-wide">
              Learning Focused on Your Goals
            </h1>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex flex-col gap-6 flex-grow">
                <div className="p-6 border-2 border-yellow-500 rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:bg-gradient-to-r from-yellow-50 to-yellow-100 transition-all duration-300 hover:scale-105">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-2">Hands-on Training</h2>
                  <p className="text-gray-700 dark:text-gray-400">
                    Upskill effectively with AI-powered coding exercises, practice tests, and real-world projects.
                  </p>
                </div>
                <div className="p-6 border-2 border-yellow-500 rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:bg-gradient-to-r from-yellow-50 to-yellow-100 transition-all duration-300 hover:scale-105">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-2">Certifications</h2>
                  <p className="text-gray-700 dark:text-gray-400">
                    Earn certificates recognized by top employers globally.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6 flex-grow">
                <div className="p-6 border-2 border-yellow-500 rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:bg-gradient-to-r from-yellow-50 to-yellow-100 transition-all duration-300 hover:scale-105">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-2">Community Support</h2>
                  <p className="text-gray-700 dark:text-gray-400">
                    Join a supportive learning community and get guidance from mentors.
                  </p>
                </div>
                <div className="p-6 border-2 border-yellow-500 rounded-lg shadow-lg bg-white dark:bg-gray-800 hover:bg-gradient-to-r from-yellow-50 to-yellow-100 transition-all duration-300 hover:scale-105">
                  <h2 className="text-2xl font-bold text-yellow-600 mb-2">Career Growth</h2>
                  <p className="text-gray-700 dark:text-gray-400">
                    Learn job-ready skills and prepare for interviews with expert help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
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

      <div className="py-16  via-white sm:px-12 lg:px-0 flex flex-col lg:flex-row items-center justify-between max-w-screen-2xl mx-auto">
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
            className="bg-[#ffa800] text-white font-semibold py-3 px-8 rounded-lg hover:bg-yellow-600 hover:scale-105 mb-4 transition duration-300 shadow-lg"
            onClick={handleButtonClick}
          >
            Let's Discuss →
          </button>
        </div>

        {/* Right Image Section */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end mt-2 relative">
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



    </div >
  );
};

export default Courses;