import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../database/Firebase";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { useAuth } from "../../database/AuthContext"; // Assume this provides the current user's info
import faqimg from "../comp/faq.png";
import CourseBanner from "./divider";
import herocompetition from "../comp/herocompetition.jpg";
import divider2 from "../comp/divider2.jpg";
import DynamicTimeline from "./DynamicTimeline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonIcon from "@mui/icons-material/Person";
import Footer from "./footer";
const faqs = [
  {
    question: "What is a Getting Started competition?",
    answer: `Getting Started competitions were created by Kaggle data scientists for people who have little to no machine learning background. They are a great place to begin if you are new to data science or just finished a MOOC and want to get involved in Kaggle.

            Getting Started competitions are a non-competitive way to get familiar with Kaggle’s platform, learn basic machine learning concepts, and start meeting people in the community. They have no cash prize and are on a rolling timeline.`,
  },
  {
    question: "How do I create and manage a team?",
    answer: `When you accept the competition rules, a team will be created for you. You can invite others to your team, accept a merger with another team, and update basic information like team name by going to the More > Team page.

            We've heard from many Kagglers that teaming up is the best way to learn new skills AND have fun. If you don't have a teammate already, consider asking if anyone wants to team up in the discussion forum.`,
  },
  {
    question: "What are Notebooks?",
    answer: `Kaggle Notebooks is a cloud computational environment that enables reproducible and collaborative analysis. Notebooks support scripts in Python and R, Jupyter Notebooks, and RMarkdown reports. You can visit the Notebooks tab to view all of the publicly shared code for the Titanic competition. For more on how to use Notebooks to learn data science, check out our Courses!`,
  },
  {
    question: "Why did my team disappear from the leaderboard?",
    answer: `To keep with the spirit of getting-started competitions, we have implemented a two month rolling window on submissions. Once a submission is more than two months old, it will be invalidated and no longer count towards the leaderboard.

            If your team has no submissions in the previous two months, the team will also drop from the leaderboard. This will keep the leaderboard at a manageable size, freshen it up, and prevent newcomers from getting lost in a sea of abandoned scores.`,
  },
  {
    question: "How do I contact Support?",
    answer: `Kaggle does not have a dedicated support team so you’ll typically find that you receive a response more quickly by asking your question in the appropriate forum. (For this competition, you’ll want to use the Titanic discussion forum).

            Support is only able to help with issues that are being experienced by all participants. Before contacting support, please check the discussion forum for information on your problem. If you can’t find it, you can post your problem in the forum so a fellow participant or a Kaggle team member can provide help. The forums are full of useful information on the data, metric, and different approaches. We encourage you to use the forums often. If you share your knowledge, you'll find that others will share a lot in turn!`,
  },
];

