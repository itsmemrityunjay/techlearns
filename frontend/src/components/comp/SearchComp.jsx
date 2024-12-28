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
  BorderColor,
} from "@mui/icons-material";
import gradiantimg from "../../components/comp/gradiant.jpg";
import UpgradeButton from "../../components/comp/compComponent";
import CourseBanner from "./divider";
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
    title: "Community",
    description: "Created by fellow Kagglers",
    icon: <People />,
  },
  {
    title: "Playground",
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
];

const Searchbar = () => {
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Competitions");

  // Fetch competitions from Firestore
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
  // Filter and Search Logic
  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch =
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeFilter) {
      case "All Competitions":
        return matchesSearch;
      case "Featured":
        return matchesSearch && comp.isFeatured;
      case "Getting Started":
        return matchesSearch && comp.type === "ml-fundamentals";
      default:
        return false;
    }
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center bg-white-100">
        {/* Search Bar */}
        <div className="rounded-lg p-4 mb-6 w-[100%]">
          <div className="flex items-center mb-4">
            <span className="text-[--secondary-color] mr-2">
              <Search />
            </span>
            <input
              type="text"
              placeholder="Search competitions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-[--secondary-color] rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           
            <button
              className="flex items-center ml-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
              style={{ borderColor: "#003656" }}
            >
              <FilterList className="secondary-text" />
              <span className="ml-1 secondary-text">Filters</span>
            </button>
          </div>
        </div>
<div className="lg:w[97%] flex flex-col lg:flex-row items-start justify-between gap-8 ">
  {/* Left Side - Buttons */}
  <div className="flex flex-col w-full lg:w-2/3 gap-6">
    <UpgradeButton />

    {/* Filter Buttons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
      {filters.map((filter, index) => (
        <button
          key={index}
          className={`flex items-center p-4 border rounded-full shadow-sm relative gap-4 ${
            activeFilter === filter.title
              ? "bg-[--primary-color] text-white font-bold border-none"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilter(filter.title)}
        >
          {/* Icon Container with unique background color */}
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-full ${
              activeFilter === filter.title
                ? "bg-white text-[--primary-color]"
                : ""
            }`}
            style={{
              backgroundColor:
                index === 0
                  ? "#D9F1FF" // Light Blue
                  : index === 1
                  ? "#FFD9EC" // Light Pink
                  : index === 2
                  ? "#E6D9FF" // Light Purple
                  : index === 3
                  ? "#FFF9D9" // Light Yellow
                  : "#FFEAD9", // Light Orange
            }}
          >
            {filter.icon}
          </div>

          {/* Title */}
          <span
            className={`${
              activeFilter === filter.title ? "text-white" : "text-gray-800"
            }`}
            style={{ fontSize: "19px", fontFamily: "raleway" }}
          >
            {filter.title}
          </span>
        </button>
      ))}
    </div>
  </div>

  {/* Right Side - Image */}
  <div className="w-full lg:w-1/2 flex justify-center lg:justify-end ">
    <img
      src="https://d8it4huxumps7.cloudfront.net/uploads/images/66a3829b1d2da_jobs_internships.png?d=996x803"
      alt="Right Side Image"
      className="max-w-full h-auto rounded-lg"
    />
  </div>
</div>

        {/* Display Filtered Competitions */}
        <div className="w-full h-[500px] mt-5">
          <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCompetitions.map((comp, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-md cursor-pointer flex flex-col justify-between mt-5"
                // style={{ backgroundColor: comp.bgColor || "#f8f9fa" }} // Default background color
                onClick={() => navigate(`/competition/${comp.id}`)}
                style={{
                  backgroundImage: `url(${gradiantimg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Image in a small circle */}
                <div className="flex items-center mb-4">
                  <img
                    src={comp.icon || "https://via.placeholder.com/50"} // Default placeholder
                    alt={comp.title}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <p className="ml-3 text-sm uppercase opacity-80">
                    {comp.category || "Strategy"}
                  </p>
                </div>

                {/* Title and description */}
                <h3 className="text-lg font-semibold mt-2 line-clamp-1">
                  {comp.title}
                </h3>
                <p className="text-sm mt-1">{comp.description}</p>

                {/* Footer with duration and returns */}
                <div className="mt-4">
                  <p className="text-sm opacity-70">
                    {comp.duration || "3 yrs CAGR"}
                  </p>
                  <h2 className="text-xl font-bold">
                    {comp.returns || "7.20%"}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CourseBanner/>
      </div>
    </div>
  );
};

export default Searchbar;
