// ✅ Assignment Submission UI for Users

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { useAuth } from '../../database/AuthContext';
import AssignmentSubmit from './AssignmentSubmit';

const UserAssignmentsList = () => {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!currentUser?.uid) return;

      try {
        const q = query(
          collection(db, 'assignments'),
          where('assignedUsers', 'array-contains', currentUser.uid)
        );

        const assignedUserIds = Array.isArray(assignmentData?.assignedUsers)
  ? assignmentData.assignedUsers
  : [];


        const snapshot = await getDocs(q);
        const assignmentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAssignments(assignmentList);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;

  if (assignments.length === 0) return <p>No assignments assigned to you.</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Assignments</h2>

      {assignments.map((assignment) => (
        <div key={assignment.id} className="border p-4 mb-4 rounded">
          <h3 className="font-semibold text-lg">{assignment.title}</h3>
          <p className="text-gray-600 mb-2">{assignment.description}</p>
          <p>Due: {new Date(assignment.dueDate.seconds * 1000).toLocaleDateString()}</p>
          <a
            href={assignment.fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 block"
          >
            View Assignment File
          </a>

          {/* Assignment Submission UI */}
          <AssignmentSubmit assignmentId={assignment.id} courseId={assignment.courseId} />
        </div>
      ))}
    </div>
  );
};

export default UserAssignmentsList;