function CompDetail() {
  const { id } = useParams();
  const [compData, setCompData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { currentUser } = useAuth(); // Assuming `useAuth` provides the current user's data

  useEffect(() => {
    const fetchCompData = async () => {
      try {
        const compDoc = await getDoc(doc(collection(db, "competitions"), id));
        if (compDoc.exists()) {
          const data = compDoc.data();
          setCompData(data);

          // Check if the user is already registered
          if (data.registeredUsers?.includes(currentUser.email)) {
            setIsRegistered(true);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching competition data:", error);
      }
    };
    fetchCompData();
  }, [id, currentUser.email]);

  const handleJoinCompetition = async () => {
    try {
      await updateDoc(doc(db, "competitions", id), {
        registeredUsers: arrayUnion(currentUser.email),
      });
      setIsRegistered(true); // Update UI to show Submit button
    } catch (error) {
      console.error("Error registering for competition:", error);
    }
  };

  if (!compData)
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots color="#003656" height={80} width={80} />
      </div>
    );

  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="flex-grow">
          <div className=" justify-between items-start">
            {/* hero section */}
            {/* <div className='mt-12' style={{
                                backgroundImage:`url(${herocompetition})`,
                                backgroundSize: "contain", // Ensures the whole image is visible
                                backgroundRepeat: "no-repeat", // Prevents tiling of the image
                                backgroundPosition: "center",
                                height: "450px",
                                width:'100%',
                                                    
                            }}>
                            </div> */}
            {/* Left Section */}
            <div
              className="relative bg-cover bg-center rounded-lg shadow-lg p-6 w-full h-[45vh] transition-transform hover:scale-105"
              style={{
                backgroundImage: `url(${compData.icon || compData.imageUrl})`,
              }}
            >
              {/* Dark overlay for text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 rounded-lg"></div>

              {/* Content */}
              <div className="relative flex flex-col justify-center items-center gap-y-6 text-white h-full">
                {/* Title and Subtitle */}
                <div className="text-center">
                  <h1 className="font-extrabold text-2xl md:text-3xl tracking-wide mb-2">
                    {compData.title}
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base">
                    {compData.subtitle || compData.description}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col items-center space-y-4">
                  {!isRegistered ? (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200"
                      onClick={handleJoinCompetition}
                    >
                      Join Competition
                    </button>
                  ) : (
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200">
                      Submit Entry
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section (Competition Details) */}
            <div className="p-6 rounded-lg bg-white mb-5 mt-12 sm:mt-8 md:mt-12 w-full">
              {/* Flex container for rows */}
              <div className="flex lg:flex-nowrap flex-wrap gap-6 mt-4 ">
                {/* Box 1 */}
                <div className="flex w-1/2 mb-4">
                  <div className="h-16 w-16 bg-[#ffead9] rounded-lg mt-1 flex justify-center items-center sm:h-14 sm:w-14">
                    <PersonIcon
                      className="text-black"
                      style={{ fontSize: "28px" }}
                    />
                  </div>
                  <div className="ml-4">
                    <Typography
                      variant="h6"
                      className="font-bold text-black pb-2 lg:text-lg sm:text-sm "
                    >
                      Competition Host
                    </Typography>
                    <Typography className="text-black mt-1 text-sm">
                      {compData.author}
                    </Typography>
                  </div>
                </div>

                {/* Box 2 */}
                <div className="flex w-1/2 mb-4">
                  <div
                    style={{
                      height: "60px",
                      width: "60px",
                      backgroundColor: "#ffd9ec",
                      borderRadius: "10px",
                      marginTop: "2px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MonetizationOnIcon
                      style={{ color: "black", fontSize: "32px" }}
                    />
                  </div>
                  <div className="ml-4">
                    <Typography
                      variant="h6"
                      className="font-bold text-black pb-2"
                    >
                      Prizes & Awards
                    </Typography>
                    <Typography className="text-black mt-2 sm:mt-4">
                      {compData.prizePool || compData.prizes}
                    </Typography>
                  </div>
                </div>

                {/* Box 3 */}
                <div className="flex w-1/2 mb-4">
                  <div
                    style={{
                      height: "60px",
                      width: "60px",
                      backgroundColor: "#e6d9ff",
                      borderRadius: "10px",
                      marginTop: "2px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <HowToRegIcon
                      style={{ color: "black", fontSize: "32px" }}
                    />
                  </div>
                  <div className="ml-4">
                    <Typography
                      variant="h6"
                      className="font-bold text-black pb-2"
                    >
                      Who Can Join
                    </Typography>
                    <Typography className="text-black mt-2 sm:mt-4">
                      {compData.whoCanJoin || "N/A"}
                    </Typography>
                  </div>
                </div>

                {/* Box 4 */}
                <div className="flex w-1/2 mb-4">
                  <div
                    style={{
                      height: "60px",
                      width: "60px",
                      backgroundColor: "#fff9d9",
                      borderRadius: "10px",
                      marginTop: "2px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AssessmentIcon
                      style={{ color: "black", fontSize: "32px" }}
                    />
                  </div>
                  <div className="ml-4">
                    <Typography
                      variant="h6"
                      className="font-bold text-black pb-2"
                    >
                      Status
                    </Typography>
                    <Typography className="text-black mt-4 sm:mt-6">
                      {compData.status || "N/A"}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          {/* <div className="mb-24 mt-12 w-full">
                        <Typography variant="h6" className="font-bold mb-2 text-center secondary-text">Overview</Typography>
                        <Typography className="text-gray-600 leading-relaxed text-center secondary-text">{compData.subtitle}</Typography>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <Typography variant="subtitle2" className="text-gray-500 font-bold">Start</Typography>
                                <Typography>{compData.startDate}</Typography>
                            </div>
                            <LinearProgress
                                variant="determinate"
                                value={compData.progress ?? 0}
                                className="flex-grow h-2 mx-5"
                                color="primary"
                            />
                            <div>
                                <Typography variant="subtitle2" className="text-gray-500 font-bold">Close</Typography>
                                <Typography>{compData.endDate}</Typography>
                            </div>
                        </div>
                    </div> */}

          {/*  */}
          <DynamicTimeline />
          {/* divider competition */}
          <div
            style={{
              backgroundImage: `url(${divider2})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "450px",
              width: "100%",
            }}
          >
           
          </div>

          {/* FAQ Section */}
          <div className="bg-transparent p-6 mb-4">
            <div className="flex justify-center items-center w-full">
              <img src={faqimg} alt="FAQ Image" className="w-126 h-auto" />
            </div>
            <div className="text-3xl font-bold mb-4 text-purple-950 text-center">
              Frequently Asked Questions
            </div>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="collapse border border-purple-600 mb-4 hover:text-white hover:bg-purple-100"
              >
                <input type="checkbox" />
                <div
                  className="collapse-title text-lg font-semibold text-gray-800 px-4 py-2 ml-8 mt-4 "
                  style={{}}
                >
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p className="text-gray-600 ml-8 w-11/12">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {compData.tags && compData.tags.length > 0 && (
            <div className="flex space-x-2 mb-5">
              {compData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  className="bg-blue-200 text-blue-800"
                />
              ))}
            </div>
          )}
          <Divider />
        </div>
      </div>
    </div>
  );
}

export default CompDetail;
