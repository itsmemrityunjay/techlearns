import React from 'react';
import { useNavigate } from 'react-router-dom';

const Modal = ({
    onClose,
    item,
    handleDeleteUser,
    handleDeleteComp,
    handleBlockUser,
    handleDeleteCourse,
    handleMoveToPending,
    handleEditCourse,
}) => {

    // Helper function to format timestamp fields if they contain seconds and nanoseconds
    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        }
        return timestamp;
    };

    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-auto max-h-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {item.type === "user" ? "User Management" : item.type === "competition" ? "Competition Management" : "Course Management"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 text-lg">&times;</button>
                </div>

                <div className="space-y-6">
                    {item.data.map((entry) => (
                        <div key={entry.id} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 space-y-3">
                            {item.type === "user" && (
                                <>
                                    <p><span className="font-semibold">ID:</span> {entry.id}</p>
                                    <p><span className="font-semibold">Email:</span> {entry.email || "N/A"}</p>
                                    <p><span className="font-semibold">Role:</span> {entry.role || "N/A"}</p>
                                    <p><span className="font-semibold">Created At:</span> {formatTimestamp(entry.createdAt)}</p>
                                    <div className="flex space-x-4 mt-4">
                                        <button onClick={() => handleDeleteUser(entry.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                                        <button onClick={() => handleBlockUser && handleBlockUser(entry.id)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Block</button>
                                    </div>
                                </>
                            )}
                            {item.type === "competition" && (
                                <>
                                    <p><span className="font-semibold">ID:</span> {entry.id}</p>
                                    <p><span className="font-semibold">Title:</span> {entry.title || "N/A"}</p>
                                    <p><span className="font-semibold">Subtitle:</span> {entry.subtitle || "N/A"}</p>
                                    <p><span className="font-semibold">Author:</span> {entry.author || "N/A"}</p>
                                    <p><span className="font-semibold">Status:</span> {entry.status || "N/A"}</p>
                                    <p><span className="font-semibold">Start Date:</span> {formatTimestamp(entry.startDate)}</p>
                                    <p><span className="font-semibold">End Date:</span> {formatTimestamp(entry.endDate)}</p>
                                    <div className="flex space-x-4 mt-4">
                                        <button onClick={() => handleDeleteComp(entry.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                                        <button onClick={() => handleMoveToPending && handleMoveToPending(entry.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Move to Pending</button>
                                    </div>
                                </>
                            )}
                            {item.type === "course" && (
                                <>
                                    <p><span className="font-semibold">ID:</span> {entry.id}</p>
                                    <p><span className="font-semibold">Title:</span> {entry.title || "N/A"}</p>
                                    <p><span className="font-semibold">Description:</span> {entry.description || "N/A"}</p>
                                    {entry.image && <img src={entry.image} alt={entry.title} className="w-full h-32 object-cover rounded-lg" />}
                                    <p><span className="font-semibold">Author:</span> {entry.author || "N/A"}</p>
                                    <div className="flex space-x-4 mt-4">
                                        <button onClick={() => { navigate(`/courses-edit/${entry.id}`); }} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Edit</button>
                                        <button onClick={() => handleDeleteCourse(entry.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Modal;
