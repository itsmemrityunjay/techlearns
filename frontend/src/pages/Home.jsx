import React from 'react'
import WohsTechlearner from "../components/home/WohsTechlearner";
import TechChallenge from "../components/home/TechChallange";
import TechSection from "../components/home/TechSection";
// import CommunitySection from "../components/home/CommunitySection";
import BitcoinData from "../components/home/BitcoinData";
import StatisticalTestCard from "../components/home/StatisticalTestCard";
import Hero from '../components/home/Hero';
import InfoSection from '../components/home/InfoSection';
import SolutionCards from '../components/home/SolutionCard';
import CourseList from '../components/home/Courses';
import img from "../components/discuss/disimg.jpg";
import Footer from "../components/comp/footer";
import FeatureList from '../components/home/FeatureList';
// import { Timeline } from '@mui/icons-material';
// import Timeline from '../components/home/Timeline';

const Home = () => {
    return (
        <div style={{
            fontFamily: "Geist Sans",
            // backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: 'center',
            // minHeight: "100vh",
        }}>

            {/* <Sidebar /> */}
            <Hero />
            <WohsTechlearner />
            <BitcoinData />
            <CourseList />
            {/* <CommunitySection /> */}
            <TechChallenge />
            <SolutionCards />
            {/* <StatisticalTestCard /> */}
            
            <FeatureList/>

            {/* <Timeline/> */}
            <InfoSection />
            <TechSection />
            <Footer />
        </div>
    )
}

export default Home