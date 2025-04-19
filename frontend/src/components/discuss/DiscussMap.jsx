import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../database/Firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getAuth } from "firebase/auth";
import UpgradeButton from "./DisComponent";
import { FilterList } from "@mui/icons-material";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import bgcompdetail from "../comp/compdetailbg.jpg";
import Footer from "../comp/footer";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
const DiscussMap = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);

  const fetchTopics = async () => {
    try {
      const topicsRef = collection(db, "topics");
      const q = query(topicsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const topicsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTopics(topicsData);
      setFilteredTopics(topicsData);
    } catch (error) {
      setErrorMessage("Error fetching topics: " + error.message);
    }
  };

  const toggleAccordion = (topicId) => {
    if (openAccordion === topicId) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(topicId);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchValue) ||
        topic.content.toLowerCase().includes(searchValue)
    );

    setFilteredTopics(filtered);
  };

  const handleFilter = (type) => {
    setFilterType(type);

    if (type === "") {
      setFilteredTopics(topics);
    } else {
      const filtered = topics.filter((topic) => topic.type === type);
      setFilteredTopics(filtered);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAddComment = async (topicId) => {
    const commentText = newComment[topicId];
    if (commentText) {
      const auth = getAuth();
      const user = auth.currentUser;
      const commentAuthorImage = user ? user.photoURL : "";

      try {
        const topicDocRef = doc(db, "topics", topicId);
        await updateDoc(topicDocRef, {
          comments: arrayUnion({
            text: commentText,
            createdAt: new Date(),
            authorImage: commentAuthorImage, // Save author's image for the comment
            replies: [],
          }),
        });
        setNewComment((prev) => ({ ...prev, [topicId]: "" }));
        fetchTopics();
      } catch (error) {
        setErrorMessage("Error adding comment: " + error.message);
        toast.error("Error adding comment");
      }
    }
  };

  const handleAddReply = async (topicId, commentIndex) => {
    const replyText = newReply[`${topicId}-${commentIndex}`];
    if (replyText) {
      const auth = getAuth();
      const user = auth.currentUser;
      const replyAuthorImage = user ? user.photoURL : "";

      try {
        const topicDocRef = doc(db, "topics", topicId);
        const topic = topics.find((t) => t.id === topicId);

        const updatedComments = [
          ...(Array.isArray(topic.comments) ? topic.comments : []),
        ];
        updatedComments[commentIndex].replies.push({
          text: replyText,
          createdAt: new Date(),
          authorImage: replyAuthorImage, // Save author's image for the reply
        });

        await updateDoc(topicDocRef, {
          comments: updatedComments,
        });

        setNewReply((prev) => ({
          ...prev,
          [`${topicId}-${commentIndex}`]: "",
        }));
        fetchTopics();
      } catch (error) {
        setErrorMessage("Error adding reply: " + error.message);
        toast.error("Error adding reply");
      }
    }
  };

  // likes and dislikes
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});

  const handleLike = (id) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDislike = (id) => {
    setDislikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discussions</h1>
        <UpgradeButton />
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              className={`flex items-center px-4 py-2 rounded-lg transition ${filterType === "" ? "bg-blue-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => handleFilter("")}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-blue-100">
                <FilterList className="text-gray-700" fontSize="small" />
              </span>
              <span>All</span>
            </button>

            <button
              className={`flex items-center px-4 py-2 rounded-lg transition ${filterType === "General Discussion" ? "bg-purple-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => handleFilter("General Discussion")}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-purple-100">
                <FilterList className="text-gray-700" fontSize="small" />
              </span>
              <span>General Discussion</span>
            </button>

            <button
              className={`flex items-center px-4 py-2 rounded-lg transition ${filterType === "Feedback" ? "bg-orange-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => handleFilter("Feedback")}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-orange-100">
                <FilterList className="text-gray-700" fontSize="small" />
              </span>
              <span>Feedback</span>
            </button>

            <button
              className={`flex items-center px-4 py-2 rounded-lg transition ${filterType === "Question" ? "bg-green-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => handleFilter("Question")}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-green-100">
                <FilterList className="text-gray-700" fontSize="small" />
              </span>
              <span>Question</span>
            </button>

            <button
              className={`flex items-center px-4 py-2 rounded-lg transition ${filterType === "Course" ? "bg-pink-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              onClick={() => handleFilter("Course")}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-pink-100">
                <FilterList className="text-gray-700" fontSize="small" />
              </span>
              <span>Course</span>
            </button>
          </div>
        </div>
        {/* <div className="lg:col-span-1">
          <img
            src="https://d8it4huxumps7.cloudfront.net/uploads/images/66a3829b1d2da_jobs_internships.png?d=996x803"
            alt="Community discussions"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div> */}
      </div>

      {filteredTopics.length > 0 ? (
        <div className="space-y-6">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <img
                      src={topic.authorImage}
                      alt={topic.author}
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <div className="ml-4">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-sm font-medium text-gray-700 rounded">
                        {topic.author.length > 20 ? `${topic.author.slice(0, 20)}...` : topic.author}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(topic.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${topic.type === "General Discussion" ? "bg-purple-100 text-purple-800" :
                    topic.type === "Feedback" ? "bg-orange-100 text-orange-800" :
                      topic.type === "Question" ? "bg-green-100 text-green-800" :
                        topic.type === "Course" ? "bg-pink-100 text-pink-800" :
                          "bg-blue-100 text-blue-800"
                    }`}>
                    {topic.type || "General"}
                  </span>
                </div>

                <div
                  className="cursor-pointer mt-3"
                  onClick={() => toggleAccordion(topic.id)}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-md font-semibold text-gray-800">
                      {topic.title}
                    </h2>
                    {openAccordion === topic.id ? (
                      <ExpandLessIcon className="text-gray-500" />
                    ) : (
                      <ExpandMoreIcon className="text-gray-500" />
                    )}
                  </div>
                </div>

                {openAccordion === topic.id && (
                  <div className="mt-4">
                    <div className="prose max-w-none">
                      <ReactQuill
                        value={topic.content}
                        readOnly={true}
                        theme="bubble"
                      />
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setComments((prev) => ({ ...prev, [topic.id]: !prev[topic.id] }))}
                      >
                        {comments[topic.id] ? "Hide Comments" : "Show Comments"}
                      </button>

                      {comments[topic.id] && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start space-x-3">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newComment[topic.id] || ""}
                              onChange={(e) => setNewComment((prev) => ({ ...prev, [topic.id]: e.target.value }))}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button
                              onClick={() => handleAddComment(topic.id)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Comment
                            </button>
                          </div>

                          {/* Comment list */}
                          <div className="space-y-4 mt-4">
                            {(Array.isArray(topic.comments) ? topic.comments : []).map((comment, index) => (
                              <div key={index} className="pl-3 border-l-4 border-gray-200">
                                <div className="flex items-start">
                                  <img
                                    src={comment.authorImage}
                                    alt="Author"
                                    className="w-8 h-8 rounded-full mr-3"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800">{comment.text}</p>
                                    <div className="mt-3">
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          placeholder="Reply to this comment..."
                                          value={newReply[`${topic.id}-${index}`] || ""}
                                          onChange={(e) => setNewReply((prev) => ({ ...prev, [`${topic.id}-${index}`]: e.target.value }))}
                                          className="flex-1 min-w-0 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                          onClick={() => handleAddReply(topic.id, index)}
                                          className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                          Reply
                                        </button>
                                      </div>
                                    </div>

                                    {/* Replies */}
                                    {(Array.isArray(comment.replies) ? comment.replies : []).length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        {comment.replies.map((reply, replyIndex) => (
                                          <div key={replyIndex} className="flex items-start pl-4 mt-2 border-l-2 border-gray-100">
                                            <img
                                              src={reply.authorImage}
                                              alt="Reply Author"
                                              className="w-6 h-6 rounded-full mr-2"
                                            />
                                            <p className="text-sm text-gray-700">{reply.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-500">No topics found.</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Footer />
    </div>
  );
};

export default DiscussMap;
