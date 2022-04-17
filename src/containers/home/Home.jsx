import React, { useEffect } from 'react';
import sampleBackground from '../../assets/images/sample_background.jpeg';

import Rankings from '../rankings/Rankings';

const Home = () => {

    useEffect(() => {
      window.scrollTo(0,0)
    }, [])

    return (
        <div className="home-wrapper">
            <img alt="" src={sampleBackground} width="100%" height="400px"/>
            <Rankings topTen/>
        </div>
    )
}

export default Home