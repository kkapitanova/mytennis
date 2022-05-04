import React from 'react';
import { useHistory } from 'react-router-dom';

import './About.scss';

const About = () => {
    const history = useHistory()

    return (
        <div className="container about">
            <h3 className="accent-color" style={{textAlign: 'left'}}>About MyTennis</h3>
            <div className="flex justify-between align-center">
                <div className="flex-column text-left description">
                    <div>My Tennis is the centralized online platform for amateur tennis players that provides up to date information about upcoming tournaments and amateur players aspiring to compete.</div>
                    <div>It provides opportunities for amateur tennis players to find other tennis players to either simply play a friendly game with, or compete against in various competitions around the globe.</div>
                    <div>Not only that, but it also helps popularize the sport among amateurs by allowing club representatives to use the platform to promote their tournaments and get people to sign up.</div>
                    <div>My Tennis's main purpose is to help increase and maintain the presence of the competitive spirit in the game - a very essential part of any competitive sport.</div>
                    <div>Can't wait to join? <span className="pointer underlined" onClick={() => history.push('/register')}>Register here!</span></div>
                </div>
            </div>
        </div>
    )
}

export default About