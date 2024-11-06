import React from 'react'
import WohsTechlearner from "../components/home/WohsTechlearner";
import TechChallenge from "../components/home/TechChallange";
import TechSection from "../components/home/TechSection";
import CommunitySection from "../components/home/CommunitySection";
import BitcoinData from "../components/home/BitcoinData";
import StatisticalTestCard from "../components/home/StatisticalTestCard";
import Hero from '../components/home/Hero';
import InfoSection from '../components/home/InfoSection';
import SolutionCards from '../components/home/SolutionCard';
import CourseList from '../components/home/Courses';


const Home = () => {
    return (
        <div style={{ fontFamily: "Geist Sans" }}>

            {/* <Sidebar /> */}
            <Hero />
            <WohsTechlearner />
            <BitcoinData />
            <CourseList />
            <CommunitySection />
            <TechChallenge />
            <SolutionCards />
            <StatisticalTestCard />
            <InfoSection />
            <TechSection />
            {/* <Footer /> */}
        </div>
    )
}

export default Home