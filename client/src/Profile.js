import React from 'react';
import './App.css';

function Profile(){

    return (

        <div className = "App">
            <header className='App-header'>
                <p> 
                    You are logged in :)
                </p>
                <a
                    className="App-link"
                    href={"/auth/logout"}
                >
                    Logout
                </a>
            </header>
        </div>



    );

}

export default Profile;