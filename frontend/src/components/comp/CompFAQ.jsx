import React from 'react'

const CompFAQ = () => {
    const faqs = [
        {
            question: "What is a Getting Started competition?",
            answer: `Getting Started competitions were created by Kaggle data scientists for people who have little to no machine learning background. They are a great place to begin if you are new to data science or just finished a MOOC and want to get involved in Kaggle.
    
                Getting Started competitions are a non-competitive way to get familiar with Kaggle’s platform, learn basic machine learning concepts, and start meeting people in the community. They have no cash prize and are on a rolling timeline.`,
        },
        {
            question: "How do I create and manage a team?",
            answer: `When you accept the competition rules, a team will be created for you. You can invite others to your team, accept a merger with another team, and update basic information like team name by going to the More > Team page.
    
                We've heard from many Kagglers that teaming up is the best way to learn new skills AND have fun. If you don't have a teammate already, consider asking if anyone wants to team up in the discussion forum.`,
        },
        {
            question: "What are Notebooks?",
            answer: `Kaggle Notebooks is a cloud computational environment that enables reproducible and collaborative analysis. Notebooks support scripts in Python and R, Jupyter Notebooks, and RMarkdown reports. You can visit the Notebooks tab to view all of the publicly shared code for the Titanic competition. For more on how to use Notebooks to learn data science, check out our Courses!`,
        },
        {
            question: "Why did my team disappear from the leaderboard?",
            answer: `To keep with the spirit of getting-started competitions, we have implemented a two month rolling window on submissions. Once a submission is more than two months old, it will be invalidated and no longer count towards the leaderboard.
    
                If your team has no submissions in the previous two months, the team will also drop from the leaderboard. This will keep the leaderboard at a manageable size, freshen it up, and prevent newcomers from getting lost in a sea of abandoned scores.`,
        },
        {
            question: "How do I contact Support?",
            answer: `Kaggle does not have a dedicated support team so you’ll typically find that you receive a response more quickly by asking your question in the appropriate forum. (For this competition, you’ll want to use the Titanic discussion forum).
    
                Support is only able to help with issues that are being experienced by all participants. Before contacting support, please check the discussion forum for information on your problem. If you can’t find it, you can post your problem in the forum so a fellow participant or a Kaggle team member can provide help. The forums are full of useful information on the data, metric, and different approaches. We encourage you to use the forums often. If you share your knowledge, you'll find that others will share a lot in turn!`,
        },
    ];


    return (
        <div className='container mx-auto py-8'>
            {/* FAQ Section */}
            <div className="bg-transparent p-6 my-10 rounded-lg border-2 border-blue-300">
                <div className="text-xl font-bold mb-4 text-gray-800">Frequently Asked Questions</div>
                {faqs.map((faq, index) => (
                    <div key={index} className="collapse bg-base-100 mb-4 ">
                        <input type="checkbox" />
                        <div className="collapse-title text-lg font-semibold text-gray-800 px-4 py-2  border-b-2  hover:border-2 hover:border-blue-500 ">
                            {faq.question}
                        </div>
                        <div className="collapse-content">
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CompFAQ