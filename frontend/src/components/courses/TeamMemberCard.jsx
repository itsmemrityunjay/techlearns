import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Linkedin } from "lucide-react";
import img from "../../assets/sujal.jpg";
import img1 from "../../assets/riya.jpeg";
import img2 from "../../assets/aryan.jpg";
import img3 from "../../assets/niraj.jpeg";
import img4 from "../../assets/krishna.jpg";
import img5 from "../../assets/aman.jpeg";
import img6 from "../../assets/lalan.jpg";
import img7 from "../../assets/Shital.jpg";
import img8 from "../../assets/NIs-2.jpg";
import img9 from "../../assets/raj.jpg";

const teamMembers = [
  { id: 1, name: "Sujal Kumar", role: "Frontend Developer", bio: "Tech Lead @GDG on Campus SVIET | Fullstack Developer @Godigitify Nexus | Fullstack App Developer | Undergraduate Computer Science and Engineering Student | Aspiring Engineer | Passionate Learner | Innovator I'm an enthusiastic and dedicated student on a journey to becoming a skilled engineer. My curiosity drives me to push boundaries and seek innovative solutions in the ever-evolving tech world. Beyond academics, I embrace hands-on experience, collaboration, and continuous learning to refine both my technical expertise and personal growth. I thrive in environments where challenges spark growth and innovation. Let’s connect and explore opportunities together!", image: img, linkedin: "https://www.linkedin.com/in/kumar-sujal/" },
  { id: 2, name: "Riya Singh", role: "UI/UX Designer", bio: "I am an engineering student currently preparing for Data Structures and Algorithms (DSA). I have experience with React and MongoDB, working on full-stack projects. Additionally, I have design skills in Photoshop and Figma, allowing me to create visually appealing UI/UX designs.", image: img1, linkedin: "https://www.linkedin.com/in/riya-singh-5b71b7248/" },
  { id: 3, name: "Aryan Kamboj", role: "Backend Developer", bio: "Hi, I'm Aryan Kamboj, a CSE student at SVIET , embarking on a journey through the technical world. I thrive on learning and connecting with individuals of diverse mindsets to expand my knowledge and foster growth. Passionate about embracing new technologies and always open to learning.", image: img2, linkedin: "https://www.linkedin.com/in/aryan-kammboz-110521252/" },
  { id: 4, name: "Niraj Gupta", role: "DevOps Engineer", bio: "Ensuring smooth deployments and cloud management.", image: img3, linkedin: "#" },
  { id: 5, name: "Krishna Bansal", role: "Full Stack Developer", bio: "Results-driven Software Developer with experience in full-stack web and mobile development, specializing in MERN Stack, Next.js, and PWA development. Strong problem-solving and analytical skills with expertise in event management, graphic design, and business operations. Proven ability to drive technical solutions, optimize workflows, and manage client projects,", image: img4, linkedin: "#" },
  { id: 6, name: "Aman Gupta", role: "Mobile Developer", bio: "Hi, I'm Aman Gupta, a B.Tech Computer Science student at SVIET College. I'm passionate about graphic designing and web development, with experience in tools like Adobe Photoshop and Canva. I also work on React and React Native projects, and have hands-on experience with Firebase integration. I'm a creative individual always eager to learn and explore new technologies.", image: img5, linkedin: "#" },
  { id: 7, name: "Lalan Chaudry", role: "Quality Analyst", bio: "Ensuring bug-free and high-quality software.", image: img6, linkedin: "#" },
  { id: 8, name: "Shital Kumari", role: "Product Manager", bio: "I'm Shital Kumari, a creative professional passionate about design and development. With expertise in graphic design, web development, and front-end technologies, I specialize in crafting visually compelling and user-friendly digital experiences. As a Graphic Designer at Godigitify Nexus and TechLearns, I focus on creating engaging visual content. Alongside this, my proficiency in HTML, CSS, JavaScript, and the MERN stack enables me to develop seamless and interactive web applications. I am always eager to explore new challenges, collaborate on innovative projects, and contribute to impactful digital solutions. Whether designing captivating visuals or coding responsive interfaces, I strive to bridge creativity with technology to build meaningful experiences.", image: img7, linkedin: "#" },
  { id: 9, name: "Nishant Singh", role: "Cloud Architect", bio: "Designing scalable and secure cloud solutions.", image: img8, linkedin: "#" },
  { id: 10, name: "Raj Chahar", role: "Technical Lead", bio: "Guiding the team to success with tech excellence.", image: img9, linkedin: "#" }
];


export default function TeamShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(2);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setVisibleCards(window.innerWidth < 768 ? 1 : 2);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + visibleCards >= teamMembers.length ? 0 : prev + visibleCards));
  const prevSlide = () => setCurrentIndex((prev) => (prev - visibleCards < 0 ? Math.max(0, teamMembers.length - visibleCards) : prev - visibleCards));

  const visibleMembers = () => teamMembers.slice(currentIndex, currentIndex + visibleCards);

  return (
    <div className="w-full box-border container py-4 m-0 mx-auto">
      <header className="h-20 flex items-center justify-center mb-7 gap-4 md:gap-8">
        <h3 className="text-5xl font-medium text-gray-800 text-center">Team <span className="text-[#47226b]">TeachLearners</span></h3>
      </header>

      <div className="relative" ref={containerRef}>
        <div className="flex md:flex-nowrap sm:flex-wrap flex-wrap gap-x-8 justify-center">
          {visibleMembers().map((member) => (
            <div key={member.id} className="w-full md:w-1/2 mb-8 flex justify-start">
              <div className="flex w-full flex-col lg:flex-row overflow-hidden rounded">
                <div className="w-full overflow-hidden lg:w-2/4 h-80 flex justify-center items-center">
                  <img className="object-cover w-full h-full transition-all rounded-2xl" src={member.image || "/placeholder.svg"} alt={member.name} />
                </div>
                <div className="relative flex self-center h-80 flex-1 p-8 ml-0 lg:w-80 bg-white border rounded-lg lg:items-center lg:-ml-12">
                  <div>
                    <h2 className="mb-2 text-xl font-medium">{member.name}</h2>
                    <p className="mb-4 text-sm">{member.role}</p>
                    <p className="mb-4 text-sm line-clamp-5">{member.bio}</p>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#1C4E81] hover:text-blue-500 text-xl">
                      <Linkedin className="w-6 h-6 mr-2" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <button onClick={prevSlide} className="text-2xl cursor-pointer mr-2" aria-label="Previous slide">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="text-2xl cursor-pointer ml-2" aria-label="Next slide">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
