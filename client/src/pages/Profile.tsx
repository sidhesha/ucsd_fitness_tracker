import {ChangeEvent, useEffect, useState} from "react";
import {API_SERVER} from "../config";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Select, SelectChangeEvent,
  Stack,
  TextField
} from "@mui/material";
import "./Profile.css";
import {NavigateFunction, Route, Routes, useNavigate} from "react-router-dom";
import {checkLogin, ErrorDiv} from "../common";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const profileItems = [
  {
    field: "age",
    text: "Age",
  },
  {
    field: "gender",
    text: "Gender",
  },
  {
    field: "fitnessGoal",
    text: "Fitness Goal",
  },
];

const genderOptions = [
  "Male",
  "Female",
  "Other",
];

const fitnessGoalOptions = [
  "bulk",
  "cut",
  "tone",
];

const inputValidations: Record<string, (str: string) => boolean> = {
  "age": (str: string) => {
    const parsed = Number(str);
    return Number.isInteger(parsed) && parsed > 0;
  },
  "gender": (str: string) => genderOptions.includes(str),
  "fitnessGoal": (str: string) => fitnessGoalOptions.includes(str),
}

let lastFetch = 0;
let lastUpdate = 1;
let cacheUser = {};

function checkUser(user: any) {
  return user.googleId && user.email;
}

function setLast() {
  lastFetch = lastUpdate;
}

function navEdit(navigate: NavigateFunction) {
  return () => {
    navigate("edit");
  };
}

function navBack(navigate: NavigateFunction) {
  return () => {
    navigate(".");
  };
}

function validateInput(attrName: string, value: string) {
  const func = inputValidations[attrName];
  if (!func) return true;
  return func(value);
}

function hasErrors(errors: any) {
  for (const key in errors) {
    if (errors[key as keyof typeof errors]) return true;
  }
  return false;
}

