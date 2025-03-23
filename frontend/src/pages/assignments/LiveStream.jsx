import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../database/Firebase";

const LiveStream = () => {
    const [isLive, setIsLive] = useState(false);
    const [roomName, setRoomName] = useState("");
  
    useEffect(() => {
      const unsubscribe = onSnapshot(doc(db, "livestream", "current"), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsLive(data.isLive);
          setRoomName(data.roomName);
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    useEffect(() => {
      if (isLive && roomName) {
        const domain = "meet.jit.si";
        const options = {
          roomName,
          width: "100%",
          height: 600,
          parentNode: document.getElementById("user-jitsi-container"),
        };
        const api = new window.JitsiMeetExternalAPI(domain, options);
  
        return () => api.dispose();
      }
    }, [isLive, roomName]);
  
    return (
      <div className="p-8 bg-white rounded-lg shadow-md max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          {isLive ? "Live Class in Progress" : "No Live Class Available"}
        </h2>
        {isLive ? (
          <div id="user-jitsi-container" className="w-full h-[600px] bg-black rounded-lg"></div>
        ) : (
          <p className="text-center text-gray-500">Waiting for Admin to start the Live Class...</p>
        )}
      </div>
    );
  };
export default LiveStream;
