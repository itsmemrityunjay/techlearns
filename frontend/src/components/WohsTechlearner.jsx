import React, { useState } from 'react';
import LearnerImg from '../assets/learners-illo_light.svg';
import DeveloperImg from '../assets/developers-illo_light.svg';
import ResearcherImg from '../assets/researchers-illo_light.svg';
import { School, TableChart, TagFaces, Code, AutoFixHigh, ModelTraining, EmojiEvents } from '@mui/icons-material';

const data = [
    {
        id: 'learners',
        title: 'Learners',
        description: 'Dive into Kaggle courses, competitions & forums.',
        imgSrc: LearnerImg,  // Use the imported image
        keyFeatures: [
            { label: 'Beginner competitions', icon: <TagFaces />, link: '/competitions?hostSegmentIdFilter=5' },
            { label: 'Practical courses', icon: <School />, link: '/learn' },
            { label: 'Public datasets', icon: <TableChart />, link: '/datasets' },
        ]
    },
    {
        id: 'developers',
        title: 'Developers',
        description: "Leverage Kaggle's models, notebooks & datasets.",
        imgSrc: DeveloperImg,
        keyFeatures: [
            { label: 'Open-sourced models', icon: <ModelTraining />, link: '/models' },
            { label: 'Competition solution write-ups', icon: <AutoFixHigh />, link: '/discussions?category=competitionWriteUps#search-discussions' },
            { label: 'Public notebooks', icon: <Code />, link: '/code' },
        ]
    },
    {
        id: 'researchers',
        title: 'Researchers',
        description: 'Advance ML with our pre-trained model hub & competitions.',
        imgSrc: ResearcherImg,
        keyFeatures: [
            { label: 'ML competition hosting', icon: <EmojiEvents />, link: '/competitions/about/host' },
            { label: 'Model training datasets', icon: <ModelTraining />, link: '/datasets' },
            { label: 'Open-sourced models', icon: <ModelTraining />, link: '/models' },
        ]
    }

];

const ButtonCard = ({ title, description, imgSrc, keyFeatures, showFeatures }) => (
    <div className="flex flex-col bg-white gap-8">
        <div className='flex items-center'>
            <div className="text-left mb-4">
                <span className="text-xl font-bold mb-2 block">{title}</span>
                <p className="text-lg text-gray-500">{description}</p>
            </div>
            <img src={imgSrc} alt={title} width="100" height="100" className="mb-4" />
        </div>
        {showFeatures && (
            <div className="mt-4">
                <span className="block font-semibold mb-2">Key Features</span>
                {keyFeatures.map((feature, index) => (
                    <a key={index} href={feature.link} className="flex items-center mb-2">
                        <span className="material-icons mx-2" style={{ fontSize: '30px' }}>{feature.icon}</span>
                        <p className='text-2xl text-gray-500'>{feature.label}</p>
                    </a>
                ))}
            </div>
        )}
    </div>
);

const WohsTechlearner = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-3xl font-bold text-left mb-8">Who's Techlearner?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map((item) => (
                    <ButtonCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        imgSrc={item.imgSrc}
                        keyFeatures={item.keyFeatures}
                        showFeatures={showMore}  // Pass the state to control feature visibility
                    />
                ))}
            </div>
            <div className="flex justify-left mt-8">
                <button
                    className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none hover:bg-blue-700"
                    onClick={() => setShowMore(!showMore)}  // Toggle showMore state
                >
                    <span className="material-icons mr-2">{showMore ? 'expand_less' : 'expand_more'}</span>
                    {/* <span>{showMore ? 'See less' : 'See more'}</span> */}
                </button>
            </div>
        </div>
    );
};

export default WohsTechlearner;
