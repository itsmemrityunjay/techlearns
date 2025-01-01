import React from 'react';
import bgimg from '../../components/comp/bg.jpg';
import { borderRadius, color, fontSize, fontWeight } from '@mui/system';

const Divider = () => {
  const style = {
    height: '160px', // Adjust height as needed
    backgroundImage:`url(${bgimg})`, // Replace with your image URL
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    width: '100%', // Make it span the full width
    backgroundRepeat:"no-repeat",
    marginTop:"40px",
    borderRadius:"20px"
  };
  const para={
    width:"50%",
    marginLeft:"90px",
    marginTop:"5px",
    color:"gray",
    fontSize:"17px"
  }
  const head={
    marginLeft:"90px",
    marginTop:"35px",
    fontSize:"28px",
    fontWeight:"600"

  }

  return <div style={style}>
    <h1 style={head}>New to TechLearns?</h1>
    <p style={para}>TechLearns offers a variety of beginner-friendly competitions designed to help you learn data science and machine learning through hands-on experience.</p>
  </div>;

};

export default Divider;
