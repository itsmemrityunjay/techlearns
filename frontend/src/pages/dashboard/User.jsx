import React from 'react'
import CustomComponent from '../../components/userDash/Custom'
import { Assignment } from '@mui/icons-material'
import AssignmentSubmit from '../assignments/AssignmentSubmit'
import ReviewSubmissions from '../assignments/ReviewSubmissions'
import LiveStream from '../assignments/LiveStream'

const User = () => {
    return (<>
        <CustomComponent />
        <AssignmentSubmit />
        <ReviewSubmissions/>
        <LiveStream/>
        </>
    )
}

export default User