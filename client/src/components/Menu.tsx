import './Menu.css';
import React, {useEffect} from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {Location, useLocation, useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const tabs = [
  {
    id: 0,
    name: "Home",
    path: "/main/home",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Workout",
    path: "/main/workout",
    icon: FitnessCenterIcon,
  },
  {
    id: 2,
    name: "Chat",
    path: "/main/chat",
    icon: ChatIcon,
  },
  {
    id: 3,
    name: "Profile",
    path: "/main/profile",
    icon: PersonIcon,
  },
]
const id2Tabs = (() => {
  let res: Record<number, any> = {};
  tabs.forEach((tab) => {
    res[tab.id] = tab;
  });
  return res;
})();
const path2Tabs = (() => {
  let res: Record<string, any> = {};
  tabs.forEach((tab) => {
    res[tab.path] = tab;
  });
  return res;
})();

function getTabIndex(location: Location<any>) {
  const path = location.pathname.split("/").slice(0, 3).join("/");
  const tab = path2Tabs[path];
  if (tab) return tab.id;
  return false;
}

function Menu() {
  const location = useLocation();
  const [value, setValue] = React.useState(getTabIndex(location));
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(id2Tabs[newValue].path);
  };

  useEffect(() => {
    const newValue = getTabIndex(location);
    if (value !== newValue) setValue(newValue);
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <div className="Menu">
      <Tabs sx={{ width: "100vw", borderTop: 1, borderColor: 'divider' }} value={value} onChange={handleChange} variant="fullWidth">
        {tabs.map((tab, _) => (
          <Tab key={tab.id} value={tab.id} label={tab.name} icon={<tab.icon />} />
        ))}
      </Tabs>
    </div>
  );
}

export default Menu;
