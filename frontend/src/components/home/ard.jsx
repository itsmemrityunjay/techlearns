import React from 'react';

// Sample data for models
const modelData = [
    {
        id: 1,
        name: 'Gemma',
        organization: 'Google',
        description: 'Gemma is a family of lightweight, open models built from the research and technology that Google used to create the Gemini models.',
        image: 'https://storage.googleapis.com/kaggle-organizations/855/thumbnail.png',
        link: '/models/google/gemma',
    },
    {
        id: 2,
        name: 'Model B',
        organization: 'Google',
        description: 'Model B is designed for efficiency and performance, ideal for various applications.',
        image: 'https://storage.googleapis.com/kaggle-organizations/855/thumbnail.png',
        link: '/models/google/model-b',
    },
    {
        id: 3,
        name: 'Model C',
        organization: 'Google',
        description: 'Model C focuses on advanced features and capabilities to enhance user experience.',
        image: 'https://storage.googleapis.com/kaggle-organizations/855/thumbnail.png',
        link: '/models/google/model-c',
    },
    {
        id: 4,
        name: 'Model D',
        organization: 'Google',
        description: 'Model D offers a robust solution for data analysis and processing tasks.',
        image: 'https://storage.googleapis.com/kaggle-organizations/855/thumbnail.png',
        link: '/models/google/model-d',
    },
];

const ModelCard = () => {
    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modelData.map((model) => (
                <a
                    key={model.id}
                    href={model.link}
                    className="block border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-lg p-6"
                >
                    <div className="mb-4">
                        <div className="text-xl font-bold">{model.name}</div>
                        <img src={model.image} alt={model.organization} className="mt-2" />
                    </div>
                    <div className="text-sm text-gray-600">{model.organization}</div>
                    <p className="text-gray-500 mt-2">{model.description}</p>
                </a>
            ))}
        </div>
    );
};

export default ModelCard;