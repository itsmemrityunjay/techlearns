import React, { useState, useEffect } from "react";
import { db } from "../../database/Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import FlagIcon from "@mui/icons-material/Flag";
import gradiantimg from "../../components/comp/orangegradiant.jpg"
const TechGetStarted = () => {
  const [competitions, setCompetitions] = useState([]);

  // Fetch recent competitions from Firestore
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        // Get the most recent 3 competitions
        const competitionsRef = collection(db, "competitions");
        const recentCompetitionsQuery = query(
          competitionsRef,
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(recentCompetitionsQuery);
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

  return (
    <div className="container mx-auto py-8">
      <div className="py-8]">
        {/* Header with flag icon */}
        <div className="mb-4 flex justify-between items-center w-[97%] ml-4">
          <div className="flex items-center ml-16">
            <FlagIcon className="text-lg mr-2" />
            <h2 className="text-lg font-semibold">Get Started</h2>
          </div>
          <a
            href="#"
            className="mr-12 text-sm text-blue-500 hover:bg-gray-900 hover:text-white px-2 py-1 rounded transition-colors duration-200"
          >
            See all
          </a>
        </div>
        <div className="">
        <div className="w-full h-full flex flex-col items-center justify-center text-center mt-8"
  style={{
    // width: "100%",
    textAlign: "center", // Ensures text within the div is centered
    display: "flex",
    // flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <h3 className="text-2xl font-bold secondary-text mb-4">New to TechLearns?</h3>
  <p className="mb-8 text-lg text-gray-500 w-2/3 text-center">
  TechLearns offers a variety of beginner-friendly competitions designed to help you learn data science and machine learning through hands-on experience. Join today, improve your skills, and tackle real-world challenges with the support of a global community.
  </p>
</div>
          <br />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 col-span-3">
  {competitions.map((comp, index) => (
    <div
      key={index}
      className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 w-96 mx-auto" // Increased width to w-96
      style={{
        borderRadius: "15px",
        position: "relative",
      }}
    >
      {/* Card Content */}
      <div className="p-4" style={{
        backgroundImage: `url(${gradiantimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        {/* Image positioned in the left corner */}
        <img
          src={comp.icon}
          alt={comp.title}
          className="absolute top-4 left-4 w-12 h-12 rounded-full border-2 border-white shadow-lg"
        />
        <div className="ml-16 mt-4">
          {/* Title with ellipsis if it overflows */}
          <h4
            className="text-lg font-semibold mb-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
            style={{
              fontFamily: '"Raleway", sans-serif',
              whiteSpace: "nowrap",   // Prevent wrapping of text
              overflow: "hidden",     // Hide overflowing text
              textOverflow: "ellipsis", // Add ellipsis when text overflows
            }}
          >
            {comp.title}
          </h4>
          {/* Description */}
          <p
            className="text-sm text-gray-600 mb-4"
            style={{ fontFamily: '"Raleway", sans-serif' }}
          >
            {comp.description}
          </p>
          {/* Status and Prize Information */}
          <div className="flex justify-start items-center text-sm text-gray-500 mb-2">
            <span
              className="bg-green-100 text-green-600 px-2 py-1 rounded-full hover:text-orange-500 transition-colors duration-200"
              style={{ fontFamily: '"Raleway", sans-serif' }}
            >
              {comp.status}
            </span>
            <span
              className="ml-24 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full hover:text-orange-500 transition-colors duration-200"
              style={{ fontFamily: '"Raleway", sans-serif' }}
            >
              {comp.status}
            </span>
          </div>
          {/* Prize Pool Information */}
          <div className="flex justify-start gap-32 items-center pt-2 border-t border-gray-200">
            <span
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
              style={{ fontFamily: '"Raleway", sans-serif', marginLeft: "5px" }}
            >
              {comp.prizePool}
            </span>
            <span
              className=" text-sm text-green-500 hover:text-orange-500 transition-colors duration-200"
              style={{ fontFamily: '"Raleway", sans-serif',marginLeft:"19px"}}
            >
              {comp.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>



        </div>
      </div>
    </div>
  );
};

export default TechGetStarted;
