import React from 'react'
import Competitions from '../components/comp/CompHero'
import Searchbar from '../components/comp/SearchComp'
import TechGetStarted from '../components/comp/TechGetStarted'
import AllCompCard from '../components/comp/AllCompCard'

const Competition = () => {
    return (
        <div>
            <Competitions />
            <Searchbar />
            <TechGetStarted />
            <AllCompCard />
        </div>
    )
}

export default Competition