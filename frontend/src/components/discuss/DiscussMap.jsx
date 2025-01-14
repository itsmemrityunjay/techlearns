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

  return (
    <div className="container mx-auto py-8 lg:w-[97%] ">
      <h1 className="lg:text-2xl sm:text-xl font-bold mb-6">Discussions</h1>
      <input
        type="text"
        placeholder="Search topics..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 mb-6 border border-gray-300 rounded h-12"
      />
    
      <div className="flex items-start justify-between gap-8">
        <div className="w-11/12">
      <div className="lg:w-full mt-24">
        <UpgradeButton />
      </div> 
      <div className="mb-6 flex space-x-4 flex-wrap gap-8 w-3/4 mt-12">
        <button
          className={`flex justify-start items-center  w-40 h-16 text-2xl px-4 py-2 rounded-full ${
            filterType === "" ? "primary-bg text-white" : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          style={{borderWidth:"2px"}}
          onClick={() => handleFilter("")}
        >
                <span className="inline-flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-blue-100">
      <FilterList className="text-black" />
    </span>
          All
        </button>
        <button
          className={`flex justify-start items-center w-80 h-16 text-2xl px-4 py-2 rounded-full border ${
            filterType === "General Discussion"
              ? "secondary-bg text-white"
              : "bg-white  border-gray-300 hover:bg-gray-100 "
          }`}
          style={{borderWidth:"2px"}}
          onClick={() => handleFilter("General Discussion")}
        >
    <span className="inline-flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-purple-100">
      <FilterList className="text-black" />
    </span>
          General Discussion
        </button>
        <button
          className={`flex justify-start items-center w-52 h-16 text-2xl px-4 py-2 rounded-full ${
            filterType === "Feedback"
              ? "secondary-bg text-white"
              : "bg-white  border-gray-300 hover:bg-gray-100"
          }`}
          style={{borderWidth:"2px"}}
          onClick={() => handleFilter("Feedback")}
        >
                          <span className="inline-flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-orange-100">
      <FilterList className="text-black" />
    </span>
          Feedback
        </button>
        <button
          className={`flex justify-start items-center w-48 h-16 text-2xl px-4 py-2 rounded-full ${
            filterType === "Question"
              ? "secondary-bg text-white"
              : "bg-white  border-gray-300 hover:bg-gray-100"
          }`}
          style={{borderWidth:"2px"}}
          onClick={() => handleFilter("Question")}
        >
                         <span className="inline-flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-green-100">
      <FilterList className="text-black" />
    </span>
          Question
        </button>
        <button
          className={`flex justify-start items-center w-44 h-16 text-2xl px-4 py-2 rounded-full ${
            filterType === "Course" ? "secondary-bg text-white" : "bg-white  border-gray-300 hover:bg-gray-100"
          }`}
          style={{borderWidth:"2px"}}
          onClick={() => handleFilter("Course")}
        >
           <span className="inline-flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-pink-100">
      <FilterList className="text-black" />
    </span>
          Course
        </button>
      </div>
      </div>
      <div className={`w-full lg:w-1/2 flex justify-center lg:justify-end`}>
            <img
              src="https://d8it4huxumps7.cloudfront.net/uploads/images/66a3829b1d2da_jobs_internships.png?d=996x803"
              alt="Right Side Image"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
          </div>

      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 ">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="p-4 rounded-3xl default-bg">
              <div
                className="cursor-pointer flex justify-between items-center mt-4 ml-4"
                onClick={() => toggleAccordion(topic.id)}
              >
                <div className="flex items-center">
                  <img
                    src={topic.authorImage}
                    alt={topic.author}
                    className="w-10 h-10 rounded-full mr-3"
                    style={{ marginTop: "-40px" }}
                  />
                  <div>
                    <div className="inline-block bg-gray-200 text-gray-600 px-2 py-1 rounded text-balance">
                      {" "}
                      {topic.author.length > 1
                        ? `${topic.author.slice(
                            0,
                            Math.ceil(topic.author.length / 2)
                          )}...`
                        : topic.author}
                    </div>

                    <p className="text-gray-500">
                      {new Date(
                        topic.createdAt.seconds * 1000
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h2 className="lg:text-xl font-bold sm:text-lg mt-2">
                      {topic.title}
                    </h2>
                  </div>
                </div>

                {openAccordion === topic.id ? (
                  <ExpandLessIcon className="secondary-text" />
                ) : (
                  <ExpandMoreIcon className="secondary-text" />
                )}
              </div>

              {openAccordion === topic.id && (
                <div className="mt-1 ml-4">
                  <ReactQuill
                    value={topic.content}
                    readOnly={true}
                    theme="bubble"
                    style={{
                      marginLeft: "38px",
                      width: "80%",
                      marginTop: "-15px",
                    }}
                  />

                  <div className="mt-1 ml-14">
                    <button
                      className="primary-bg text-white px-4 py-2 rounded"
                      onClick={() =>
                        setComments((prev) => ({
                          ...prev,
                          [topic.id]: !prev[topic.id],
                        }))
                      }
                    >
                      {comments[topic.id] ? "Hide Comments" : "Show Comments"}
                    </button>

                    {comments[topic.id] && (
                      <div className="mt-2">
                        <div className="mb-4 flex gap-4 flex-wrap">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[topic.id] || ""}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                [topic.id]: e.target.value,
                              }))
                            }
                            className="lg:w-2/3 w-full p-2 border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => handleAddComment(topic.id)}
                            className="lg:px-4 mt-2 px-4 py-2 secondary-bg text-white rounded"
                            style={{ marginTop: "-1px" }}
                          >
                            Add Comment
                          </button>
                        </div>

                        {(Array.isArray(topic.comments)
                          ? topic.comments
                          : []
                        ).map((comment, index) => (
                          <div key={index} className="mb-4 flex items-start">
                            <img
                              src={comment.authorImage}
                              alt="Author"
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <div>
                              <p className="text-gray-800 mt-1">
                                {comment.text}
                              </p>

                              <div className="mt-4 ml-1 lg:flex gap-4">
                                <input
                                  type="text"
                                  placeholder="Add a reply..."
                                  value={newReply[`${topic.id}-${index}`] || ""}
                                  onChange={(e) =>
                                    setNewReply((prev) => ({
                                      ...prev,
                                      [`${topic.id}-${index}`]: e.target.value,
                                    }))
                                  }
                                  className="w-full p-2 rounded bg-gray-100 border-l-4"
                                  style={{ borderColor: "blue" }}
                                />
                                <button
                                  onClick={() =>
                                    handleAddReply(topic.id, index)
                                  }
                                  className=" px-4 py-2 secondary-bg text-white rounded"
                                  style={{ marginTop: "-1px" }}
                                >
                                  Reply
                                </button>
                              </div>

                              {(Array.isArray(comment.replies)
                                ? comment.replies
                                : []
                              ).map((reply, replyIndex) => (
                                <div
                                  key={replyIndex}
                                  className="text-gray-600 flex items-start mt-2 ml-1"
                                >
                                  <img
                                    src={reply.authorImage}
                                    alt="Reply Author"
                                    className="w-6 h-6 rounded-full mr-2"
                                  />
                                  <p>{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No topics found.</p>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default DiscussMap;
