import React, { useState } from 'react';
import LearnerImg from '../../assets/learners-illo_light.svg';
import DeveloperImg from '../../assets/developers-illo_light.svg';
import ResearcherImg from '../../assets/researchers-illo_light.svg';
import { School, TableChart, TagFaces, Code, AutoFixHigh, ModelTraining, EmojiEvents } from '@mui/icons-material';

const data = [
    {
        id: 'learners',
        title: 'Students',
        description: 'Explore engaging courses, live sessions, and community support.',
        imgSrc: LearnerImg,
        keyFeatures: [
            { label: 'Beginner-friendly courses', icon: <TagFaces />, link: '/courses?level=beginner' },
            { label: 'Interactive workshops', icon: <School />, link: '/workshops' },
            { label: 'Community forums', icon: <TableChart />, link: '/forums' },
        ]
    },
    {
        id: 'developers',
        title: 'Developers',
        description: "Access advanced tutorials, coding challenges, and open projects.",
        imgSrc: DeveloperImg,
        keyFeatures: [
            { label: 'Open-source projects', icon: <ModelTraining />, link: '/projects' },
            { label: 'Code challenges', icon: <AutoFixHigh />, link: '/challenges' },
            { label: 'Developer community', icon: <Code />, link: '/community/developers' },
        ]
    },
    {
        id: 'professionals',
        title: 'Professionals',
        description: 'Boost your career with certifications and industry-specific courses.',
        imgSrc: ResearcherImg,
        keyFeatures: [
            { label: 'Certifications', icon: <EmojiEvents />, link: '/certifications' },
            { label: 'Career development resources', icon: <ModelTraining />, link: '/resources' },
            { label: 'Advanced courses', icon: <ModelTraining />, link: '/courses/advanced' },
        ]
    }
];


const ButtonCard = ({ title, description, imgSrc, keyFeatures, showFeatures, }) => (
    <div className="flex flex-col bg-gray-100 gap-8 shadow-md rounded-xl">
        <div className='flex items-center'>
            <div className="text-left mb-4 ml-8 mt-2">
                <span className="text-xl font-bold mb-2 block mt-2 uppercase text-sm">{title}</span>
                <p className="text-lg text-gray-500 w-11/12 text-sm">{description}</p>
            </div>
            <img src={imgSrc} alt={title} width="90" height="90" className=" mr-12" />
        </div>
        {showFeatures && (
            <div className="mt-4 ml-8 mb-8">
                <span className="block font-semibold mb-2 text-customBlue">KEY FEATURES</span>
                {keyFeatures.map((feature, index) => (
                    <a key={index} href={feature.link} className="flex items-center mb-2">
                        <span className="material-icons mx-2 ml-4 text-customOrange" style={{ fontSize: '30px',  }}>{feature.icon}</span>
                        <p className='text-lg mt-2 ml-2 text-gray-500'>{feature.label}</p>
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
            <div className='mx-2'>

                <h2 className="text-3xl font-bold text-left mb-8 text-customBlue">WHO'S TECHLEARNS?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((item) => (
                        <ButtonCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            imgSrc={item.imgSrc}
                            keyFeatures={item.keyFeatures}
                            showFeatures={showMore}  // Pass the state to control feature visibility
                            // className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                        />
                    ))}
                </div>
                <div className="flex justify-left mt-8">
                    <button
                        className="flex items-center bg-[--secondary-color] dark:bg-black text-white font-semibold px-4 py-2 rounded-lg focus:outline-none hover:bg-[--primary-color]"
                        onClick={() => setShowMore(!showMore)}  // Toggle showMore state
                    >
                        <span className="material-icons mr-2">{showMore ? 'See Less' : 'See More'}</span>
                        {/* <span>{showMore ? 'See less' : 'See more'}</span> */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WohsTechlearner;
