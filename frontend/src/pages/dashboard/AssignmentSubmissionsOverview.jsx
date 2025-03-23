// ✅ Submissions Dashboard for Admin + Real-time Progress Bar

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../database/Firebase';

const AssignmentSubmissionsOverview = ({ assignmentId }) => {
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);

        const assignmentDoc = await getDoc(doc(db, 'assignments', assignmentId));
        const assignmentData = assignmentDoc.data();
        const assignedUserIds = assignmentData?.assignedUsers || [];

        const assignedUsersData = userList.filter((user) => assignedUserIds.includes(user.id));
        setAssignedUsers(assignedUsersData);

        const submissionsRef = collection(db, 'assignments', assignmentId, 'submissions');
        const unsubscribe = onSnapshot(submissionsRef, (snapshot) => {
          const submissionsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setSubmissions(submissionsList);
        });

        setLoading(false);
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching submission overview:', error);
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [assignmentId]);

  const checkSubmissionStatus = (userId) => {
    return submissions.some((sub) => sub.studentId === userId);
  };

  if (loading) return <div>Loading submissions overview...</div>;

  const totalAssigned = assignedUsers.length;
  const totalSubmitted = assignedUsers.filter((user) => checkSubmissionStatus(user.id)).length;
  const submissionRate = totalAssigned ? ((totalSubmitted / totalAssigned) * 100).toFixed(0) : 0;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Assignment Submission Overview</h2>

      {/* Progress bar */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">
          Submission Progress: {totalSubmitted}/{totalAssigned} Students ({submissionRate}%)
        </h3>
        <div className="w-full bg-gray-200 h-4 rounded-full mt-2">
          <div
            className="bg-green-600 h-4 rounded-full"
            style={{ width: `${submissionRate}%` }}
          ></div>
        </div>
      </div>

      <table className="w-full table-auto border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {assignedUsers.map((user) => {
            const hasSubmitted = checkSubmissionStatus(user.id);
            return (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td
                  className={`border px-4 py-2 text-center ${
                    hasSubmitted ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {hasSubmitted ? '✅ Submitted' : '❌ Not Submitted'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentSubmissionsOverview;
