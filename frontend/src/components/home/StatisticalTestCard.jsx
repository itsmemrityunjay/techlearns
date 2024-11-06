import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description'; // Import Material UI icon

// Sample data for cards
const cardData = [
    {
        id: 1,
        title: '🏔🧩 Complete Guide to Statistical Testing A to Z',
        description: 'Python · Statistical Analysis',
        upvotes: 519,
        comments: 42,
        datasetLink: '/datasets/matinmahmoudi/sales-and-satisfaction',
        image: 'https://storage.googleapis.com/kaggle-avatars/thumbnails/4201901-kg.jpeg?t=2024-02-03-18-20-10',
    },
    {
        id: 2,
        title: '📊 Introduction to Hypothesis Testing',
        description: 'Python · Statistical Analysis',
        upvotes: 300,
        comments: 25,
        datasetLink: '/datasets/matinmahmoudi/sales-and-satisfaction',
        image: 'https://storage.googleapis.com/kaggle-avatars/thumbnails/4201901-kg.jpeg?t=2024-02-03-18-20-10',
    },
    {
        id: 3,
        title: '🧮 T-Test and ANOVA Explained',
        description: 'Python · Statistical Analysis',
        upvotes: 450,
        comments: 35,
        datasetLink: '/datasets/matinmahmoudi/sales-and-satisfaction',
        image: 'https://storage.googleapis.com/kaggle-avatars/thumbnails/4201901-kg.jpeg?t=2024-02-03-18-20-10',
    },
    {
        id: 4,
        title: '📈 Chi-Square Test for Independence',
        description: 'Python · Statistical Analysis',
        upvotes: 280,
        comments: 20,
        datasetLink: '/datasets/matinmahmoudi/sales-and-satisfaction',
        image: 'https://storage.googleapis.com/kaggle-avatars/thumbnails/4201901-kg.jpeg?t=2024-02-03-18-20-10',
    },
];

const StatisticalTestCard = () => {
    return (
        <div className='container mx-auto py-8'>
            <h1 className="text-left text-3xl font-bold mb-4 flex items-center">
                <DescriptionIcon className="mr-2" /> {/* Material UI icon */}
                Notebooks
            </h1>
            <p className="text-left text-gray-600 mb-4 text-lg">
                1.2M public notebooks and access to a powerful notebook environment with no cost GPUs & TPUs.
            </p>
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardData.map((card) => (
                    <a
                        key={card.id}
                        href="/code/matinmahmoudi/complete-guide-to-statistical-testing-a-to-z"
                        className="block border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-lg p-6"
                    >
                        <div className="flex items-center mb-4">
                            {/* Profile Image and Title */}
                            <a href="/matinmahmoudi" aria-label="Matin Mahmoudi ✨" className="relative">
                                <div
                                    data-testid="avatar-image"
                                    title="Matin Mahmoudi ✨"
                                    className="w-12 h-12 bg-cover rounded-full"
                                    style={{
                                        backgroundImage: `url('${card.image}')`, // Use the correct template string syntax here
                                    }}
                                ></div>
                                {/* Circular border around image */}
                                <svg className="absolute top-0 left-0" width="48" height="48" viewBox="0 0 48 48">
                                    <circle r="22.5" cx="24" cy="24" fill="none" strokeWidth="3" style={{ stroke: 'rgb(241, 243, 244)' }}></circle>
                                    <circle r="22.5" cx="24" cy="24" fill="none" strokeWidth="3" style={{ stroke: 'rgb(250, 224, 65)' }}></circle>
                                </svg>
                            </a>
                            {/* Title and Description */}
                            <div className="ml-4">
                                <div className="text-xl font-bold">{card.title}</div>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="text-sm text-gray-600 mb-2">{card.description}</div>
                        <p className="text-gray-500">
                            {card.upvotes} upvotes · {card.comments} comments
                            <span className="block">
                                <a className="text-blue-500 hover:underline" href={card.datasetLink}>
                                    Sales and Satisfaction
                                </a>
                            </span>
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default StatisticalTestCard;
