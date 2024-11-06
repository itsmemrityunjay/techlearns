import React, { useEffect, useState } from 'react';
import { Typography, Button, Divider, Chip, LinearProgress } from '@mui/material';
import { collection, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { useParams } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import { useAuth } from '../../database/AuthContext';  // Assume this provides the current user's info

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

    if (!compData) return (
        <div className="flex justify-center items-center h-screen">
            <ThreeDots color="#003656" height={80} width={80} />
        </div>
    );

    return (
        <div className="container mx-auto">
            <div className="flex">
                <div className="flex-grow bg-white rounded-lg shadow-md p-5">
                    <div className="flex gap-y-20 justify-between items-center mb-4">
                        <div>
                            <span className="font-black text-6xl">{compData.title}</span>
                            <Typography variant="subtitle1" className="text-gray-600">
                                {compData.subtitle || compData.description}
                            </Typography>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            {!isRegistered ? (
                                <Button
                                    variant="contained"
                                    className="bg-black text-white py-2 px-4"
                                    onClick={handleJoinCompetition}
                                >
                                    Join Competition
                                </Button>
                            ) : (
                                <Button variant="contained" className="bg-green-600 text-white py-2 px-4">
                                    Submit Entry
                                </Button>
                            )}
                            <img src={compData.icon || compData.imageUrl} alt="Competition Logo" className="w-96 h-auto rounded-md mt-2" />
                        </div>
                    </div>

                    {/* Competition Details */}
                    <div className="bg-gray-100 p-4 rounded-lg mb-5">
                        <div className="mb-4">
                            <Typography variant="h6" className="font-bold">Competition Host</Typography>
                            <Typography className="text-gray-600">{compData.author}</Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="h6" className="font-bold">Prizes & Awards</Typography>
                            <Typography className="text-gray-600">{compData.prizePool || compData.prizes}</Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="h6" className="font-bold">Eligibility</Typography>
                            <Typography className="text-gray-600">{compData.eligibility || "N/A"}</Typography>
                        </div>
                        <div className="mb-4">
                            <Typography variant="h6" className="font-bold">Evaluation Criteria</Typography>
                            <Typography className="text-gray-600">{compData.evaluationCriteria || "N/A"}</Typography>
                        </div>
                    </div>

                    {/* Overview Section */}
                    <div className="mb-5">
                        <Typography variant="h6" className="font-bold mb-2">Overview</Typography>
                        <Typography className="text-gray-600 leading-relaxed">{compData.subtitle}</Typography>
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <Typography variant="subtitle2" className="text-gray-500 font-bold">Start</Typography>
                                <Typography>{compData.startDate}</Typography>
                            </div>
                            <LinearProgress
                                variant="determinate"
                                value={compData.progress ?? 0}
                                className="flex-grow h-2 mx-5"
                            />
                            <div>
                                <Typography variant="subtitle2" className="text-gray-500 font-bold">Close</Typography>
                                <Typography>{compData.endDate}</Typography>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-base-200 p-6 my-10 rounded-lg shadow-lg">
                        <div className="text-xl font-bold mb-4">Frequently Asked Questions</div>
                        {faqs.map((faq, index) => (
                            <div key={index} className="collapse bg-base-100 mb-4 border-b border-gray-200">
                                <input type="checkbox" />
                                <div className="collapse-title text-lg font-semibold text-gray-800">
                                    {faq.question}
                                </div>
                                <div className="collapse-content">
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    {compData.tags && compData.tags.length > 0 && (
                        <div className="flex space-x-2 mb-5">
                            {compData.tags.map((tag, index) => (
                                <Chip key={index} label={tag} className="bg-blue-200 text-blue-800" />
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
