import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { PieChart } from '@mui/x-charts/PieChart';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from '../../database/Firebase';

export default function PieAnimation() {
  const [radius, setRadius] = useState(50);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [users, setUsers] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchUsers(), fetchCompetitions(), fetchCourses(), fetchDiscussions()]);
    updateChartData();
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchCompetitions = async () => {
    const querySnapshot = await getDocs(collection(db, "competitions"));
    setCompetitions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchDiscussions = async () => {
    const querySnapshot = await getDocs(collection(db, "discussions"));
    setDiscussions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const updateChartData = () => {
    const totalCounts = [
      { label: "Users", value: users.length, color: "#ef4444" },
      { label: "Competitions", value: competitions.length, color: "#10b981" },
      { label: "Courses", value: courses.length, color: "#3b82f6" },
      { label: "Discussions", value: discussions.length, color: "#f59e0b" },
    ];

    setChartData(totalCounts);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <PieChart
        height={300}
        series={[
          {
            data: chartData.map((item) => ({
              id: item.label,
              value: item.value,
              color: item.color,
            })),
            innerRadius: radius,
            arcLabel: (params) => `${params.id}: ${params.value}`,
            arcLabelMinAngle: 1,
          },
        ]}
        skipAnimation={skipAnimation}
      />
      <FormControlLabel
        checked={skipAnimation}
        control={
          <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
        }
        label="Skip Animation"
        labelPlacement="end"
      />
      <Typography id="input-radius" gutterBottom>
        Radius
      </Typography>
      <Slider
        value={radius}
        onChange={(event, newValue) => setRadius(newValue)}
        valueLabelDisplay="auto"
        min={15}
        max={100}
        aria-labelledby="input-radius"
      />
    </Box>
  );
}
