import React, {useState, useEffect} from 'react';
import axios from 'axios'; // library to send web requests to backend and Spotify API
import './App.css';
import Home from "./Home";
// import Loading from "./Loading.js";
import SpotifyMutual from './SpotifyMutual';

function App() {

  const [auth, setAuth] = useState(null); // IF WE CHANGE THIS INITIAL VALUE WE GET DIFFERENT PAGES

  useEffect(() => {
    axios.get('/auth/current-session').then(({data}) =>{
        setAuth(data);
        console.log(data);
    })
  }, []);


  // if user not authenticated, loading screen
  if (auth === null) {
    return <Home/>
  }

  if (auth) {
    return <SpotifyMutual auth={auth}/>
  }

  // return <Home/>

}

export default App;
