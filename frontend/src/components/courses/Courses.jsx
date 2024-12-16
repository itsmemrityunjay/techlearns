import React, { useState, useEffect,  } from 'react';
import { MdOutlineArrowDropDown } from "react-icons/md";
import { CgViewGrid, CgViewList } from "react-icons/cg";
import { db } from '../../database/Firebase'; // Import your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { DiAtom } from "react-icons/di";
import { FaChevronDown, FaUsers, FaBlog, FaBook, FaLightbulb, FaNetworkWired, FaCertificate, FaChartLine } from 'react-icons/fa';




// CourseCard Component

const CourseCard = ({ title, description, icon, onClick }) => (
    <div onClick={onClick} className="flex items-start p-4 dark:bg-gray-800 dark:text-white text-dark rounded-md mb-4 cursor-pointer hover:shadow-lg transition-shadow">
        <div className="text-3xl mr-4"><img src={icon} alt="icon" /></div>
        <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm">{description}</p>
        </div>
    </div>
);
const DropdownItem = ({ icon, title, description }) => (
  <a
      href="#"
      className="flex items-center px-4 py-3 hover:bg-gray-50 transition duration-200"
  >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl">
          {icon}
      </div>
      <div className="ml-4">
          <p className="text-gray-900 font-semibold">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
      </div>
  </a>
);
const Courses = () => {
    
        const allCourse = [
            { id: 1, title: 'Intro to Programming', description: 'Get started with Python, if you have no coding experience.', icon: '🖥' },
            { id: 2, title: 'Python', description: 'Learn the most important language for data science.', icon: '🐍' },
            { id: 3, title: 'Intro to Machine Learning', description: 'Learn the core ideas in machine learning, and build your first models.', icon: '🤖' },
            { id: 4, title: 'Pandas', description: 'Solve short hands-on challenges to perfect your data manipulation skills.', icon: '📊' },
            { id: 5, title: 'Intermediate Machine Learning', description: 'Handle missing values, non-numeric values, data leakage, and more.', icon: '📈' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
            { id: 6, title: 'Data Visualization', description: 'Make great data visualizations. A great way to see the power of coding!', icon: '📉' },
         
        ];
       
        const [isOpen, setIsOpen] = useState(false);
     

    const [firebaseCourses, setFirebaseCourses] = useState([]);
    const [view, setView] = useState('list');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                const fetchedCourses = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFirebaseCourses(fetchedCourses);
            } catch (error) {
                console.error('Error fetching courses: ', error);
            }
        };
       
        fetchCourses();
    }, []);

    const toggleeDropdown = () => {
      setIsOpen((prev) => !prev);
  };
   
    const allCourses = [...firebaseCourses];
    
    
    
    
    return (
        
        <div className='container mx-auto py-8'>
         <div className="relative inline-block text-left ">
            {/* Dropdown Trigger */}
            <button
                onClick={toggleeDropdown}
                className="flex items-center px-5 py-3 text-lg font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 transition duration-200"
            >
                Academy by <span className="text-yellow-500 ml-2 font-semibold mr-2">Techlearns</span>
                <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

               
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute z-10 mt-2 w-96 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Techlearns Academy</h2>
                        <p className="text-sm text-gray-500">Explore • Learn • Achieve</p>
                    </div>
                    
                    <div className="flex flex-wrap divide-x divide-gray-100 pt-4">
                        <DropdownItem
                            icon={<FaUsers className="text-blue-500" />}
                            title="Founders Table"
                            description="Intimate Gatherings of Educational Leaders"
                        />
                      
                        <DropdownItem
                            icon={<FaBlog className="text-purple-500" />}
                            title="Blog"
                            description="Level up your Efficiency"
                        />
                        <DropdownItem
                            icon={<FaBook className="text-green-500" />}
                            title="Quick Reads"
                            description="Flick through the resources"
                        />
                        <DropdownItem
                            icon={<FaLightbulb className="text-yellow-500" />}
                            title="Insights"
                            description="Bleeding Edge Ebooks"
                        />
                        <DropdownItem
                            icon={<FaNetworkWired className="text-pink-500" />}
                            title="Illuminate"
                            description="Knowledge Sharing Series"
                        />
                        <DropdownItem
                            icon={<FaNetworkWired className="text-teal-500" />}
                            title="Roots"
                            description="Staying Connected"
                        />
                        <DropdownItem
                            icon={<FaCertificate className="text-indigo-500" />}
                            title="Enrollymics"
                            description="Earn Industry Certifications"
                        />
                        <DropdownItem
                            icon={<FaChartLine className="text-red-500" />}
                            title="Evolve"
                            description="Exclusive User Conference"
                        />
                    </div>
                </div>
            )}
        </div>
    
        <div className='container mx-auto py-4'></div>
        {/* <div className="h-auto dark:bg-gray-900"></div> */}
    <p className="text-gray-400 mb-6">
    Explore these curated collections of high-quality learning resources authored by the Techlearns community.
                </p>

                <div className="grid grid-cols-3 gap-6">
  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || '📘'}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}
      className="relative p-6 bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all transform hover:border-blue-500 hover:shadow-xl hover:scale-105"
    />
  ))}


  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || '📘'}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}
      className="relative p-6 bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all transform hover:border-yellow-500 hover:shadow-xl hover:scale-105"
    />
  ))}
  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || '📘'}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}
      className="relative p-6 bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all transform hover:border-yellow-500 hover:shadow-xl hover:scale-105"
    />
  ))}
  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || '📘'}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}
      className="relative p-6 bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all transform hover:border-yellow-500 hover:shadow-xl hover:scale-105"
    />
  ))}
  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || '📘'}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}
      className="relative p-6 bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all transform hover:border-yellow-500 hover:shadow-xl hover:scale-105"
    />
  ))}
  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || '📘'}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}
      className="relative p-6 bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all transform hover:border-yellow-500 hover:shadow-xl hover:scale-105"
    />
  ))}
  {allCourses.map((course) => (
    <CourseCard
      key={course.id || course.title}
      title={course.title}
      description={course.description}
      icon={course.icon || '📘'}
      onClick={() => navigate(`/courses/${course.id || course.title}`)}
      className="relative p-6 bg-white border-2 border-gray-300 rounded-lg shadow-md transition-all transform hover:border-yellow-500 hover:shadow-xl hover:scale-105"
    />
  ))}
