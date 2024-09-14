import React, { useEffect, useState } from "react";
import { PlayCircle } from "@mui/icons-material";
import { Button } from "@mui/material";
import Header from "../components/Header";
import { API_SERVER } from "../config";
import './Workout.css';

function Workout() {
  const [workoutData, setWorkoutData] = useState<any>(null);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const userResponse = await fetch(API_SERVER + '/api/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        const userData = await userResponse.json();

        if (userResponse.ok) {
          const userProfile = userData.user;
          const apiUrl = `/api/workout/${userProfile.fitnessGoal}/${userProfile.workoutDay}`;

          const workoutResponse = await fetch(API_SERVER + apiUrl);
          const workoutData = await workoutResponse.json();

          if (workoutResponse.ok) {
            console.log(workoutData);
            setWorkoutData(workoutData);
          } else {
            console.error(`Failed to fetch workout data: ${workoutData.error}`);
          }
        }
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    fetchWorkoutData();
  }, []);

  const storedCheckboxState = JSON.parse(localStorage.getItem('checkboxState') || '[]');
  const [checkboxState, setCheckboxState] = useState<string[]>(storedCheckboxState);

  useEffect(() => {
    localStorage.setItem('checkboxState', JSON.stringify(checkboxState));
  }, [checkboxState]);

  const checkList = workoutData?.day?.exercises || [];

  function CheckboxChange(id: string) {
    console.log("Change for: ", id);

    setCheckboxState(prevState => {
      if (prevState.includes(id)) {
        return prevState.filter(itemId => itemId !== id);
      } else {
        return [...prevState, id];
      }
    });
  }

  async function CheckAllBoxes() {
    let checkboxes = document.getElementsByName('checkbox') as NodeListOf<HTMLInputElement>;
  
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    try {
      const userResponse = await fetch(API_SERVER + '/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const userData = await userResponse.json();
  
      if (userResponse.ok) {
        const userProfile = userData.user;
        let newWorkoutDay = userProfile.workoutDay + 1;
  
        if (newWorkoutDay > 7) {
          newWorkoutDay = 1; // Reset to 7 due to week limit 
        }
        await fetch(API_SERVER + '/api/user/updateWorkoutDay', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            workoutDay: newWorkoutDay,
          }),
        });
        localStorage.removeItem('checkboxState');
        window.location.reload();
      }
    } catch (error) {
      console.error(`Error updating workout day: ${error}`);
    }
  }
  
  function VideoChange(index: number) {
    let videoPlayer = document.getElementById('videoPlayer') as HTMLIFrameElement | null;
    if (videoPlayer && checkList[index - 1]) {
      if (videoPlayer.src !== checkList[index - 1].link) {
        videoPlayer.src = checkList[index - 1].link;

        let videoTitle = document.getElementById('videoTitle') as HTMLSpanElement | null;
        if (videoTitle) {
          videoTitle.textContent = "Video Demo for " + checkList[index - 1].exerciseName;
        }
      }
    }
  }

  function Checklist() {
    return (
      <div className='Workout-Checklist'>
        <Header />
        <div className="Sub-Header" id='checklistHeader'>Today's Workout</div>
        <div id="checkListDiv">
          {
            checkList.map((item: { _id: string, exerciseName: string, sets: number, reps: number, link: string }, index: number) => (
              <div className="checkListRow" key={index}>
                <Button id="button" onClick={() => VideoChange(index + 1)}><PlayCircle /></Button>
                <input
                  className="checkbox"
                  name="checkbox"
                  type="checkbox"
                  id={item._id}
                  onClick={() => CheckboxChange(item._id)}
                  checked={checkboxState.includes(item._id)}
                />
                <span className="checkboxText">
                  {item.exerciseName} ({item.sets} X {item.reps})
                </span>
              </div>
            ))
          }
          <div id="selectAllDiv">
            <Button id="selectAll" className="Center" onClick={() => CheckAllBoxes()}> Complete Workout </Button>
          </div>
          <span className="Sub-Header" id="videoTitle">Video Demo for {checkList[0]?.exerciseName}</span>
          <iframe
            id="videoPlayer"
            title="videoPlayer"
            width="80%"
            className="Center"
            src={checkList[0]?.link}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      </div>
    );
  }  

  return (
    <div className="Workout">
      {Checklist()}
    </div>
  );
}

export default Workout;
