// Competition.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Competitions from '../components/comp/CompHero';
import Searchbar from '../components/comp/SearchComp';
import TechGetStarted from '../components/comp/TechGetStarted';
import AllCompCard from '../components/comp/AllCompCard';
import Mentors from '../components/comp/Mentors'; // Create this component

const Competition = () => {
    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    <>
                        <Competitions />
                        <Searchbar />
                        {/* <TechGetStarted />
                        <AllCompCard /> */}
                    </>
                } 
            />
            {/* <Route path="/competition/mentors" element={<Mentors />} /> */}
        </Routes>
    );
};

export default Competition;