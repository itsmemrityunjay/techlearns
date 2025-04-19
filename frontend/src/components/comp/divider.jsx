import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const LearnAndGrow = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-[100px] mb-8 w-full">
      <div className="container mx-auto">
        <a
          href="/mentors"
          role="button"
          tabIndex="0"
          className="flex flex-col md:flex-row border border-gray-300 rounded-lg overflow-hidden shadow-sm cursor-pointer"
        >
          {/* Left Section - Image */}
          <div className="md:w-1/2">
            <img
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/6777635184593_learn.png?d=882x411"
              alt="Skills Image"
              width={584}
              height={272}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Section - Content */}
          <div className="md:w-1/2 p-6 flex flex-col justify-center gap-4">
            <div>
              <h2 className="text-[24px] md:text-[28px] font-bold leading-tight">
                <strong>Learn &amp;</strong> Level Up Your Skills
              </h2>
              <p className="text-gray-600 text-[15px] mt-2">
                Select from a wide range of courses to upskill and advance your career!
              </p>
            </div>

            {/* Features List */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2 m-2 text-[15px] text-gray-800 mt-2">

              {[
                '50+ Courses',
                'Certificate',
                'Projects & Assignments',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <img
                    src="https://d8it4huxumps7.cloudfront.net/uploads/images/65672c6dc634f_subway_tick.svg"
                    width={12}
                    height={12}
                    alt="Tick Icon"
                    loading="lazy"
                    className='bg-yellow-500 rounded-3xl w-3 h-3'
                  />
                  {item}
                </li>
              ))}
            </ul>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate('/mentors')} // Update this path to match your mentor route
              className="w-fit mt-4 px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition-all duration-200"
            >
              <span>Meet Our Mentors</span>
              {/* <Users className="w-5 h-5" /> */}
            </motion.button>
          </div>
        </a>
      </div>
    </section>
  );
};

export default LearnAndGrow;
