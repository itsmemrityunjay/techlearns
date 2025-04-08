import React, { useEffect, useState } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  arrayUnion, 
  addDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

const AssignmentSubmissionsOverview = ({ assignmentId }) => {
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        // Get all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userList = usersSnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setUsers(userList);

        // Get assignment details
        const assignmentDoc = await getDoc(doc(db, 'assignments', assignmentId));
        const assignmentData = assignmentDoc.data();
        const assignedUserIds = assignmentData?.assignedUsers || [];

        // Filter assigned users
        const assignedUsersData = userList.filter((user) => 
          assignedUserIds.includes(user.id)
        );
        setAssignedUsers(assignedUsersData);

        // Real-time submissions listener
        const submissionsQuery = query(
          collection(db, 'submissions'),
          where('assignmentId', '==', assignmentId)
        );

        const unsubscribe = onSnapshot(submissionsQuery, (snapshot) => {
          const submissionsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSubmissions(submissionsList);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [assignmentId]);

  const assignToUser = async (userId) => {
    try {
      // Update assignment document
      await updateDoc(doc(db, 'assignments', assignmentId), {
        assignedUsers: arrayUnion(userId)
      });

      // Add to user's assignments collection
      await addDoc(collection(db, 'users', userId, 'assignments'), {
        assignmentId: assignmentId,
        assignedAt: new Date(),
        status: 'pending'
      });

      // Send notification
      await addDoc(collection(db, 'notifications'), {
        userId: userId,
        type: 'assignment',
        message: 'You have been assigned a new assignment',
        read: false,
        createdAt: new Date()
      });

      toast.success('Assignment assigned successfully');
    } catch (error) {
      console.error("Error assigning user:", error);
      toast.error('Failed to assign user');
    }
  };

  const handleSubmission = async (submission) => {
    try {
      // Add submission
      const submissionRef = await addDoc(collection(db, 'submissions'), {
        assignmentId,
        userId: auth.currentUser.id,
        content: submission.content,
        submittedAt: new Date(),
        status: 'submitted'
      });

      // Update user's assignment status
      const userAssignmentQuery = query(
        collection(db, 'users', auth.currentUser.id, 'assignments'),
        where('assignmentId', '==', assignmentId)
      );
      
      const userAssignmentDocs = await getDocs(userAssignmentQuery);
      userAssignmentDocs.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          status: 'submitted',
          submissionId: submissionRef.id
        });
      });

      // Notify admin
      await addDoc(collection(db, 'notifications'), {
        userId: 'admin',
        type: 'submission',
        message: `New submission received for assignment ${assignmentId}`,
        read: false,
        createdAt: new Date()
      });

      toast.success('Assignment submitted successfully');
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error('Failed to submit assignment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Assignment Submissions Overview</h2>
          
          {/* Assigned Users List */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Assigned Users</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg shadow">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="mt-2">
                    {submissions.find(s => s.userId === user.id) ? (
                      <span className="text-green-600">Submitted</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Submissions</h3>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-4 border rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      {users.find(u => u.id === submission.userId)?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(submission.submittedAt?.toDate()).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-2">{submission.content}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentSubmissionsOverview;