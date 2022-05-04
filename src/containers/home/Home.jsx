import React, { useEffect } from 'react';
import playerOnCourt from '../../assets/images/player_on_court.jpg';
import { Rankings, TournamentCalendar } from '../index';

const Home = () => {

    useEffect(() => {
      window.scrollTo(0,0)
    }, [])

    return (
        <div className="home-wrapper">
            <img alt="" src={playerOnCourt} width="100%" height="400px"/>
            <Rankings topTen/>
            <TournamentCalendar nextTen/>
        </div>
    )
}

export default Home