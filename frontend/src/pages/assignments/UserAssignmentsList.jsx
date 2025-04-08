import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { useAuth } from '../../database/AuthContext';
import AssignmentSubmit from './AssignmentSubmit';
import { AccessTime, Assignment, CheckCircle } from '@mui/icons-material';
import { toast } from 'react-toastify';

const UserAssignmentsList = () => {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    // Query user assignments
    const assignmentsQuery = query(
      collection(db, 'userAssignments'),
      where('userId', '==', currentUser.uid)
    );

    // Query submissions
    const submissionsQuery = query(
      collection(db, 'submissions'),
      where('userId', '==', currentUser.uid)
    );

    // Real-time listeners
    const unsubAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
      const assignmentData = [];
      snapshot.forEach((doc) => {
        assignmentData.push({ id: doc.id, ...doc.data() });
      });
      setAssignments(assignmentData);
      setLoading(false);
    });

    const unsubSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const submissionData = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        submissionData[data.assignmentId] = {
          id: doc.id,
          ...data
        };
      });
      setSubmissions(submissionData);
    });

    return () => {
      unsubAssignments();
      unsubSubmissions();
    };
  }, [currentUser]);

  const getStatusColor = (assignment) => {
    const submission = submissions[assignment.id];
    if (!submission) return 'bg-yellow-100 text-yellow-800';
    if (submission.status === 'submitted') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusIcon = (assignment) => {
    const submission = submissions[assignment.id];
    if (!submission) return <AccessTime className="w-5 h-5" />;
    if (submission.status === 'submitted') return <CheckCircle className="w-5 h-5" />;
    return <Assignment className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Assignments</h2>

      {assignments.length === 0 ? (
        <div className="text-center text-gray-500">
          No assignments available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{assignment.title}</h3>
                  <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(assignment)}`}>
                    {getStatusIcon(assignment)}
                    <span>{submissions[assignment.id]?.status || 'Pending'}</span>
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{assignment.description}</p>

                <div className="flex items-center text-gray-500 mb-4">
                  <AccessTime className="w-5 h-5 mr-2" />
                  <span>Due: {new Date(assignment.dueDate?.toDate()).toLocaleDateString()}</span>
                </div>

                {!submissions[assignment.id] && (
                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowSubmitModal(true);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Assignment
                  </button>
                )}

                {submissions[assignment.id]?.grade && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="font-medium">Grade: {submissions[assignment.id].grade}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSubmitModal && selectedAssignment && (
        <AssignmentSubmit 
          isOpen={showSubmitModal}
          assignmentId={selectedAssignment.id} 
          courseId={selectedAssignment.courseId}
          onClose={() => {
            setShowSubmitModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}
    </div>
  );
};

export default UserAssignmentsList;