function Profile() {
  const [user, setUser]: [{
    fullName?: string,
    image?: string,
    age?: string,
    gender?: string,
    fitnessGoal?: string,
  }, ((value: any) => void)] = useState(cacheUser);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (lastFetch === lastUpdate && checkUser(user)) return;
    fetch(API_SERVER + '/api/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => {
        response.json()
          .then((data) => {
            let result = {};
            if (response.ok) {
              result = data.user;
              cacheUser = result;
            } else if (checkLogin(data, navigate)) {
              setError(`Failed to get user profile: ${data.error}`);
            }
            setLast();
            setUser(result);
          })
          .catch((err) => {
            if (response.ok) {
              setError(`Invalid server response: ${err}`);
            } else {
              setError(`Failed to get user profile. Status code: ${response.status}`)
            }
          });
      })
      .catch((err) => {
        setError(`Network request failed: ${err}`);
      });
    // eslint-disable-next-line
  }, []);
  const valid = checkUser(user);
  const msgElement = error ? (<ErrorDiv error={error} />) : (
    !valid && (
      <div className="Message">
        Loading user profile ...
      </div>
    )
  );
  const [inputs, setInputs]: [{
    age?: string,
    gender?: string,
    fitnessGoal?: string,
  }, ((value: any) => void)] = useState({});
  const [inputErrors, setInputErrors] = useState({
    age: false,
    gender: false,
    fitnessGoal: false,
  });
  const updateInputs = (attrName: string) => (e: ChangeEvent | SelectChangeEvent) => {
    // @ts-ignore
    if (!e.target) return;
    const newInputs = {...inputs};
    // @ts-ignore
    if (e.target.value !== user[attrName].toString()) {
      // @ts-ignore
      newInputs[attrName] = e.target.value;
    } else {
      delete newInputs[attrName as keyof typeof newInputs];
    }
    setInputs(newInputs);
    // @ts-ignore
    if (validateInput(attrName, e.target.value)) {
      if (inputErrors[attrName as keyof typeof inputErrors]) {
        const newErrors = {...inputErrors};
        newErrors[attrName as keyof typeof inputErrors] = false;
        setInputErrors(newErrors);
      }
    } else {
      if (!inputErrors[attrName as keyof typeof inputErrors]) {
        const newErrors = {...inputErrors};
        newErrors[attrName as keyof typeof inputErrors] = true;
        setInputErrors(newErrors);
      }
    }
  };
  const submit = () => {
    if (hasErrors(inputErrors)) return;
    console.log(JSON.stringify(inputs));
    fetch(API_SERVER + '/api/user/update', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    })
      .then((response) => {
        response.json()
          .then((data) => {
            if (response.ok) {
              let newUser = null;
              for (const key in data.user) {
                const oldValue = user[key as keyof typeof user];
                const newValue = data.user[key as keyof typeof data.user];
                if (oldValue !== undefined && newValue !== oldValue) {
                  if (!newUser) newUser = {...user};
                  newUser[key as keyof typeof newUser] = newValue;
                }
              }
              if (newUser) {
                setUser(newUser);
              }
              if (error) {
                setError("");
              }
              setInputs({});
              navigate(".");
            } else if (checkLogin(data, navigate)) {
              setError(`Failed to update user profile: ${data.error}`);
            }
          })
          .catch((err) => {
            if (response.ok) {
              setError(`Invalid server response: ${err}`);
            } else {
              setError(`Failed to update user profile. Status code: ${response.status}`)
            }
          });
      })
      .catch((err) => {
        setError(`Network request failed: ${err}`);
      });
  };
  const logout = () => {
    fetch(API_SERVER + '/api/logout', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => {
        response.json()
          .then((data) => {
            if (response.ok) {
              if (lastFetch === lastUpdate) lastUpdate = lastFetch ^ 1;
              cacheUser = {};
              localStorage.removeItem("login");
              navigate("/");
            } else {
              setError(`Failed to logout: ${data.error}`);
            }
          })
          .catch((err) => {
            if (response.ok) {
              setError(`Invalid server response: ${err}`);
            } else {
              setError(`Failed to logout. Status code: ${response.status}`)
            }
          });
      })
      .catch((err) => {
        setError(err.toString());
      });
  }
  return (
    <div className="Profile">
      <Routes>
        <Route path="" element={
          <div className="Profile-main">
            <div className="Profile-avatar">
              {valid && (
                <Avatar
                  sx={{ width: "30vmin", height: "30vmin", minWidth: "20px", minHeight: "20px", margin: "auto",
                    border: "3px solid #ffffff" }}
                  alt={user.fullName}
                  src={user.image}
                />
              )}
            </div>
            {msgElement}
            {valid && (
              <Stack spacing={4} margin="10px 0px 10px">
                <Box textAlign="center" sx={{fontSize: "max(6vmin,12px)", overflowWrap: "break-word"}}>
                  {user.fullName}
                </Box>
                <Box textAlign="center" margin="4px">
                  <Button variant="outlined" onClick={navEdit(navigate)}>Edit Profile</Button>
                </Box>
                <List dense={true}>
                  {
                    profileItems.map((element, index) => (
                      <ListItem key={index} sx={{border: "1px solid rgba(0, 0, 0, 0.12)"}} secondaryAction={
                        <ListItemText secondary={user[element.field as keyof typeof user]} />
                      }>
                        <ListItemText primary={element.text} />
                      </ListItem>
                    ))
                  }
                </List>
                <Box textAlign="center" margin="4px">
                  <Button variant="contained" onClick={logout}>Logout</Button>
                </Box>
              </Stack>
            )}
          </div>
        } />
        <Route path="edit" element={
          <div className="Profile-edit">
            <div className="Profile-header">
              <div className="Profile-header-left">
                <Button sx={{color: "#ffffff"}} startIcon={<ArrowBackIcon style={{fontSize: "max(8vmin,16px)"}} />}
                        onClick={navBack(navigate)}
                />
              </div>
              <div className="Profile-header-center">
                Profile Edit
              </div>
            </div>
            {msgElement}
            {valid && (
              <Stack spacing={1} margin="10px 0px 10px">
                <TextField id="profile-input-age" label="Age" variant="outlined"
                           value={inputs.age !== undefined ? inputs.age : user.age}
                           onChange={updateInputs("age")}
                           error={inputErrors.age} helperText={inputErrors.age && "Must be a positive integer."}
                />
                <FormControl variant="outlined">
                  <InputLabel id="profile-input-gender-label">Gender</InputLabel>
                  <Select
                    labelId="profile-input-gender-label"
                    id="profile-input-gender"
                    native={true}
                    label="Gender"
                    value={inputs.gender || user.gender}
                    onChange={updateInputs("gender")}
                    error={inputErrors.gender}
                  >
                    {
                      genderOptions.map((element, index) => (
                        <option key={index} value={element}>{element}</option>
                      ))
                    }
                  </Select>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel id="profile-input-fitness-goal-label">Fitness Goal</InputLabel>
                  <Select
                    labelId="profile-input-fitness-goal-label"
                    id="profile-input-fitness-goal"
                    native={true}
                    label="Fitness Goal"
                    value={inputs.fitnessGoal || user.fitnessGoal}
                    onChange={updateInputs("fitnessGoal")}
                    error={inputErrors.fitnessGoal}
                  >
                    {
                      fitnessGoalOptions.map((element, index) => (
                        <option key={index} value={element}>{element}</option>
                      ))
                    }
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  disabled={hasErrors(inputErrors) || Object.keys(inputs).length === 0}
                  onClick={submit}
                >
                  Submit
                </Button>
              </Stack>
            )}
          </div>
        } />
      </Routes>
    </div>
  );
}

export default Profile;
