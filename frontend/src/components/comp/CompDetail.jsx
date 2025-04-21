import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Divider,
  Chip,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Accordion, AccordionSummary, AccordionDetails,
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
import CalendarDays from '@mui/icons-material/CalendarToday';
import Clock from '@mui/icons-material/AccessTime';
import Trophy from '@mui/icons-material/EmojiEvents';
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from "./footer";
import logo from "../../assets/Logo.png"
import { toast } from "react-toastify";
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
    answer: 'Kaggle Notebooks is a cloud computational environment that enables reproducible and collaborative analysis. Notebooks support scripts in Python and R, Jupyter Notebooks, and RMarkdown reports. You can visit the Notebooks tab to view all of the publicly shared code for the Titanic competition. For more on how to use Notebooks to learn data science, check out our Courses!',
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
  const { currentUser } = useAuth(); // Assuming useAuth provides the current user's data

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

  // Modify the handleJoinCompetition function
  const handleJoinCompetition = async () => {
    try {
      // 1. Update the competition document
      await updateDoc(doc(db, "competitions", id), {
        registeredUsers: arrayUnion(currentUser.email),
      });

      // 2. Update the user document
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        competitions: arrayUnion({
          id: id,
          title: compData.title,
          icon: compData.icon || compData.imageUrl,
          activity: "joined",
          timestamp: new Date(),
          status: "active"
        })
      });

      setIsRegistered(true);
      toast.success("Successfully joined competition!");
    } catch (error) {
      console.error("Error registering for competition:", error);
      toast.error("Failed to join competition. Please try again.");
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
          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="flex flex-col justify-center">
              <Badge className="w-fit mb-4" variant="outline">
                Open for Registration
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{compData.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">
                {compData.subtitle || compData.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isRegistered ? (
                  <Button
                    size="lg"
                    sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } }}
                    variant="contained"
                    className="w-full sm:w-auto" onClick={handleJoinCompetition}
                  >
                    Join Competition
                  </Button>) : (
                  <Button
                    size="lg"
                    sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } }}
                    variant="contained"
                    className="w-full sm:w-auto"
                  >
                    Submit
                  </Button>)}

                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative rounded-3xl flex justify-center items-center overflow-hidden min-h-[200px] max-h-[400px]">
              <img src={compData.icon || compData.imageUrl} alt={compData.title} fill className="object-cover h-auto w-[100%]" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-12 justify-between items-center">
            <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-3xl">
              <Badge variant="secondary" className="text-base px-3 py-1.5">
                Status: <span className="font-bold ml-1 text-green-600">Open</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Registration closes in: <span className="font-medium">14 days</span>
              </span>
            </div>
          </div>


          {/* Host Card Detail */}

          <Card sx={{ mb: 3, p: 2 }} className="rounded-2xl">
            <CardHeader
              title={
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                  <PersonIcon className="h-6 w-6" />
                  Competition Host
                </h2>
              }
            />
            <CardContent>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
                <div className="flex flex-col sm:flex-col md:flex-row items-center justify-between gap-6 w-full  " style={{ gap: "16px", }}>
                  <CardMedia
                    component="img"
                    image={logo}
                    alt="Host Logo"
                    sx={{ height: 64, width: 64, borderRadius: 1, objectFit: "cover" }}
                  />
                  <div>
                    <Typography variant="subtitle1" fontWeight="bold">
                      TechInnovate Foundation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Global Technology Nonprofit
                    </Typography>
                  </div>
                  <div className="max-w-3xl">
                    <Typography variant="body2" color="text.secondary" className="">
                      TechInnovate Foundation is dedicated to advancing technology for social good. With a focus on AI and
                      machine learning, they host annual competitions to encourage innovation and solve pressing global
                      challenges.
                    </Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prize Pool */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-black" />
              Prizes & Awards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/50 bg-primary/5">
                <CardHeader className="pb-2">
                  <Badge className="w-fit mb-2 text-black">1st Place</Badge>
                  <Typography className="text-3xl font-bold">$50,000</Typography>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Mentorship from industry leaders</li>
                    <li>Featured in TechInnovate publication</li>
                    <li>Opportunity to present at AI Summit</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Badge className="w-fit mb-2" variant="outline">
                    2nd Place
                  </Badge>
                  <Typography className="text-3xl font-bold">$25,000</Typography>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Access to TechInnovate resources</li>
                    <li>Featured in TechInnovate newsletter</li>
                    <li>Networking opportunities with sponsors</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Badge className="w-fit mb-2" variant="outline">
                    3rd Place
                  </Badge>
                  <Typography className="text-3xl font-bold">$10,000</Typography>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Recognition at awards ceremony</li>
                    <li>Digital badge for professional profiles</li>
                    <li>One-year subscription to AI tools suite</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>


          {/* Eligiblity Criteria */}
          <Card sx={{ mb: 3, p: 2 }} className="rounded-2xl">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-black">
                <PersonIcon className="h-6 w-6" />
                Who Can Join
              </h2>
            </div>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Eligibility Criteria</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Open to individuals and teams of up to 5 members</li>
                    <li>Participants must be 18 years or older</li>
                    <li>Open to participants from all countries</li>
                    <li>No prior experience in AI required, but recommended</li>
                    <li>Students, professionals, and enthusiasts welcome</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Programming</Badge>
                    <Badge variant="secondary">Problem Solving</Badge>
                    <Badge variant="secondary">Data Analysis</Badge>
                    <Badge variant="secondary">Machine Learning (Basic)</Badge>
                    <Badge variant="secondary">Teamwork</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Don't have all the skills? No problem! We encourage diverse teams where members can contribute different
                    expertise. Learning resources will be provided to all participants.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Timeline */}

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-black">
              <CalendarDays className="h-6 w-6 text-black" />
              Competition Timeline
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black bg-border md:left-1/2"></div>

              {/* Timeline events */}
              <div className="space-y-12">
                {/* Event 1 */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="md:text-right md:pr-12">
                    <h3 className="font-bold text-lg">Registration Opens</h3>
                    <p className="text-muted-foreground">March 15, 2025</p>
                    <p className="mt-2">
                      Registration begins for all interested participants. Early bird registrants receive access to
                      exclusive workshops.
                    </p>
                  </div>
                  <div className="hidden md:block"></div>
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="bg-black text-white p-4 font-bold rounded-full">1</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="hidden md:block"></div>
                  <div className="md:pl-12">
                    <h3 className="font-bold text-lg">Kickoff Webinar</h3>
                    <p className="text-muted-foreground">April 1, 2025</p>
                    <p className="mt-2">
                      Official launch event with detailed competition guidelines, Q&A session, and introduction to the
                      challenge themes.
                    </p>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="bg-black text-white p-4 font-bold rounded-full">2</span>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="md:text-right md:pr-12">
                    <h3 className="font-bold text-lg">Submission Deadline</h3>
                    <p className="text-muted-foreground">June 15, 2025</p>
                    <p className="mt-2">
                      Final deadline for all project submissions. Late entries will not be accepted. Detailed documentation
                      required.
                    </p>
                  </div>
                  <div className="hidden md:block"></div>
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="bg-black text-white p-4 font-bold rounded-full">3</span>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="hidden md:block"></div>
                  <div className="md:pl-12">
                    <h3 className="font-bold text-lg">Judging Period</h3>
                    <p className="text-muted-foreground">June 16 - July 15, 2025</p>
                    <p className="mt-2">
                      Expert panel reviews all submissions. Finalists may be asked to provide additional information or
                      demonstrations.
                    </p>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="bg-black text-white p-4 font-bold rounded-full">6</span>
                  </div>
                </div>

                {/* Event 5 */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="md:text-right md:pr-12">
                    <h3 className="font-bold text-lg">Winners Announcement</h3>
                    <p className="text-muted-foreground">July 30, 2025</p>
                    <p className="mt-2">
                      Winners announced at virtual ceremony. All participants will receive feedback on their submissions.
                    </p>
                  </div>
                  <div className="hidden md:block"></div>
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="bg-black text-white p-4 font-bold rounded-full">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-xl p-8 text-center my-10">
            <h2 className="text-3xl font-bold mb-4">Ready to Innovate?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Join hundreds of innovators from around the world in this exciting opportunity to showcase your skills, learn
              from experts, and potentially win substantial prizes.
            </p>
            <Button variant="contained" size="large" className="px-8" sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } }}>
              Join Competition Now
            </Button>
          </div>





          {/* <DynamicTimeline /> */}
          {/* divider competition */}
          {/* <div
            className="text-white pt-48 mt-[-80px]"
            style={{
              backgroundImage: `url(${divider2})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "450px",
              width: "100%",
            }}
          >
            <h1 className="text-5xl mb-2 ml-24">Take the Challenge</h1>
            <h4 className="text-3xl ml-24  pb-2">Become a PRO!</h4>
          </div> */}

          {/* FAQ Section */}
          <div className="bg-transparent p-6 mb-4">
            <div className="flex justify-center items-center w-full">
              <img src={faqimg} alt="FAQ Image" className="w-[500px] h-auto mt-[-100px]" />
            </div>
            <div className="text-3xl font-bold mb-4 text-purple-950 text-center">
              Frequently Asked Questions
            </div>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                className="border  mb-4 hover:text-black hover:bg-white"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="text-lg font-semibold text-gray-800 px-4 py-2"
                >
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails>
                  <p className="text-gray-600 w-11/12">{faq.answer}</p>
                </AccordionDetails>
              </Accordion>
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
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default CompDetail;