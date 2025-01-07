import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, collection } from 'firebase/firestore';
import { db } from '../../database/Firebase';
import { useAuth } from '../../database/AuthContext'; // Assuming this is your custom auth hook
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import { blue } from '@mui/material/colors';

export default function DynamicTimeline() {
    const { id } = useParams();
    const [compData, setCompData] = useState(null);
    const { currentUser } = useAuth(); // Assuming useAuth provides the current user's data

    useEffect(() => {
        const fetchCompData = async () => {
            try {
                const compDoc = await getDoc(doc(collection(db, "competitions"), id));
                if (compDoc.exists()) {
                    setCompData(compDoc.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching competition data:", error);
            }
        };
        fetchCompData();
    }, [id]);

    const events = [
        {
            time: compData?.startTime || "N/A",
            title: compData?.startDate || "N/A",
            description: "Competition begins",
            icon: <FastfoodIcon />,
        },
        {
            time: compData?.endTime || "N/A",
            title: compData?.endDate || "N/A",
            description: "Competition ends",
            icon: <LaptopMacIcon />,
        },
        {
            time: "Evaluation",
            title: "Evaluation",
            description: compData?.evaluationCriteria || "Evaluation criteria",
            icon: <HotelIcon />,
        },
        {
            time: "Repeat",
            title: "Submission Time",
            description: "Keep improving!",
            icon: <RepeatIcon />,
        },
    ];

    if (!compData) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Timeline position="alternate" className="bg-white">
            {events.map((event, index) => (
                <TimelineItem key={index}>
                    <TimelineOppositeContent
                        sx={{
                            m: 'auto 0',
                            color: "text.secondary",
                        }}
                        align={index % 2 === 0 ? "right" : "left"}
                        variant="body2"
                    >
                        {event.time}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        {index > 0 && <TimelineConnector />}
                        <TimelineDot
                            sx={{
                                bgcolor: "#0a052c",
                                color: 'white',
                                mt: 4, // Moves the icon slightly downward
                            }}
                        >
                            {event.icon}
                        </TimelineDot>
                        {index < events.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent
                        sx={{
                            py: '12px',
                            px: 2,
                            pt: 4, // Moves the description downward
                        }}
                    >
                        <Typography variant="h6" component="span" >
                            {event.title}
                        </Typography>
                        <Typography>{event.description}</Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}
