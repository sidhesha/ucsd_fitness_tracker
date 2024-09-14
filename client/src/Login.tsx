import GoogleLoginButton from "./components/GoogleLoginButton";
import logo from './logo.png';
import './Login.css'

function Login() {
  return (
    <div className="Login">
      <div><img src={logo} className="App-logo" alt="logo" /></div>
      <header id="loginTitle"> UCSD <br/> Fitness </header>
      <GoogleLoginButton />
    </div>
  );
}

export default Login;
