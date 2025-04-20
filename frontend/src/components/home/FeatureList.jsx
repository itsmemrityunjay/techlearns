"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
// Import new icons - you'll need to add these images to your assets folder
import nepIcon from "../../assets/education-policy.png" // Replace with actual NEP icon
import skillIcon from "../../assets/skill-india.png" // Replace with actual Skill India icon
import coursesIcon from "../../assets/courses-icon.png" // Replace with courses icon

export default function HowItWorksScroll() {
  const [activeStep, setActiveStep] = useState(0)
  const containerRef = useRef(null)
  const stepsRef = useRef([])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Animation values for each step
  const yPositions = [
    useTransform(scrollYProgress, [0, 0.3], [100, 0]),
    useTransform(scrollYProgress, [0.3, 0.6], [100, 0]),
    useTransform(scrollYProgress, [0.6, 0.9], [100, 0])
  ]

  const opacities = [
    useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    useTransform(scrollYProgress, [0.3, 0.5], [0, 1]),
    useTransform(scrollYProgress, [0.6, 0.8], [0, 1])
  ]

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4
      stepsRef.current.forEach((step, index) => {
        if (step && scrollPosition >= step.offsetTop) {
          setActiveStep(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const steps = [
    {
      title: "Aligned with New Education Policy",
      description:
        "Our learning platform is designed in accordance with the New Education Policy 2020, focusing on critical thinking, creativity, and experiential learning for young minds.",
      icon: nepIcon,
      buttonText: "Explore NEP Features",
      buttonLink: "https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf"
    },
    {
      title: "Skill Development for All",
      description:
        "Through hands-on training and real-world projects, we're contributing to Skill India by preparing a workforce equipped with industry-ready technical and soft skills.",
      icon: skillIcon,
      buttonText: "Discover Skill India Programs",
      buttonLink: "https://www.skillindiadigital.gov.in/home"
    },
    {
      title: "Empowering with Courses",
      description:
        "Access our curated collection of courses designed to build practical skills and foster innovation. Learn at your own pace with interactive content and expert guidance.",
      icon: coursesIcon,
      buttonText: "Browse Our Courses",
      buttonLink: "/course"
    }
  ]

  return (
    <div className="font-sans">
      {/* Steps Section */}
      <section ref={containerRef} className="py-16 relative">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Vertical connecting line */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-gray-200 transform -translate-x-1/2">
              <motion.div
                className="w-full bg-[#ffaa00] origin-top h-full"
                style={{ scaleY: lineHeight }}
                initial={{ scaleY: 0 }}
                transition={{ duration: 0.8 }}
              />
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                ref={el => stepsRef.current[index] = el}
                className={`flex flex-col md:flex-row items-center ${index !== steps.length - 1 ? 'mb-24' : ''}`}
              >
                {/* Image (alternates sides) */}
                <motion.div
                  className={`w-full md:w-1/2 mb-8 md:mb-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:order-2'}`}
                  style={{
                    y: yPositions[index],
                    opacity: opacities[index]
                  }}
                >
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="mx-auto max-h-64 object-contain"
                  />
                </motion.div>

                {/* Content (alternates sides) */}
                <motion.div
                  className={`w-full md:w-1/2 relative ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 md:order-1'}`}
                  initial={{ opacity: 0, x: index % 2 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Step indicator dot */}
                  <div className={`absolute ${index % 2 === 0 ? '-left-16' : '-right-10'} top-1/2 transform -translate-y-1/2`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeStep >= index ? 'bg-[#ffaa00]' : 'bg-gray-200'}`}>
                      <span className="text-white font-semibold text-sm">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`p-8 rounded-lg shadow-md transition-all duration-300 ${activeStep >= index ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className={`font-semibold mb-2 ${activeStep >= index ? 'text-black' : 'text-gray-500'}`}>
                      0{index + 1}
                    </div>
                    <h3 className={`text-xl font-medium mb-2 ${activeStep >= index ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </h3>
                    <p className={`${activeStep >= index ? 'text-gray-600' : 'text-gray-400'} mb-5`}>
                      {step.description}
                    </p>

                    {/* Added CTA Button */}
                    <a
                      href={step.buttonLink}
                      className={`inline-block px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 ${index === 0 ? 'bg-blue-600 hover:bg-blue-700' :
                        index === 1 ? 'bg-[#FF7722] hover:bg-[#E05500]' :
                          'bg-[--primary-color] hover:bg-[--secondary-color]'
                        }`}
                    >
                      {step.buttonText}
                    </a>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}