"use client"

import { useState } from "react"
import LearnerImg from "../../assets/learners-illo_light.svg"
import DeveloperImg from "../../assets/developers-illo_light.svg"
import ResearcherImg from "../../assets/researchers-illo_light.svg"

// Data for the three user types
const data = [
  {
    id: "learners",
    title: "Students",
    description: "Explore engaging courses, live sessions, and community support.",
    imgSrc: LearnerImg,
    keyFeatures: [
      { label: "Beginner-friendly courses", icon: "😊", link: "/courses?level=beginner" },
      { label: "Interactive workshops", icon: "🎓", link: "/workshops" },
      { label: "Community forums", icon: "💬", link: "/forums" },
    ],
  },
  {
    id: "developers",
    title: "Developers",
    description: "Access advanced tutorials, coding challenges, and open projects.",
    imgSrc: DeveloperImg,
    keyFeatures: [
      { label: "Open-source projects", icon: "💻", link: "/projects" },
      { label: "Code challenges", icon: "⚡", link: "/challenges" },
      { label: "Developer community", icon: "👥", link: "/community/developers" },
    ],
  },
  {
    id: "professionals",
    title: "Professionals",
    description: "Boost your career with certifications and industry-specific courses.",
    imgSrc: ResearcherImg,
    keyFeatures: [
      { label: "Certifications", icon: "🏆", link: "/certifications" },
      { label: "Career development resources", icon: "📈", link: "/resources" },
      { label: "Advanced courses", icon: "💡", link: "/courses/advanced" },
    ],
  },
]

// Component for each user type section
const UserTypeSection = ({ title, description, imgSrc, keyFeatures, showFeatures }) => (
  <div className="flex flex-col">
    <div className="flex items-start gap-4">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-base-content/70">{description}</p>
      </div>
      <img src={imgSrc || "/placeholder.svg"} alt={title} width="80" height="80" className="flex-shrink-0" />
    </div>

    {showFeatures && (
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3">Key Features</h4>
        <ul className="menu menu-sm p-0">
          {keyFeatures.map((feature, index) => (
            <li key={index}>
              <a href={feature.link} className="py-2 px-0 hover:bg-transparent text-base">
                <span className="text-primary text-xl">{feature.icon}</span>
                {feature.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

// Main component
const WhosTechlearner = () => {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="py-12 bg-base-100">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold mb-10 text-black">Who's on Techlearns?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {data.map((item) => (
            <UserTypeSection
              key={item.id}
              title={item.title}
              description={item.description}
              imgSrc={item.imgSrc}
              keyFeatures={item.keyFeatures}
              showFeatures={showMore}
            />
          ))}
        </div>

        <div className="mt-8">
          <button
  className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 transition duration-300 hover:bg-gray-100"
  onClick={() => setShowMore(!showMore)}
>
  {showMore ? (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      See less
    </>
  ) : (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      See more
    </>
  )}
</button>

        </div>
      </div>
    </div>
  )
}

export default WhosTechlearner