import React from "react";

const guides = [
    {
        title: "JAX Guide",
        description: "JAX is a library for high-performance machine learning.",
        imageSrc: "https://www.kaggle.com/static/images/education/km/jax-guide.svg", // Replace with your image URL
    },
    {
        title: "TensorFlow Guide",
        description: "TensorFlow is a library for developing and training machine learning models.",
        imageSrc: "https://www.kaggle.com/static/images/education/km/tensorflow-guide.svg", // Replace with your image URL
    },
    {
        title: "Transfer Learning for CV Guide",
        description: "Transfer Learning is the practice of using a pre-trained model towards a new task.",
        imageSrc: "https://www.kaggle.com/static/images/education/km/transfer-learning-cv-guide.svg", // Replace with your image URL
    },
    {
        title: "Kaggle Competitions Guide",
        description: "Kaggle Competitions are machine learning challenges, often with large prizes.",
        imageSrc: "https://www.kaggle.com/static/images/education/km/kaggle-competitions-guide.svg", // Replace with your image URL
    },
    {
        title: "Natural Language Processing Guide",
        description: "NLP is a subfield of ML concerned with understanding text.",
        imageSrc: "https://www.kaggle.com/static/images/education/km/natural-language-processing-guide.svg", // Replace with your image URL
    },
    {
        title: "R Guide",
        description: "R is a programming language for statistical analysis and visualization.",
        imageSrc: "https://www.kaggle.com/static/images/education/km/r-guide.svg", // Replace with your image URL
    },
];

const GuideCard = ({ title, description, imageSrc }) => (
    <div className="dark:bg-gray-800 dark:text-white rounded-lg p-5 hover:shadow-lg transition-shadow">
        <img src={imageSrc} alt={title} className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm">{description}</p>
    </div>
);

const Guides = () => {
    return (
        <div className="container mx-auto py-8">
            <div className="dark:bg-gray-900 h-auto">
                <h1 className="dark:text-white text-3xl mb-8  font-bold ">Guides</h1>
                <p className="text-gray-400 mb-8">
                    Explore these curated collections of high-quality learning resources authored by the Kaggle community.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guides.map((guide) => (
                        <GuideCard key={guide.title} {...guide} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Guides;