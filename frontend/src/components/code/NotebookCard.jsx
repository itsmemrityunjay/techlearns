import React from 'react'
import MainHero from '../MainHero'
import Note from "../../assets/Notebook.svg"

const NotebookCard = () => {
    return (
        <div>
            <MainHero title={"Logic & Latte"}
                description={"Where Code Meets Caffeine Creativity."}
                image={Note} />
        </div>
    )
}

export default NotebookCard