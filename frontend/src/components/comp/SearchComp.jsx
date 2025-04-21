import React, { useState, useEffect } from "react";
import { db } from "../../database/Firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
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
import UpgradeButton from "../../components/comp/compComponent";
import CourseBanner from "./divider";
import Footer from '../comp/footer';

const filters = [
  {
    title: "All Competitions",
    description: "Everything, past & present",
    icon: <List />,
  },
  {
    title: "Featured",
    description: "Premier challenges with prizes",
    icon: <StarBorder />,
  },
  {
    title: "Getting Started",
    description: "Approachable ML fundamentals",
    icon: <Flag />,
  },
  {
    title: "Research",
    description: "Scientific and scholarly challenges",
    icon: <Science />,
  },
  {
    title: "Data Science",
    description: "Created by fellow Kagglers",
    icon: <People />,
  },
  {
    title: "AI",
    description: "Fun practice problems",
    icon: <Celebration />,
  },
  {
    title: "Simulations",
    description: "Train bots to navigate environments",
    icon: <SmartToy />,
  },
  {
    title: "Analytics",
    description: "Open-ended explorations",
    icon: <BarChart />,
  },
  {
    title: "Machine Learning",
    description: "Open-ended explorations",
    icon: <BarChart />,
  },
];

const Searchbar = () => {
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Competitions");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "competitions"));
        const competitionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompetitions(competitionsData);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };
    fetchCompetitions();
  }, []);

  const navigate = useNavigate();

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch =
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeFilter) {
      case "All Competitions":
        return matchesSearch && comp.status !== "pending";
      case "Featured":
        return matchesSearch && comp.isFeatured;
      case "Getting Started":
        return matchesSearch && comp.type === "Getting Started" && comp.status !== "pending";
      case "Research":
        return matchesSearch && comp.type === "research" && comp.status !== "pending";
      case "Data Science":
        return matchesSearch && comp.type === "data-science" && comp.status !== "pending";
      case "AI":
        return matchesSearch && comp.type === "ai" && comp.status !== "pending";
      case "Machine Learning":
        return matchesSearch && comp.type === "machine-learning" && comp.status !== "pending";
      case "Simulation":
        return matchesSearch && comp.type === "simulation" && comp.status !== "pending";
      case "Analytics":
        return matchesSearch && comp.type === "analytics" && comp.status !== "pending";
      default:
        return false;
    }
  });

  return (
    <div className="container mx-auto ">
      <div className="flex flex-col items-center bg-white-100">
        {/* Search & Filter */}
        <div className="rounded-lg p-4 mb-6 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="flex items-center w-full lg:w-auto">
              <span className="text-[--secondary-color] mr-4">
                <Search size={28} />
              </span>
              <input
                type="text"
                placeholder="Search competitions"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchActive(e.target.value.trim() !== "");
                  setShowFilters(e.target.value.trim() === "");
                }}
                className="flex-1 h-12 border border-[--secondary-color] focus:border-none rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[--primary-color] w-full"
              />
            </div>

            {/* Filter Button */}
            <button
              className="flex items-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 h-12 w-full lg:w-auto justify-center"
              style={{ borderColor: "#003656" }}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <FilterList className="secondary-text" />
              <span className="ml-2 secondary-text">Filters</span>
            </button>
          </div>
        </div>

        {/* Filters & Image Section */}
        <div className="flex flex-col-reverse lg:flex-row items-start justify-between w-full gap-8">
          {/* Filter Section */}
          {showFilters && (
            // Parent container
            <div className="relative w-full group">
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                onClick={() => {
                  const container = document.querySelector('.scroll-container');
                  container.scrollBy({ left: -200, behavior: 'smooth' });
                }}
                style={{ left: '10px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                onClick={() => {
                  const container = document.querySelector('.scroll-container');
                  container.scrollBy({ left: 200, behavior: 'smooth' });
                }}
                style={{ right: '10px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              <div
                className="w-full overflow-x-auto scroll-container [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]"
                style={{ scrollBehavior: 'smooth' }}
              >
                <div className="flex flex-nowrap gap-4 pb-2">
                  {filters.map((filter, index) => (
                    <div
                      key={filter.title}
                      className="flex items-center gap-2 flex-shrink-0 border-2 border-gray-200 hover:border-black rounded-2xl w-60 cursor-pointer p-2"
                      onClick={() => setActiveFilter(filter.title)}
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full  ${activeFilter === filter.title
                          ? "bg-white text-[--primary-color]"
                          : ""
                          }`}
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#D9F1FF"
                              : index === 1
                                ? "#FFD9EC"
                                : index === 2
                                  ? "#E6D9FF"
                                  : index === 3
                                    ? "#FFF9D9"
                                    : "#FFEAD9",
                        }}
                      >
                        {filter.icon}
                      </div>
                      <span
                        className={`${activeFilter === filter.title
                          ? "text-black"
                          : "text-gray-400"
                          } whitespace-nowrap`}
                        style={{ fontSize: "14px" }}
                      >
                        {filter.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



          <div
            className={`w-full lg:w-1/2 flex justify-center lg:justify-end ${showFilters ? "block" : "hidden"}`}
          >
            <img
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/66a3829b1d2da_jobs_internships.png?d=996x803"
              alt="Right Side Image"
              className="w-full h-auto rounded-lg max-w-sm lg:max-w-full"
            />
          </div>
        </div>

        {/* Competitions Grid */}
        <div className="w-full mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompetitions.map((comp) => (
              <div
                key={comp.id}
                className="w-full border border-gray-200 hover:border-gray-700 hover:text-blue-800 bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300"
                onClick={() => navigate(`/competition/${comp.id}`)}
              >
                <div>
                  <img
                    src={comp.icon || "https://via.placeholder.com/300x200"}
                    alt={comp.title || "Competition"}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {comp.title || "Untitled Competition"}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      {comp.subtitle
                        ? comp.subtitle.split(" ").slice(0, 15).join(" ") +
                        (comp.subtitle.split(" ").length > 25 ? "..." : "")
                        : "No description available."}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center bg-orange-50 text-gray-800 rounded-lg justify-between px-4 py-2 shadow-sm text-sm">
                      <span className="font-semibold">Start Date:</span>
                      <span>{comp.startDate}</span>
                    </div>
                    <div className="flex items-center bg-yellow-50 text-gray-800 rounded-lg justify-between px-4 py-2 shadow-sm text-sm">
                      <span className="font-semibold">End Date:</span>
                      <span>{comp.endDate}</span>
                    </div>
                    <div className="flex items-center bg-purple-50 text-gray-800 rounded-lg justify-between px-4 py-2 shadow-sm text-sm">
                      <span className="font-semibold">Who Can Join:</span>
                      <span>{comp.whoCanJoin}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banners and Footer */}
        <div className="w-full mt-12">
          <CourseBanner />
        </div>

        <div className="w-full mt-8">
          <Footer />
        </div>
      </div>
    </div>

  );
};

export default Searchbar;
