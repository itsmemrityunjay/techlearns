"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import sign from "../../assets/sign.svg"
import signup from "../../assets/signup.png"
import vote from "../../assets/votes.png"

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
      title: "Open free account",
      description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
      icon: signup
    },
    {
      title: "Submit your design",
      description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
      icon: sign
    },
    {
      title: "Grow in the community",
      description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
      icon: vote
    }
  ]

  return (
    <div className="font-sans">
      {/* Steps Section */}
      <section ref={containerRef} className="py-16 relative">
        <div className="container mx-auto px-4">
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
                  className={`w-full md:w-1/2  mb-8 md:mb-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:order-2'}`}
                  style={{
                    y: yPositions[index],
                    opacity: opacities[index]
                  }}
                >
                  <img
                    src={step.icon}
                    alt={step.title}
               
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
                    <p className={`${activeStep >= index ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer remains the same */}
    </div>
  )
}