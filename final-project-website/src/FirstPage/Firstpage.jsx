import React from 'react';
import './FirstPage.css';
import video1 from '../assets/video1.mp4';

export default function Firstpage() {
  return (
    <div className="container">
      <video src={video1} autoPlay loop muted className="background-video" />
      <div className="content">
        <h1>Dedicated Economic centre  Sri Lanka</h1>
        <button className="start-button">Start</button>
      </div>
    </div>
  );
}
