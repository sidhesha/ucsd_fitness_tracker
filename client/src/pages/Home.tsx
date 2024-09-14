import logo from '.././logo.png';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import './Home.css';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import Busyness from '../components/Busyness';
import { API_SERVER } from '../config';
import { Typography } from '@mui/material';
import axios from 'axios';

const FETCH_INTERVAL = 3*60*1000;

interface DataProperties {
  isOpen: boolean,
  name: string, 
  busyness?: number, 
  comparison?: { 
    hour: number, 
    day: number 
  }, 
  peak?: [string]
}

function Home() {
  const [busynessData, setBusynessData] = useState<DataProperties[]>([])

  useEffect(() => {
    const fetchData = async () => {
      let res = await axios.get(API_SERVER + "/api/busy").then(res => {
        if (res.data) {
          return res.data
        } 
        return null
      })
      setBusynessData(res);
    }
    fetchData();

    const fetchInterval = setInterval(fetchData, FETCH_INTERVAL);
    return () => clearInterval(fetchInterval);
  }, [])

  let nav = useNavigate()

  return (
    <div className="Home">
      <Header />
      <div className='Sub-Header'>Welcome triton!</div>
      <div><img src={logo} className="App-Logo Center" alt="logo" /></div>
      <div className='Sub-Header'>Today's Workout</div>
      <div id="workoutDiv">
        <Button className="Center" id="startWorkout" onClick={()=> {nav("/main/workout")}}>Start Workout</Button>
      </div>

      {busynessData? busynessData.map(location => (
          <Busyness
            key={location.name} 
            isOpen={location.isOpen}
            location={location.name} 
            busyness={location.busyness} 
            comparison={location.comparison} 
            peak={location.peak}
          />
      )) : <Typography sx={{ fontStyle: 'italic' }}>No busyness data.</Typography>}
    </div>
  );
}

export default Home;
