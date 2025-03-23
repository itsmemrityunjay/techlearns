import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/Firebase";
import emailjs from 'emailjs-com'; // ✅ Import EmailJS

const ReviewSubmissions = () => {
  const { assignmentId, courseId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [marks, setMarks] = useState({});
  const [assignedUsers, setAssignedUsers] = useState([]);
  
  

  // ✅ EmailJS Config (Use Environment Variables in Production)
  const SERVICE_ID = 'service_qghuuq5';
  const TEMPLATE_ID = 'template_t8gnlkb';
  const USER_ID = 'mLvuLxhL0_y07eYhE';

  // ✅ Fetch all submissions for an assignment
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!assignmentId) {
        console.error("❌ Error: assignmentId is undefined!");
        return;
      }
  
      try {
        const assignmentDoc = await getDoc(doc(db, "assignments", assignmentId));
        if (!assignmentDoc.exists()) {
          console.error("Assignment not found");
          return;
        }
  
        const assignmentData = assignmentDoc.data();
        const assignedUserIds = Array.isArray(assignmentData?.assignedUsers)
          ? assignmentData.assignedUsers
          : [];
  
        console.log("DEBUG: Assigned User IDs ->", assignedUserIds);
        setAssignedUsers(assignedUserIds);
      } catch (error) {
        console.error("🔥 Error fetching submissions", error);
      }
    };
  
    fetchSubmissions();
  }, [assignmentId]);
  
  

  // ✅ Handle feedback input change
  const handleFeedbackChange = (submissionId, value) => {
    setFeedback((prev) => ({ ...prev, [submissionId]: value }));
  };

  // ✅ Handle marks input change
  const handleMarksChange = (submissionId, value) => {
    setMarks((prev) => ({ ...prev, [submissionId]: value }));
  };

  // ✅ Submit review and send email
  const handleSubmitReview = async (submissionId, studentEmail) => {
    try {
      const submissionRef = doc(
        db,
        "assignments",
        assignmentId,
        "submissions",
        submissionId
      );

      // Update submission with feedback + marks
      await updateDoc(submissionRef, {
        feedback: feedback[submissionId] || "",
        marks: marks[submissionId] || 0,
        reviewedAt: new Date(),
      });

      alert("Feedback & Marks updated!");

      // ✅ Send email via EmailJS
      const emailParams = {
        to_email: studentEmail,
        feedback: feedback[submissionId] || "",
        marks: marks[submissionId] || 0,
        assignment_id: assignmentId,
      };

      emailjs
        .send(SERVICE_ID, TEMPLATE_ID, emailParams, USER_ID)
        .then((result) => {
          console.log("Email sent:", result.text);
          alert("Email sent to student!");
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          alert("Failed to send email. See console for details.");
        });

    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. See console for details.");
    }
  };

  if (loading) {
    return <div className="text-center mt-12">Loading submissions...</div>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
        Review Submissions
      </h2>

      {submissions.length === 0 ? (
        <p className="text-center">No submissions found for this assignment.</p>
      ) : (
        submissions.map((submission) => (
          <div
            key={submission.id}
            className="border rounded p-4 mb-6 shadow-sm bg-gray-50"
          >
            <p className="font-semibold mb-2">
              Student ID: {submission.studentId}
            </p>

            <a
              href={submission.fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Submitted File
            </a>

            <div className="mt-4">
              <label className="block font-semibold mb-1">Feedback</label>
              <textarea
                value={feedback[submission.id] || submission.feedback || ""}
                onChange={(e) =>
                  handleFeedbackChange(submission.id, e.target.value)
                }
                rows={3}
                className="w-full p-2 border rounded"
                placeholder="Provide feedback to the student"
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="block font-semibold mb-1">Marks</label>
              <input
                type="number"
                value={marks[submission.id] || submission.marks || ""}
                onChange={(e) =>
                  handleMarksChange(submission.id, e.target.value)
                }
                className="w-full p-2 border rounded"
                placeholder="Enter marks"
              />
            </div>

            <button
              onClick={() => handleSubmitReview(submission.id, submission.studentEmail)}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Submit Review & Send Email
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewSubmissions;
