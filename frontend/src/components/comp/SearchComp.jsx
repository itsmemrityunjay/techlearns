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
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center bg-white-100">
        <div className="rounded-lg p-4 mb-6 w-[100%]">
          <div className="flex items-center mb-4">
            <span className="text-[--secondary-color] mr-6 ">
              <Search size={32} />
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
              className="flex-1 h-14 border border-[--secondary-color] focus:border-none rounded-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[--primary-color]"
            />
            <button
              className="flex items-center ml-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 h-14"
              style={{ borderColor: "#003656" }}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <FilterList className="secondary-text" />
              <span className="ml-1 secondary-text">Filters</span>
            </button>
          </div>
        </div>
        <div className="lg:w[97%] flex flex-col lg:flex-row items-start justify-between gap-8">
          {showFilters && (
            <div className="flex flex-col w-full lg:w-2/3 gap-6">
              <UpgradeButton />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6 ">
                {filters.map((filter, index) => (
                  <button
                    key={index}
                    className={`flex items-center p-4 border rounded-full shadow-sm relative gap-4 ${activeFilter === filter.title
                      ? "bg-[--primary-color] text-white font-bold border-none"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                      }`}
                    onClick={() => setActiveFilter(filter.title)}
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full ${activeFilter === filter.title
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
                        ? "text-white"
                        : "text-gray-800"
                        }`}
                      style={{ fontSize: "19px", fontFamily: "raleway" }}
                    >
                      {filter.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className={`w-full lg:w-1/2 flex justify-center lg:justify-end ${showFilters ? "block" : "hidden"
            }`}>
            <img
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/66a3829b1d2da_jobs_internships.png?d=996x803"
              alt="Right Side Image"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div className="w-full mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCompetitions.map((comp) => (
              <div
                key={comp.id}
                className="mt-8 w-full border border-gray-200 hover:border-gray-700 hover:text-blue-800 bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                onClick={() => navigate(`/competition/${comp.id}`)}
              >
                <div className="">
                  <img
                    src={comp.icon || "https://via.placeholder.com/300x200"}
                    alt={comp.title || "Competition"}
                    className="w-full h-24 object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div >
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center bg-orange-50 text-gray-800 rounded-lg w-full justify-between px-4 py-2 shadow-sm">
                      <span className="font-semibold mr-2 text-sm">Start Date:</span>
                      <span className="text-sm">{comp.startDate}</span>
                    </div>
                    <div className="flex items-center bg-yellow-50 text-gray-800 rounded-lg w-full justify-between px-4 py-2 shadow-sm">
                      <span className="font-semibold mr-2 text-sm">End Date:</span>
                      <span className="text-sm">{comp.endDate}</span>
                    </div>
                    <div className="flex items-center bg-purple-50 text-gray-800 rounded-lg w-full justify-between px-4 py-2 shadow-sm">
                      <span className="font-semibold mr-2 text-sm">Who Can Join:</span>
                      <span className="text-sm">{comp.whoCanJoin}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CourseBanner />
        {/* <Footer/> */}
      </div>
    </div>
  );
};

export default Searchbar;