</div>

            <div className="h-auto dark:bg-gray-900">
            <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
        <h1 className="text-3xl font-bold dark:text-white mr-2">Courses</h1>
        <DiAtom className="text-4xl text-black" /> {/* Atom icon */}
        
      </div>
      <div className="flex items-center space-x-4"> {/* Added space between icons */}
      <div className="relative group">
      <CgViewList
                                className="text-2xl text-black hover:text-black hover:shadow-lg hover:shadow-yellow-500 transition duration-900 cursor-pointer"
                                onClick={() => setView('list')} // Switch to list view
                            />
        
        {/* Tooltip on hover */}
        <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
          View List
        </div>
      </div>
      <div className="relative group">
      <CgViewGrid
                                className="text-2xl text-black hover:text-black hover:shadow-lg hover:shadow-yellow-500 transition duration-900 cursor-pointer"
                                onClick={() => setView('grid')} // Switch to grid view
                            />
        
        {/* Tooltip on hover */}
        <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
          View Grid
        </div>
      </div>
   
          </div>
      
  
    </div>
    <p className="text-gray-400 mb-6">
                    We pare down complex topics to their key practical components, so you gain usable skills in a few hours (instead of weeks or months). The courses are provided at no cost to you, and you can now earn certificates.
                </p>
                <div className={view === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-6'}>
  {allCourse.map((course) => (
    
    <div
      key={course.id}
      className="flex items-start p-6 bg-white shadow-lg rounded-xl transition transform hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-xl hover:-translate-y-1"
    >
      <span className="text-3xl mr-4 text-blue-600">{course.icon}</span>
      <div>
      
        <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
        <p className="text-sm text-gray-700 mb-4">{course.description}</p>
        <button className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white border-2 border-gray-300 rounded-lg shadow-md transition duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300">
          Learn More
          
        </button>
        
      </div>
    </div>
    
  ))}

</div>
  <div className='mt-8'></div>
  <div className="flex items-center"></div>
 <div className="h-auto dark:bg-gray-900"/>
 </div>
 <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-12 text-gray-800">Learning focused on your goals</h1>
      
      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-10">
        
        {/* Left Side (Goals Section) */}
        <div className="flex flex-col gap-6">
          <div className="p-6 border-2 border-yellow-500 rounded-lg shadow-lg bg-white hover:bg-purple-50 transition">
            <h2 className="text-xl font-semibold text-yellow-500 mb-2">Hands-on training</h2>
            <p className="text-gray-600">Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.</p>
          </div>
          
          <div className="p-6 border-2 border-gray-300 rounded-lg shadow-lg bg-white hover:bg-gray-100 transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Certification prep</h2>
            <p className="text-gray-600">Prep for industry-recognized certifications by solving real-world challenges and earn badges along the way.</p>
          </div>
          
          <div className="p-6 border-2 border-gray-300 rounded-lg shadow-lg bg-white hover:bg-gray-100 transition flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Insights and analytics</h2>
              <p className="text-gray-600">Fast-track goals with advanced insights plus a dedicated customer success team to help drive effective learning.</p>
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full ml-4">Enterprise Plan</span>
          </div>
        </div>

        {/* Right Side (Score Section) */}
        <div className="p-6 border-2 border-gray-300 rounded-lg shadow-lg bg-white flex-grow max-w-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Containerization</h2>
          <p className="text-gray-500 mb-4">30 questions</p>
          
          <div className="mb-6">
            <p className="text-4xl font-bold text-yellow-500">Your score: 159</p>
            <div className="mt-4 border-t border-gray-300">
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
          
          <div className="mb-6 text-gray-600 text-center bg-purple-100 p-4 rounded-lg">
            <p>Your performance was better than <span className="font-semibold text-yellow-500">88%</span> of Tech learners who have completed this assessment.</p>
          </div>
          
          <div className="mb-6">
            <a href="#" className="text-yellow-500 underline">What do these numbers mean?</a>
          </div>
          
          <div className="text-gray-700">
            <h3 className="font-semibold">Your answers</h3>
            <p className="text-gray-600">Review your answers. Learn from these explanations of correct and incorrect response options.</p>
          </div>
        </div>
      </div>
    </div>
           
                
           </div>

   
        
    );
};

export default Courses;