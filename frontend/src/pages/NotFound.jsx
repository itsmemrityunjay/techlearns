import React from 'react'
import ErrorImg from "../assets/NotFound.jpeg"
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='w-full h-auto bg-[#fdf9ee] flex justify-center flex-col items-center'>
            <img src={ErrorImg} alt="404NotFound" className='h-[100vh] w-auto' />
            <Link to={'/'} className=' mb-16 text-[#d0674c] underline text-3xl  font-medium '>Back to Home Page</Link>
        </div>
    )
}

export default NotFound