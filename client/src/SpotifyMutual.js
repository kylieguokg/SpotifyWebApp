import React, { useState } from 'react';

// import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import {Search} from '@material-ui/icons';

import IconButton from '@mui/material/IconButton';
import axios from 'axios';

function setSearchString(searchString){
    console.log(searchString);
}

function setSearchResults(searchResults){
    console.log(searchResults);
}

const SpotifyMutual = ({auth}) => {

    console.log("got int!");

    const token = auth.token;
    const [searchResults, setSearchResults] = useState([]);
    const [searchString, storedState] = useState('');

    <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
        <InputBase
            sx = {{ml: 1, flex: 1}}
            placeholder = "Search for an artist"
            label = {"Search"}
            onChange={event => setSearchString(event.target.value)
            }
            value = {searchString}
        />

        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={searchSpotify}>
            <Search/>
        </IconButton>

    </Paper>






    return (<div> Hello I am logged in</div>)
}

const searchSpotify = async(searchString) => {

    const url = "https://api.spotify.com/v1/search";
    const searchQuery = encodeURIComponent(searchString);
    const typeQuery = 'artist';
    const {data} = await axios.get('${url}?q=${searchQuery}&type=${typeQuery}', {
        headers: {
            Authorization: 'Bearer ${token}',
        }
    });

    console.log(data);

    if (data && data.artists){
        setSearchResults(data.artists.items);
    }




}

export default SpotifyMutual;