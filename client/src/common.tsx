import {NavigateFunction} from "react-router-dom";
import {NOT_LOGGED_IN_MSG} from "./config";
import {Paper, styled} from "@mui/material";

export function checkLogin(data: { error: string; }, navigate: NavigateFunction) {
  if (data.error === NOT_LOGGED_IN_MSG) {
    localStorage.removeItem("login");
    navigate("/");
    return false;
  }
  return true;
}

const ErrorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  ...theme.typography.body1,
  textAlign: "center",
  backgroundColor: "rgba(255,255,0,0.5)",
  color: "#ff0000",
}));

// @ts-ignore
export function ErrorDiv({error}) {
  return (
    <ErrorPaper variant="outlined">
      {error}
    </ErrorPaper>
  );
}
